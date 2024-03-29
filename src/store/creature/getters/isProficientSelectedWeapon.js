const CONSTS = require('../../../consts')

/**
 * Renvoie true si la créature est compétente dans le maniement de son arme
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    return oWeapon
        ? (
            getters.getProficiencies.includes(oWeapon.proficiency) ||
            getters.getProficiencies.includes(oWeapon.weaponType) ||
            oWeapon.itemType === CONSTS.ITEM_TYPE_NATURAL_WEAPON
        )
        : true
}
