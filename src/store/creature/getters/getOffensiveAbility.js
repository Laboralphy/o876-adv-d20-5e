const CONSTS = require("../../../consts");

/**
 * Renvoie le bonus d'attaque généré par l'arme actuellement équipée
 * @param state
 * @param getters
 * @returns {string}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
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
