/**
 * Liste des effets actifs sur la créature
 * @param state
 * @param getters
 * @returns {Set<string>}
 */
module.exports = (state, getters) =>
        getters
            .getEffects
            .reduce((prev, curr) => {
                prev.add(curr.type)
                return prev
            }, new Set())

