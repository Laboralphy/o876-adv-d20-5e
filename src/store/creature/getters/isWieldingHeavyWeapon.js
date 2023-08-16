const CONSTS = require("../../../consts");

/**
 * Renvoie true si la creature porte une arme lourde (mélée ou distance)
 * @param state
 * @param getters
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const w = getters.getSelectedWeapon
    if (w) {
        const wa = w.attributes
        return wa.includes(CONSTS.WEAPON_ATTRIBUTE_HEAVY)
    } else {
        return false
    }
}
