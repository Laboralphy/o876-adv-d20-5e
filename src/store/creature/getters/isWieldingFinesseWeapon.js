const CONSTS = require("../../../consts");

/**
 * Renvoie true si la creature porte une arme de mélée lourde
 * @param state
 * @param getters
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const w = getters.getSelectedWeapon
    if (w) {
        const wa = w.attributes
        return wa.includes(CONSTS.WEAPON_ATTRIBUTE_FINESSE)
    } else {
        return false
    }
}
