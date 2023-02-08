const { createExtraProperty } = require('../common/create-extra-property')

module.exports = ({ state }, { property, parameters, tag = '' }) => {
    state.properties.push(createExtraProperty(property, parameters, tag))
}
