const CONSTS = require('../../../../../consts')
const {getThoseProvidedByEffects} = require("../../../../../store/creature/common/get-disandadv-effect-registry");
const {computeRuleValue} = require("../../../../../store/creature/common/compute-rule-value");

/**
 * @param state
 * @param getters
 * @returns {{SKILL_PERCEPTION: {[p: string]: boolean}, SKILL_UNLOCK: {[p: string]: boolean}}}
 */
module.exports = (state, getters) => {
    const oAdvantageRegistry = getters.getAdvantagePropEffects
    return {
        SKILL_PERCEPTION: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_PERCEPTION')
        }),
        SKILL_UNLOCK: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_UNLOCK')
        })
    }
}