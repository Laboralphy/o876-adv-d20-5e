const { v4: uuidv4 } = require('uuid')
const extraProperties = require('../../../extra-properties')

function createExtraProperty (sProperty, oParameters, tag = '') {
    const p = extraProperties[sProperty](oParameters)
    p.id = uuidv4({}, null, 0)
    p.tag = tag
    return p
}

module.exports = {
    createExtraProperty
}
