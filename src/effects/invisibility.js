const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect do nothing
 * @param bGreater {boolean} si vrai alors l'effet ne s'interrompt pas lors d'une attaque
 * @returns {D20Effect}
 */
function create (bGreater) {
    return createEffect(CONSTS.EFFECT_INVISIBILITY, bGreater ? 1 : 0)
}

function attack ({ effect }) {
    if (effect.amp === 0) {
        effect.duration = 0
    }
}

module.exports = {
    create,
    attack
}
