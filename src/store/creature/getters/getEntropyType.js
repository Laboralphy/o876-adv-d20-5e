const CONSTS = require('../../../consts')
const V13 = 1 / 3

/**
 * Indicateur d'entropy de la créature (loyal, neutre, chaotique)
 * @param state
 * @returns {string}
 */
module.exports = state => {
    if (state.alignment.entropy < -V13) {
        return CONSTS.ALIGNMENT_ENTROPY_LAWFUL
    }
    if (state.alignment.entropy > V13) {
        return CONSTS.ALIGNMENT_ENTROPY_CHAOTIC
    }
    return CONSTS.ALIGNMENT_ENTROPY_NEUTRAL
}