const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect emit light
 * @param value {number} light intensity
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_LIGHT, value)
}

module.exports = {
    create
}