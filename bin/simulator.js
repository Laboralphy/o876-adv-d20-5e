const Rules = require('../src/Rules')
const CONSTS = require('../src/consts')
const util = require('util')

function choose (aStrings) {
    return aStrings[Math.floor(Math.random() * aStrings.length)]
}

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

function explainDamages (damageTypes) {
    const aDamTypesStr = []
    for (const [sType, nAmount] of Object.entries(damageTypes)) {
        aDamTypesStr.push(nAmount + ' ' + sType.substring(12).toLowerCase())
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
        types: damageTypes = {}
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
                explainDamages(damageTypes)
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
                explainDamages(damageTypes)
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


function creatureAttacked ({
                               outcome,
                               creature
                           }) {
    console.log(explainAttack(creature, outcome).message)
}

function assault (rules, atk, def) {
    rules.attack(atk)
    console.log(def.name, 'has', def.store.getters.getHitPoints, 'hp left')
}

function bonusAction (rules, creature) {
    if (!creature.store.getters.isTargetInMeleeWeaponRange) {
        rules.walkToTarget(creature)
        console.log(creature.name, 'is now at', creature.store.getters.getDistanceToTarget, 'ft. from', creature.getTarget().name)
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
    const c1 = r.createEntity('c-pilgrim')
    const c2 = r.createEntity('c-street-rogue')
    const c3 = r.createEntity('c-soldier')
    c1.name = 'Alice'
    c2.name = 'Bob'
    c3.name = 'Jorin'
    fight(r, c3, c2)
}

main()
