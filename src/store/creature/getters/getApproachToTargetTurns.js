/**
 * Renvoie le nombre de tours nécessaires à une créature pour mettre sa cible à portée de son arme
 * @param state {*}
 * @param getters {D20CreatureStoreGetters}
 * @return {number}
 */
module.exports = (state, getters) => {
    const nSpeed = getters.getSpeed
    if (nSpeed === 0) {
        // Vitesse 0 = temps infini
        return Infinity
    }
    const nDistance = getters.getTargetDistance - getters.getSelectedWeaponRange
    if (nDistance <= 0) {
        // Déjà à portée
        return 0
    }
    return Math.ceil(nDistance / nSpeed)
}