const { ampMapper } = require('./amp-mapper')
/**
 *
 * @param properties {[]}
 * @param getters
 * @return {[]}
 */
function propertyMapper (properties, getters) {
    return properties.map(p => ({
        ...p,
        amp: ampMapper(p.amp, getters)
    }))
}

module.exports = { propertyMapper }