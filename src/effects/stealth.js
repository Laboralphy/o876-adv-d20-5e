const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect do nothing
 * @returns {D20Effect}
 */
function create () {
    const oEffect = createEffect(CONSTS.EFFECT_STEALTH, 0, { detectedBy: [] })
    oEffect.unicity = CONSTS.EFFECT_UNICITY_NO_REPLACE
    return oEffect
}

function attack ({ effect, source }) {
    source.store.mutations.dispelEffect({ effect })
}

module.exports = {
    create,
    attack
}
