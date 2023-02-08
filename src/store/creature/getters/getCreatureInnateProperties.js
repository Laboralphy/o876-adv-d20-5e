const { propertyMapper } = require("../common/property-mapper");
/**
 * Liste des propriétés intrinseques de la créature
 * @param state
 * @param getters
 * @returns {[]}
 */
module.exports = (state, getters) => propertyMapper(state.properties, getters)
