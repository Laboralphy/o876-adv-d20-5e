const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_AURA
 * La créature émet une aura qui applique une condition aux créatures situées dans un certain rayon
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
    if (propData.property === CONSTS.ITEM_PROPERTY_AURA) {
        delete propData.property
    } else {
        throw new Error('Invalid item property definition : ITEM_PROPERTY_AURA expected ; got : ' + propData.property)
    }
    return {
        property: CONSTS.ITEM_PROPERTY_AURA,
        amp,
        data: {
            script,
            ...propData
        }
    }
}

