const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_CONDITION_IMMUNITY
 * @param condition {string} condition
 * @returns {{data: {condition: string}, property: (string|*)}}
 */
module.exports = function ({ condition = '' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_CONDITION_IMMUNITY,
        data: {
            condition
        }
    }
}