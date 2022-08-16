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

function getOffensiveAbility (oWeapon, state, getters) {
    if (oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
        return CONSTS.ABILITY_DEXTERITY
    } else {
        const bFinesse = oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)
        const oAbilities = getters.getAbilityValues
        const nStrength = oAbilities[CONSTS.ABILITY_STRENGTH]
        const nDexterity = oAbilities[CONSTS.ABILITY_DEXTERITY]
        const bDexIsBetter = nDexterity > nStrength
        return bFinesse && bDexIsBetter
            ? CONSTS.ABILITY_DEXTERITY
            : CONSTS.ABILITY_STRENGTH
    }
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
    const sOffensiveAbility = getOffensiveAbility(oWeapon, state, getters)
    const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAbility]
    const nWeaponBonus = reduceAttackBonus(getters.getSelectedWeaponProperties)
    return nAbilityBonus + nWeaponBonus + nProfBonus
}
