const { v4: uuidv4 } = require('uuid');
/**
 * @typedef D20Effect {object}
 * @property id {string} unique effect identifier
 * @property type {string} effect type
 * @property amp {number} effect amplitude
 * @property duration {number} effect duration (in turns)
 * @property source {number|string} source of effect (creature identifier)
 * @property data {object} effect additional properties
 */

/**
 * Create an empty effect
 * @param sType {string}
 * @param amp {number}
 * @param data {object}
 * @returns {D20Effect}
 */
module.exports = function create (sType, amp = 0, data = {}) {
    return {
        id: uuidv4({}, null, 0),
        type: sType,
        amp,
        duration: 0,
        source: 0,
        data
    }
}
