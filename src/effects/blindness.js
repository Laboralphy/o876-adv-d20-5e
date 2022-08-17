const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect do nothing
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_BLINDNESS, 1)
}

module.exports = {
    create
}
