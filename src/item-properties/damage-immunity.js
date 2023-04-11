const CONSTS = require('../consts')

module.exports = function ({ type = '' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_DAMAGE_IMMUNITY,
        data: {
            type
        }
    }
}