const { v4: uuidv4 } = require('uuid');
/**
 * @typedef D20Effect {object}
 * @property id {string} unique effect identifier
 * @property tag {string} effect tag
 * @property amp {number} effect amplitude
 * @property duration {number} effect duration (in turns)
 * @property source {number|string} source of effect (creature identifier)
 * @property data {object} effect additional properties
 */

/**
 * Create an empty effect
 * @param tag {string}
 * @param amp {number}
 * @param data {object}
 * @returns {D20Effect}
 */
module.exports = function create (tag, amp = 0, data = {}) {
    return {
        id: uuidv4({}, null, 0),
        tag,
        amp,
        duration: 0,
        source: 0,
        data
    }
}
