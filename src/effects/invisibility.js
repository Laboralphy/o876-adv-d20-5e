const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect do nothing
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_INVISIBILITY, 0)
}

module.exports = {
    create
}
