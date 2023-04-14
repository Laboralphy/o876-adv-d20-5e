const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Un effet qui modifie la classe d'armure de base comme si on portait une armure magique
 * Différent de l'effet AC_BONUS qui ajoute des points d'AC au dessus du niveau de base
 * @param value
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_AC_BASE, value)
}

module.exports = {
    create
}