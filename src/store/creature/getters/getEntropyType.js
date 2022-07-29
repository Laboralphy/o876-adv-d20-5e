const CONSTS = require('../../../consts')
const V13 = 1 / 3

module.exports = state => {
    if (state.alignment.entropy < -V13) {
        return CONSTS.ALIGNMENT_ENTROPY_LAWFUL
    }
    if (state.alignment.entropy > V13) {
        return CONSTS.ALIGNMENT_ENTROPY_CHAOTIC
    }
    return CONSTS.ALIGNMENT_ENTROPY_NEUTRAL
}