const CONSTS = require('../../../consts')
/**
 * @typedef FeatReport {object}
 * @property feat {string}
 * @property active {boolean}
 * @property shouldBeActive {boolean}
 *
 * Renvoie la liste des feat qui ont des propriétés actuellement actives
 * Permet de déterminer, feat par feat, s'il y a des propriétés actives qui devraient être désactivée (à cause de condition non remplies)
 * et des propriétés inactives qui doivent être activées
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
    const aFeatSet = new Set(getters
        .getEffects
        .filter(eff => eff.subtype === CONSTS.EFFECT_SUBTYPE_FEAT)
        .map(eff => eff.tag)
    )
    // Pour chaque feat déclaré, vérifier s'il est actif, vérifier s'il devrait être actif
    return aAllFeats.map(feat => {
        const d = data[feat]
        // ce feat est actuellement actif si ses propriétés ont été trouvées dans la liste des prop innées
        const bCurrActive = aFeatSet.has(feat)
        // un feat d'action ? si oui alors ce feat n'est pas activable automatiquement
        const bActionFeat = 'action' in d
        // ce feat devrait être actif si son getter correspondant répond true
        const bShouldBeActive = 'when' in d
            ? getters[d.when]
            : true
        let nCounter = 0
        if (bActionFeat) {
            const oCounters = getters.getCounters
            if (feat in oCounters) {
                nCounter = oCounters[feat].value
            }
        }
        return {
            feat,
            active: bCurrActive,
            activable: bActionFeat,
            uses: nCounter,
            shouldBeActive: bShouldBeActive && !bActionFeat
        }
    })
}