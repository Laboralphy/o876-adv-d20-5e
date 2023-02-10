const { propertyMapper } = require('../common/property-mapper')

/**
 * Liste des effets actifs sur la créature
 * @param state
 * @param getters
 * @returns {[]}
 */
module.exports = (state, getters) =>
    propertyMapper(
        state
            .effects
            .filter(eff => eff.duration > 0),
        getters
    )
