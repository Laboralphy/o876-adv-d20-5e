const { v4: uuidv4 } = require('uuid')
const extraProperties = require('../../../extra-properties')

function createExtraProperty (sProperty, oParameters, tag = '') {
    if (!(sProperty in extraProperties)) {
        throw new Error('This property is unknown: ' + sProperty)
    }
    const p = extraProperties[sProperty](oParameters)
    p.id = uuidv4({}, null, 0)
    p.tag = tag
    return p
}

module.exports = {
    createExtraProperty
}
