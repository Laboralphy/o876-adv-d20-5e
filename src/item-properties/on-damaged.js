const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ON_DAMAGE
 *
 * Provoque un effet spécial sur la cible lorsqu'elle subit des dégâts (de n'importe quelle source)
 * L'effet est produit par le script spécifié dans l'item-property
 *
 * @param amp {number|string} dice
 * @param script {string}
 * @param data {object} unknown
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp, script, ...data }) {
    const propData = {
        ...data
    }
    if (propData.property === CONSTS.ITEM_PROPERTY_ON_DAMAGED) {
        delete propData.property
    } else {
        throw new Error('Invalid item property definition : ITEM_PROPERTY_ON_HIT expected ; got : ' + propData.property)
    }
    return {
        property: CONSTS.ITEM_PROPERTY_ON_DAMAGED,
        amp,
        data: {
            script,
            ...propData
        }
    }
}
