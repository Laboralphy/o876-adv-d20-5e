/**
 * Renvoie la liste des spell qui affecte la créature
 * @return Set<string>
 */
module.exports = (state, getters) => {
    return getters.getEffects.reduce((prev, curr) => {
        const s = curr.data.spellmark?.spell
        if (s) {
            prev.add(s)
        }
        return prev
    }, new Set())
}