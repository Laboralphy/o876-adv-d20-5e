const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_ON_HIT
 *
 * Provoque un effet spécial sur la cible touchée par l'arme sur laquelle est appliquée cette propriété
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
    if (propData.property === CONSTS.ITEM_PROPERTY_ON_HIT) {
        delete propData.property
    } else {
        throw new Error('Invalid item property definition : ITEM_PROPERTY_ON_HIT expected ; got : ' + propData.property)
    }
    return {
        property: CONSTS.ITEM_PROPERTY_ON_HIT,
        amp,
        data: {
            script,
            ...propData
        }
    }
}
