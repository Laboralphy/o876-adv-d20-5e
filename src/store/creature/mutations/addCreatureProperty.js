const { v4: uuidv4 } = require('uuid')

module.exports = ({ state }, { property, tag = '' }) => {
    state.properties.push({
        ...property,
        id: uuidv4({}, null, 0),
        tag
    })
}
