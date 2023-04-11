const CONSTS = require('../consts')

module.exports = function ({ condition = '' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_CONDITION_IMMUNITY,
        data: {
            condition
        }
    }
}