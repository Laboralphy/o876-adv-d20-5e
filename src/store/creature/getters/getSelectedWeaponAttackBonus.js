const CONSTS = require('../../../consts')

function reduceAttackBonus (properties) {
    return properties
        .filter(ip => ip.property === 'attack-bonus' || ip.property === 'enhancement')
        .reduce((prev, curr) => prev + curr.amp, 0)
}

function resolveMeleeWeaponAttackBonus (oWeapon, state, getters) {
    const bFinesse = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)
    const oAbilities = getters.getAbilityValues
    const nStrength = oAbilities[CONSTS.ABILITY_STRENGTH]
    const nDexterity = oAbilities[CONSTS.ABILITY_DEXTERITY]
    const bDexIsBetter = nDexterity > nStrength
    const sOffensiveAbility = bFinesse && bDexIsBetter
        ? CONSTS.ABILITY_DEXTERITY
        : CONSTS.ABILITY_STRENGTH
    const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAbility]
    const bProficient = getters.isProficientSelectedWeapon
    const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
    const nWeaponBonus = reduceAttackBonus(oWeapon.properties)
    return nAbilityBonus + nProfBonus + nWeaponBonus
}

function resolveRangedWeaponAttackBonus (oWeapon, state, getters) {
    const nAbilityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    const bProficient = getters.isProficientSelectedWeapon
    const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
    const nWeaponBonus = reduceAttackBonus(getters.getRangedWeaponProperties)
    return nAbilityBonus + nProfBonus + nWeaponBonus
}

module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    return oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
        ? resolveRangedWeaponAttackBonus(oWeapon, state, getters)
        : resolveMeleeWeaponAttackBonus(oWeapon, state, getters)
}
