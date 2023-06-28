const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_DAMAGE_RESISTANCE
 * @param type {string} damageType
 * @returns {{data: {type: string}, property: (string|*)}}
 */
module.exports = function ({ type = '' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_DAMAGE_RESISTANCE,
        data: {
            type
        }
    }
}