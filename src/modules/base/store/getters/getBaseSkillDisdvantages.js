const {computeRuleValue} = require("../../../../store/creature/common/compute-rule-value");
const {getThoseProvidedByEffects} = require("../../../../store/creature/common/get-disandadv-effect-registry");
const CONSTS = require("../../../../consts");
module.exports = (state, getters) => {
    return {
        SKILL_STEALTH: computeRuleValue({
            WEARING_NON_STEALTH_ARMOR,
            ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_STEALTH')
        }),
        SKILL_PERCEPTION: computeRuleValue({
            AREA_DARK,
            ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_PERCEPTION')
        })
    }
}