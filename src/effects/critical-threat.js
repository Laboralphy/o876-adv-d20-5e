const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect do nothing
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_CRITICAL_THREAT, value)
}

module.exports = {
    create
}
