const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect does nothing
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_DUMMY, 0, {})
}

/**
 * Doing nothing
 * @param effect
 * @param target
 */
function mutate ({ effect, target }) {
}


module.exports = {
    create,
    mutate
}
