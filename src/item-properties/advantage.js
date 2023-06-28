const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ADVANTAGE
 * @param rollTypes {string[]} rollType[]
 * @param abilities {string[]} ability[]
 * @param origin {string}
 * @returns {{data: {abilities, origin: string, rollTypes}, amp: number, property: (string|*)}}
 */
module.exports = function ({ rollTypes, abilities, origin = 'EQUIPMENT' }) {
    return {
        property: CONSTS.ITEM_PROPERTY_ADVANTAGE,
        amp: 0,
        data: {
            abilities,
            rollTypes,
            origin
        }
    }
}