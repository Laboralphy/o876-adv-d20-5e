const CONSTS = require('../consts')

/**
 * ITEM_PROPERTY_REGEN
 * Régénération d'un certain nombre de points de vie chaque tour.
 * Sauf si la créature est endommagée par un certain type de dégâts (vulnerabilities)
 * @param amp {number}
 * @param vulnerabilities {string[]} damageType[]
 * @returns {{data: {}, amp, property: (string|*)}}
 */
module.exports = function ({ amp, vulnerabilities = [] }) {
    return {
        property: CONSTS.ITEM_PROPERTY_REGEN,
        amp,
        data: {
            vulnerabilities
        }
    }
}