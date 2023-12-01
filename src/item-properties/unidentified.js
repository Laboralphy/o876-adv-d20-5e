const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_UNIDENTIFIED
 * Cette propriété cache toutes les autres propriétés de l'objet, même si elles sont toujours actives.
 * @returns {{data: {}, amp: number, property: (string|*)}}
 */
module.exports = function ({ hiddenProperties }) {
    return {
        property: CONSTS.ITEM_PROPERTY_UNIDENTIFIED,
        amp: 0,
        data: {
            hiddenProperties
        }
    }
}