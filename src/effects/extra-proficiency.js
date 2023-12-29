const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect adds a proficiency
 * @param proficiency {string}
 * @returns {D20Effect}
 */
function create (proficiency) {
    return createEffect(CONSTS.EFFECT_EXTRA_PROFICIENCY, 0, { proficiency })
}

module.exports = {
    create
}