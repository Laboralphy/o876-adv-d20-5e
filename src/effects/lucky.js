const createEffect = require('./abstract')
const CONSTS = require('../consts')
const VARIABLES = require('../data/variables.json')

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

function isLucky (effect) {
    if (effect.amp >= VARIABLES.LUCKY_AMP_THRESHOLD) {
        effect.amp = 0
        return true
    } else {
        ++effect.amp
        return false
    }
}

function attack ({ effect, target, data }) {
    const { outcome } = data
    if (!outcome.hit) {
        if (isLucky(effect)) {
            outcome.hit = true
        }
    }
}

function check ({ effect, data }) {
    const { outcome } = data
    if (!outcome.success) {
        if ((20 + outcome.bonus) >= outcome.dc) {
            if (isLucky(effect)) {
                outcome.roll = 20
                outcome.total = outcome.roll + outcome.bonus
                outcome.success = outcome.total >= outcome.dc
            }
        }
    }
}

module.exports = {
    create,
    attack,
    check
}
