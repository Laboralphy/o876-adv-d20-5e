const CONSTS = require('../../../../../consts')
const {getThoseProvidedByEffects} = require("../../../../../store/creature/common/get-disandadv-effect-registry");
const {computeRuleValue} = require("../../../../../store/creature/common/compute-rule-value");

/**
 * @param state
 * @param getters
 * @returns {{'skill-perception': D20RuleValue}}
 */
module.exports = (state, getters) => {
    const oAdvantageRegistry = getters.getAdvantagePropEffects
    return {
        'skill-perception': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-perception')
        })
    }
}