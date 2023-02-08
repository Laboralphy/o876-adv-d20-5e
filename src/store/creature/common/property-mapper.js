/**
 *
 * @param properties {[]}
 * @param getters
 * @return {[]}
 */
function propertyMapper (properties, getters) {
    return properties.map(p => ({
        ...p,
        amp: typeof p.amp === 'number' ? p.amp : getters[p.amp] || -1
    }))
}

module.exports = { propertyMapper }