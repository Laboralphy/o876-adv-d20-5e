const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect permit a creature to see invisible creature
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_SEE_INVISIBILITY, 0)
}

module.exports = {
    create
}
