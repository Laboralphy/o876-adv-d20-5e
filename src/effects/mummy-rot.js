const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect double healing amounts
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_MUMMY_ROT, 0)
}

module.exports = {
    create
}
