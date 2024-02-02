const CONSTS = require('../../../consts')

/**
 * @typedef D20CreatureGetterInteractorReport {object}
 * @property invisible {boolean}
 * @property canSeeInvisibility {boolean}
 * @property charmedBy {Set<string>}
 */

/**
 *
 * @param ms {Set<string>} Modifier set : ensemble des Effets, Conditions, Item Properties
 * @param cs {Object<string, Set<string>>} Ensemble des sources de conditions
 * @returns {D20CreatureGetterInteractorReport}
 */
function computeModifierSet (ms, cs) {
    return {
        invisible:
            ms.has(CONSTS.CONDITION_INVISIBLE),
        canSeeInvisibility:
            ms.has(CONSTS.EFFECT_SEE_INVISIBILITY) ||
            ms.has(CONSTS.EFFECT_TRUE_SIGHT),
        charmedBy:
            cs[CONSTS.CONDITION_CHARMED]
    }
}

/**
 * Créé un rapport concernant les créatures interagissant avec nous : la cible et l'agresseur
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {{aggressor: D20CreatureGetterInteractorReport, target: D20CreatureGetterInteractorReport}}
 */
module.exports = (state, getters) => {
    const st = state.target
    const sa = state.aggressor
    const targetModifierSet = new Set([
        ...getters.getTargetConditionSet,
        ...st.effects,
        ...st.itemProperties
    ])
    const aggressorModifierSet = new Set([
        ...getters.getAggressorConditionSet,
        ...sa.effects,
        ...sa.itemProperties
    ])
    return {
        target: computeModifierSet(targetModifierSet, getters.getTargetConditionSources),
        aggressor: computeModifierSet(aggressorModifierSet, getters.getAggressorConditionSources)
    }
}
