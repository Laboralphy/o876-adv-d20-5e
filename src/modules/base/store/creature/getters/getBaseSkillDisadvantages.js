const {computeRuleValue} = require("../../../../../store/creature/common/compute-rule-value");
const {getThoseProvidedByEffects} = require("../../../../../store/creature/common/get-disandadv-effect-registry");
const CONSTS = require("../../../../../consts");

/**
 * @param state
 * @param getters
 * @returns {{'skill-perception': D20RuleValue, 'skill-unlock': D20RuleValue}}
 */
module.exports = (state, getters) => {
    const oDisadvantageRegistry = getters.getDisadvantagePropEffects

    // La créature se trouve dans une pièce sombre, sa perception est à la rue
    const af = getters.getAreaFlags
    const AREA_DARK = af.has(CONSTS.AREA_FLAG_DARK)

    return {
        'skill-perception': computeRuleValue({
            AREA_DARK,
            ...getThoseProvidedByEffects(oDisadvantageRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-perception')
        }),
        'skill-unlock': computeRuleValue({
            ...getThoseProvidedByEffects(oDisadvantageRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-unlock')
        })
    }
}