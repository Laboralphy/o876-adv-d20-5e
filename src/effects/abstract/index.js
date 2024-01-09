const { v4: uuidv4 } = require('uuid');
const CONSTS = require('../../consts')
/**
 * @typedef D20Effect {object}
 * @property id {string} unique effect identifier
 * @property type {string} effect type
 * @property amp {number} effect amplitude
 * @property duration {number} effect duration (in turns)
 * @property source {number|string} source of effect (creature identifier)
 * @property data {object} effect additional properties
 * @property tag {string}
 * @property subtype {string} sous type de l'effet
 * @property unicity {boolean} l'effet est unique. Lorsqu'on l'applique, il
 * @property parent {{creature: string, effect: string}} un effet peut avoir un lien de parenté avec un autre effet placé sur quiconque
 * @property mutable {boolean} vrai si l'effet dispose d'une méthode mutable
 *
 *
 * EFFECT_SUBTYPE_MAGICAL : L'effet peut être dissipé
 * La plupart des effets de sorts sont de ce sous-type
 * EFFECT_SUBTYPE_EXTRAORDINARY : L'effet disparait uniquement à expiration ou avec du repos
 * EFFECT_SUBTYPE_SUPERNATURAL : L'effet ne peut pas être dissipé et ne disparait pas avec du repos
 * Un effet temporaire surnaturel ne peut se dissiper qu'au terme de sa durée de vie.
 * Un effet permanent surnaturel ne peut pas être retiré que par un script spécifique
 */

/**
 * Create an empty effect
 * @param sType {string}
 * @param amp {number|string}
 * @param data {object}
 * @param tag {string}
 *
 * @returns {D20Effect}
 */
module.exports = function create (sType, amp = 0, data = {}, tag = '') {
    return {
        id: uuidv4({}, null, 0),
        type: sType,
        amp,
        duration: 0,
        source: 0,
        data,
        tag,
        subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
        unicity: CONSTS.EFFECT_UNICITY_STACK,
        parent: {
            creature: '',
            effect: ''
        },
        mutable: false
    }
}
