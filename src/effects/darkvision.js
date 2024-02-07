const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect permit a creature to see in dark areas.
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_DARKVISION, 0)
}

module.exports = {
    create
}
