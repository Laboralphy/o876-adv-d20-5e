const CONSTS = require('../../../consts')
const V13 = 1 / 3

/**
 * Renvoie le type de moralité (good, neutral, evil)
 * @param state
 * @returns {string}
 */
module.exports = state => {
    if (state.alignment.morality < -V13) {
        return CONSTS.ALIGNMENT_MORALITY_EVIL
    }
    if (state.alignment.morality > V13) {
        return CONSTS.ALIGNMENT_MORALITY_GOOD
    }
    return CONSTS.ALIGNMENT_MORALITY_NEUTRAL
}