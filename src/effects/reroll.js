const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect reroll dice when its value is lower than amp
 * @returns {D20Effect}
 */
function create (value, when) {
    return createEffect(CONSTS.EFFECT_REROLL, value, { when })
}

module.exports = {
    create
}
