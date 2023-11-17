const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect do nothing
 * @returns {D20Effect}
 */
function create () {
    const oEffect =  createEffect(CONSTS.EFFECT_INVISIBILITY, 0)
    oEffect.unicity = CONSTS.EFFECT_UNICITY_NO_REPLACE
    return oEffect
}

module.exports = {
    create
}
