/**
 * Renvoie la liste des créatures qui sont la source des effets appliqué
 * Exclue la créature elle même
 * @return {string[]}
 */
module.exports = (state, getters) => {
    const aCreatures = new Set()
    getters.getEffects.forEach(eff => {
        if (eff.source !== state.id) {
            aCreatures.add(eff.source)
        }
    })
    return Array.from(aCreatures)
}
