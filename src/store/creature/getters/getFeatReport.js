/**
 * @typedef FeatReport {object}
 * @property feat {string}
 * @property active {boolean}
 * @property shouldBeActive {boolean}
 *
 * Renvoie la liste des feat qui ont des propriétés actuellement active
 * @param state
 * @param getters
 * @param externals
 * @return {FeatReport[]}
 */
module.exports = (state, getters, externals) => {
    const { data } = externals
    // Tous les feat déclaré sur la créature
    const aAllFeats = state.feats
    // ensemble des feats qui ont des propriétés actuellement appliquées sur la creature
    const aFeatSet = new Set(state
        .properties
        .map(p => p.tag)
        .filter(tag => tag !== undefined && tag.startsWith('feat-') && (tag in data))
    )
    // Pour chaque feat déclaré, vérifier s'il est actif, vérifier s'il devrait être actif
    return aAllFeats.map(feat => {
        const d = data[feat]
        // ce feat est actuellement actif si ses propriétés ont été trouvées dans la liste des prop innées
        const bCurrActive = aFeatSet.has(feat)
        // ce feat devrait être actif si son getter correspondant répond true
        const bShouldBeActive = 'when' in d
            ? getters[d.when]
            : true
        return {
            feat,
            active: bCurrActive,
            shouldBeActive: bShouldBeActive
        }
    })
}