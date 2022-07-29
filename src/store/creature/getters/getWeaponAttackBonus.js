const CONSTS = require('../../../consts')

function getWeaponAttackBonus (oWeapon) {
    return oWeapon
        .properties
        .filter(ip => ip.property === 'attack-bonus' || ip.property === 'enhancement')
        .reduce((prev, curr) => prev + curr.amp, 0)
}

function resolveMeleeWeaponAttackBonus (oWeapon, state, getters) {
    const bFinesse = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)
    const oAbilities = getters.getAbilityValues
    const nStrength = oAbilities[CONSTS.ABILITY_STRENGTH]
    const nDexterity = oAbilities[CONSTS.ABILITY_DEXTERITY]
    const bDexIsBetter = nDexterity > nStrength
    const sOffensiveAttribute = bFinesse && bDexIsBetter
        ? CONSTS.ABILITY_DEXTERITY
        : CONSTS.ABILITY_STRENGTH
    const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAttribute]
    const bProficient = getters.isProficientSelectedWeapon
    const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
    const nWeaponBonus = getWeaponAttackBonus(oWeapon)
    return nAbilityBonus + nProfBonus + nWeaponBonus
}

function resolveRangedWeaponAttackBonus (oWeapon, state, getters) {
    const nAbilityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    const bProficient = getters.isProficientRangedWeapon
    const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
    const nWeaponBonus = getWeaponAttackBonus(oWeapon)
    return nAbilityBonus + nProfBonus + nWeaponBonus
}

module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    const bFinesse = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)
    const oAbilities = getters.getAbilityValues
    const nStrength = oAbilities[CONSTS.ABILITY_STRENGTH]
    const nDexterity = oAbilities[CONSTS.ABILITY_DEXTERITY]
    const bDexIsBetter = nDexterity > nStrength
    const sOffensiveAttribute = bFinesse && bDexIsBetter
        ? CONSTS.ABILITY_DEXTERITY
        : CONSTS.ABILITY_STRENGTH
    const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAttribute]
    const bProficient = getters.isProficientSelectedWeapon
    const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
    const nWeaponBonus = oWeapon
        .properties
        .filter(ip => ip.property === 'attack-bonus' || ip.property === 'enhancement')
        .reduce((prev, curr) => prev + curr.amp, 0)
    return nAbilityBonus + nProfBonus + nWeaponBonus
}
