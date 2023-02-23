const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect does nothing
 * @param amp {number}
 * @param data {{}}
 * @returns {D20Effect}
 */
function create (amp, data) {
    return createEffect(CONSTS.EFFECT_DUMMY, amp, {
        ...data
    })
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
