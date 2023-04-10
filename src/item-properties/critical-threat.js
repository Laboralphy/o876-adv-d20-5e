const CONSTS = require('../consts')

module.exports = function ({ value }) {
    return {
        property: CONSTS.ITEM_PROPERTY_CRITICAL_THREAT,
        amp: value,
        data: {}
    }
}