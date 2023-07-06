const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Cet effet réduit le nombre de PV maximum et transfère ces points à la source de l'effet en tant que soin
 *
 * @param hitPoints {number}
 * @returns {D20Effect}
 */
function create (hitPoints) {
    return createEffect(CONSTS.EFFECT_LIFE_DRAIN, hitPoints)
}

function mutate ({ effect, target, source }) {

}

module.exports = {
    create
}
