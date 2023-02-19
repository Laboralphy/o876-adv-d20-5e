const { createFeatEffect } = require('../common/create-effect')

module.exports = ({ state, getters, externals }) => {
    const aFeatReport = getters.getFeatReport
    aFeatReport.forEach(({ feat, active, shouldBeActive }) => {
        if (externals.data[feat].effects) {
            if (!active && shouldBeActive) {
                // il faut activer les propriétés de ce feat
                const { effects } = externals.data[feat]
                effects.forEach(effDef => {
                    const eff = createFeatEffect(feat, getters.getId, ...effDef)
                    state.effects.push(eff)
                })
            } else if (active && !shouldBeActive) {
                // il faut désactiver les propriétés de ce feat
                const sp = getters.getEffects
                for (let i = sp.length - 1; i >= 0; --i) {
                    const { tag, id } = sp[i]
                    if (tag === feat) {
                        const nIndex = state.effects.findIndex(eff => eff.id === id)
                        if (nIndex >= 0) {
                            state.effects[nIndex].duration = 0
                        }
                    }
                }
            }
        }
    })
}