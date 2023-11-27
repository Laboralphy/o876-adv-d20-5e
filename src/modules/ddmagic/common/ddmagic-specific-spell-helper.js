const CONSTS = require('../../../consts')

function getCantripDamageDice (caster, sBaseDice) {
    const d = 'd' + sBaseDice
    const nCasterLevel = caster.store.getters.getWizardLevel
    if (nCasterLevel >= 17) {
        return '4' + d
    } else if (nCasterLevel >= 11) {
        return '3' + d
    } else if (nCasterLevel >= 5) {
        return '2' + d
    } else {
        return '1' + d
    }
}

function rangedAttack (caster) {
    const nProfBonus = caster.store.getters.getProficiencyBonus
    const sAbility = CONSTS.ABILITY_INTELLIGENCE
    const nAbilityModifier = caster.store.getters.getAbilityModifiers[sAbility]
    const { value, circumstances } = caster.rollD20(CONSTS.ROLL_TYPE_ATTACK, sAbility)
    const nAtkRoll = nProfBonus + nAbilityModifier + value
    const target = caster.getTarget()
    if (!target) {
        throw new Error('ERR_NO_TARGET')
    }
    const ac = target.store.getters.getArmorClass
    const hit = nAtkRoll >= ac
    caster.events.emit('spell-ranged-attack', {
        target,
        hit
    })
    return {
        attack: nAtkRoll,
        ac,
        hit,
        circumstances
    }
}

module.exports = {
    getCantripDamageDice,
    rangedAttack
}