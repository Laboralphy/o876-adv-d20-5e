const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect increase weapon damage output when the attack is sneakable
 * The "sneakability" is computed by main engine.
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_SNEAK_ATTACK, value, { hasUsedSneakAttack: false })
}

function mutate ({ effect, target, source }) {
    effect.data.hasUsedSneakAttack = false
}

function attack ({ effect, source: oAttacker, data }) {
    const { outcome } = data
    if (outcome.hit && outcome.sneakable && !effect.data.hasUsedSneakAttack && oAttacker.getTargetTarget() !== oAttacker) {
        const bAdequateRangedWeapon = outcome.weapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED) && outcome.ammo !== null
        const bAdequateMeleeWeapon = outcome.weapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)

        if (bAdequateRangedWeapon || bAdequateMeleeWeapon) {
            const oWeapon = outcome.weapon
            const sSneakDice = effect.amp + 'd6'
            const nSneakDamage = oAttacker.roll(sSneakDice)
            const oDamageBonus = outcome.damages.types
            if (!(oWeapon.damageType in oDamageBonus)) {
                oDamageBonus[oWeapon.damageType] = 0
            }
            oDamageBonus[oWeapon.damageType] += nSneakDamage
            outcome.damages.amount += nSneakDamage
            effect.data.hasUsedSneakAttack = true
            oAttacker.events.emit('sneak-attack', {
                dice: sSneakDice,
                damage: nSneakDamage,
                target: outcome.target
            })
        }
    }
}

module.exports = {
    create,
    mutate,
    attack
}
