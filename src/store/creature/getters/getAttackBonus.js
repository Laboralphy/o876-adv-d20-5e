const CONSTS = require('../../../consts')

/**
 * Renvoie l'attaque bonus généré par les propriété spécifiée
 * @param properties {array}
 * @returns {number}
 */
function reduceAttackBonus (properties) {
    return properties
        .filter(ip => ip.property === CONSTS.ITEM_PROPERTY_ENHANCEMENT || ip.property === CONSTS.ITEM_PROPERTY_ATTACK_BONUS)
        .reduce((prev, curr) => prev + curr.amp, 0)
}

/**
 * Calcule l'attaque bonus de l'arme de mélée spécifiée
 * @param oWeapon {D20Item}
 * @param state
 * @param getters
 * @returns {number}
 */
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
    const nWeaponBonus = reduceAttackBonus(oWeapon.properties)
    return nAbilityBonus + nWeaponBonus
}

/**
 * liste des propriétés générant un bonus d'attaque par l'arme à distance spécifié et les munitions éventuellement équipées
 * @param oWeapon
 * @param state
 * @param getters
 * @returns {*[]}
 */
function getRangedWeaponProperties (oWeapon, state, getters) {
    const oAmmo = state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO]
    const aWeaponProp = oWeapon ? oWeapon.properties : []
    const aAmmoProp = oAmmo ? oAmmo.properties : []
    return [
        ...aWeaponProp,
        ...aAmmoProp
    ]
}

/**
 * Calcule l'attaque bonus de l'arme à distance spécifiée
 * @param oWeapon
 * @param state
 * @param getters
 * @returns {number}
 */
function resolveRangedWeaponAttackBonus (oWeapon, state, getters) {
    const nAbilityBonus = getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]
    const nWeaponBonus = reduceAttackBonus(getRangedWeaponProperties(oWeapon, state, getters))
    return nAbilityBonus + nWeaponBonus
}

/**
 * Renvoie le bonus d'attaque généré par l'arme actuellement équipée
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const bProficient = getters.isProficientSelectedWeapon
    const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
    const oWeapon = getters.getSelectedWeapon
    return oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
        ? nProfBonus + resolveRangedWeaponAttackBonus(oWeapon, state, getters)
        : nProfBonus + resolveMeleeWeaponAttackBonus(oWeapon, state, getters)
}
