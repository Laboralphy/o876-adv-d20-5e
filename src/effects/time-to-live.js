const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect trigger a creature self destruction after expiration
 * Usefull for summoned creature
 * @returns {D20Effect}
 */
function create () {
    const oEffect = createEffect(CONSTS.EFFECT_TIME_TO_LIVE, 0)
    oEffect.subtype = CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY
    return oEffect
}

function dispose ({ target }) {
    target.requestDespawn(CONSTS.DESPAWN_REASON_EXPIRATION)
}

module.exports = {
    create,
    dispose
}