const { createExtraProperty } = require('../common/create-extra-property')

module.exports = ({ state, getters, externals }) => {
    const aFeatReport = getters.getFeatReport
    aFeatReport.forEach(({ feat, active, shouldBeActive }) => {
        if (!active && shouldBeActive) {
            // il faut activer les propriétés de ce feat
            const { properties } = externals.data[feat]
            properties.forEach(({ property, parameters }) => {
                state.properties.push(createExtraProperty(property, parameters, feat))
            })
        } else if (active && !shouldBeActive) {
            // il faut désactiver les propriétés de ce feat
            const sp = state.properties
            for (let i = sp.length - 1; i >= 0; --i) {
                if (sp[i].tag === feat) {
                    sp.splice(i, 1)
                }
            }
        }
    })
}