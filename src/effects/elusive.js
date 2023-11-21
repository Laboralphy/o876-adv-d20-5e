const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Protect from advantaged attack rolls
 * @returns {D20Effect}
 */
function create () {
    const oEffect = createEffect(CONSTS.EFFECT_ELUSIVE)
    oEffect.unicity = CONSTS.EFFECT_UNICITY_NO_REPLACE
    return oEffect
}

module.exports = {
    create
}
