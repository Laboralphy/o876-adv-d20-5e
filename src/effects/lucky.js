const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * If your attack misses a target within range, you can turn the miss into a hit.
 * Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.
 * @returns {D20Effect}
 */
function create () {
    const oEffect = createEffect(CONSTS.EFFECT_LUCKY)
    oEffect.unicity = CONSTS.EFFECT_UNICITY_NO_REPLACE
    return oEffect
}

function mutate ({ effect }) {
    if (effect.amp < 20) {
        ++effect.amp
    }
}

module.exports = {
    create,
    mutate
}
