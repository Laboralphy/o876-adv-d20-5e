const { v4: uuidv4 } = require('uuid')
const itemProperties = require('../../../item-properties')

function createItemProperty (sProperty, oParameters, tag = '') {
    if (!(sProperty in itemProperties)) {
        throw new Error('This property is unknown: ' + sProperty)
    }
    const p = itemProperties[sProperty](oParameters)
    p.id = uuidv4({}, null, 0)
    p.tag = tag
    return p
}

module.exports = {
    createItemProperty
}
