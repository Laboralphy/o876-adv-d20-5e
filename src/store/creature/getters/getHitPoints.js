/**
 * Renvoie le nombre de HP restant
 * @return {number}
 */
module.exports = (state, getters) => getters.getMaxHitPoints - state.gauges.damage
