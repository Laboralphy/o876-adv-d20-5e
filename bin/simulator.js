const Rules = require('../src/Manager')
const util = require('util')


function explainMiss (name, sDeflector) {
    switch (sDeflector) {
        case 'armor': {
            return 'could not penetrate ' + name + "\'s armor"
        }
        case 'shield': {
            return 'is deflected by ' + name + "\'s shield"
        }
        case 'dexterity': {
            return 'is dodged because of ' + name + "\'s high dexterity"
        }
        case 'props': {
            return 'deflected by ' + name + "\'s defensive equipment"
        }
        case 'effect': {
            return 'has no effect on ' + name + " because of some sort of magical protection or enchantment"
        }
        default: {
            return 'is deflected by an unknown force : ' + sDeflector
        }
    }
}

function getDamageStr(sType) {
    return sType.substring(12).toLowerCase()
}

function explainDamages (damageTypes, resisted) {
    const aDamTypesStr = []
    for (const [sType, nAmount] of Object.entries(damageTypes)) {
        aDamTypesStr.push(nAmount + ' ' + getDamageStr(sType))
    }
    for (const [sType, nAmount] of Object.entries(resisted)) {
        if (nAmount > 0) {
            aDamTypesStr.push('resisted: ' + nAmount + ' ' + getDamageStr(sType))
        }
    }
    return aDamTypesStr.join(', ')
}
/**
 * @param creature {Creature}
 * @param oOutcome {AttackOutcome}
 */
function explainAttack (creature, {
    ac,
    distance,
    range,
    bonus,
    roll,
    critical,
    hit,
    dice,
    deflector,
    target,
    weapon,
    damages: {
        amount: damageAmount = 0,
        types: damageTypes = {},
        resisted
    }
}) {
    if (range < distance) {
        // target out of range
        return {
            type: 'OUT_OF_RANGE',
            message: util.format('%s cannot attack %s with %s : out of range', creature.name, target.name, weapon.ref)
        }
    } else if (critical) {
        // target critical hit
        return {
            type: 'CRITICAL_HIT',
            message: util.format(
                '%s attacks %s with %s [%d + %d = %d vs. %d] and does a critical hit, dealing %d damage points (%s)',
                creature.name,
                target.name,
                weapon.ref,
                dice,
                bonus,
                roll,
                ac,
                damageAmount,
                explainDamages(damageTypes, resisted)
            )
        }
    } else if (hit) {
        // target hit
        return {
            type: 'REGULAR_HIT',
            message: util.format(
                '%s attacks %s with %s [%d + %d = %d vs. %d] and deals %d damage points (%s)',
                creature.name,
                target.name,
                weapon.ref,
                dice,
                bonus,
                roll,
                ac,
                damageAmount,
                explainDamages(damageTypes, resisted)
            )
        }
    } else if (dice === 1) {
        // target critical miss
        return {
            type: 'CRITICAL_MISS',
            message: util.format(
                '%s attacks %s with %s [%d + %d = %d vs. %d] but the attack totally missed its target',
                creature.name,
                target.name,
                weapon.ref,
                dice,
                bonus,
                roll,
                ac
            )
        }
    } else {
        // regular miss
        return {
            type: 'REGULAR_MISS',
            message: util.format(
                '%s attacks %s with %s [%d + %d = %d vs. %d] but the attack %s',
                creature.name,
                target.name,
                weapon.ref,
                dice,
                bonus,
                roll,
                ac,
                explainMiss(target.name, deflector)
            )
        }
    }
}

function creatureSavingThrow (oPayload) {
    console.log('%s saving throw : %d vs. %d : %s', oPayload.creature.name, oPayload.value, oPayload.dc, oPayload.success ? 'SUCCESS' : 'FAILURE')
}


function creatureAttacked ({
    outcome,
    creature
}) {
    console.log(explainAttack(creature, outcome).message)
}

function creatureAction ({ creature, action }) {
    console.log('%s is doing an action : %s', creature.name, action)
}

function creatureDamaged ({ creature, amount, type: sDamType, source }) {
    console.log('%s deals %d points of %s damage on %s', source.name, amount, getDamageStr(sDamType), creature.name)
}

function creatureDied ({ creature, killer }) {
    console.log('%s killed %s', killer.name, creature.name)
}

function action (rules, oCreature) {
    const aActions = rules.getData(oCreature).actions
    if (aActions && aActions.length > 0) {
        const sAction = aActions[Math.floor(Math.random() * aActions.length)]
        oCreature.action(sAction)
    }
}

function assault (rules, atk, def) {
    if (rules.getData(atk).actions.length > 0 && Math.random() > 0.8) {
        action(rules, atk)
    } else {
        rules.attack(atk)
    }
    console.log(def.name, 'has', def.store.getters.getHitPoints, 'hp left')
}

function walkToTarget (oAttacker) {
    const nDistance = oAttacker.store.getters.getTargetDistance - oAttacker.store.getters.getSpeed
    oAttacker.setDistanceToTarget(nDistance)
}

function bonusAction (rules, creature) {
    // walking
    if (!creature.store.getters.isTargetInWeaponRange) {
        walkToTarget(creature)
        console.log(creature.name, 'is now at', creature.store.getters.getTargetDistance, 'ft. from', creature.getTarget().name)
    }
}

function fight (rules, c1, c2) {
    let a = c1, d = c2
    a.setTarget(d)
    d.setTarget(a)
    console.log(a.name, 'has', a.store.getters.getHitPoints, 'hp')
    console.log(d.name, 'has', d.store.getters.getHitPoints, 'hp')
    while (a.store.getters.getHitPoints > 0 && d.store.getters.getHitPoints > 0) {
        assault(rules, a, d)
        bonusAction(rules, a)
        const a0 = a
        a = d
        d = a0
    }
}

function main () {
    const r = new Rules()
    r.init()
    r.events.on('attack', creatureAttacked)
    r.events.on('action', creatureAction)
    r.events.on('damaged', creatureDamaged)
    r.events.on('saving-throw', creatureSavingThrow)
    r.events.on('death', creatureDied)
    const c1 = r.createEntity('c-pilgrim')
    const c2 = r.createEntity('c-rogue')
    const c3 = r.createEntity('c-soldier')
    const c4 = r.createEntity('c-gnoll')
    const c5 = r.createEntity('c-gargoyle')
    c1.name = 'Alice'
    c2.name = 'Bob'
    c3.name = 'Jorin'
    c4.name = 'Gnoll'
    c5.name = 'Gargoyle'
    fight(r, c3, c5)
}

main()
