const CONSTS = require('../../../consts')
const {aggregateModifiers} = require("../common/aggregate-modifiers");

/**
 * Registre des altérations d'états, et de leurs sources
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20ConditionBooleanRegistry}
 */
module.exports = (state, getters) => {
    const aEffects = getters.getEffects
    const oImmunitySet = getters.getConditionImmunities
    const aTags = aEffects.map(eff => eff.type === CONSTS.EFFECT_CONDITION
        ? ({ type: eff.data.condition, source: eff.source })
        : ({ type: eff.type, source: eff.source }))
        .filter(({ type: sType }) => !oImmunitySet.has(sType))
    const oRegistry = {}
    for (const { type: sType, source } of aTags) {
        if (!(sType in oRegistry)) {
            oRegistry[sType] = {
                type: sType,
                sources: new Set()
            }
        }
        oRegistry[sType].sources.add(source)
    }

    const getSources = (effects = undefined) => {
        if (!effects) {
            return new Set()
        } else if (Array.isArray(effects)) {
            return effects
                .map(sEffectName => getSources(sEffectName))
                .reduce((prev, curr) => {
                    curr.forEach(c => prev.add(c))
                    return prev
                }, new Set())
        } else {
            return effects in oRegistry ? oRegistry[effects].sources : new Set()
        }
    }

    return {
        [CONSTS.CONDITION_BLINDED]: getSources(CONSTS.CONDITION_BLINDED),
        [CONSTS.CONDITION_CHARMED]: getSources(CONSTS.CONDITION_CHARMED),
        [CONSTS.CONDITION_DEAFENED]: getSources(CONSTS.CONDITION_DEAFENED),
        [CONSTS.CONDITION_FRIGHTENED]: getSources(CONSTS.CONDITION_FRIGHTENED),
        [CONSTS.CONDITION_GRAPPLED]: getSources(CONSTS.CONDITION_GRAPPLED),
        [CONSTS.CONDITION_INCAPACITATED]: getSources([
            CONSTS.CONDITION_INCAPACITATED,
            CONSTS.CONDITION_PARALYZED,
            CONSTS.CONDITION_PETRIFIED,
            CONSTS.CONDITION_STUNNED,
            CONSTS.CONDITION_UNCONSCIOUS
        ]),
        [CONSTS.CONDITION_INVISIBLE]: getSources(CONSTS.EFFECT_INVISIBILITY),
        [CONSTS.CONDITION_PARALYZED]: getSources(CONSTS.CONDITION_PARALYZED),
        [CONSTS.CONDITION_PETRIFIED]: getSources(CONSTS.CONDITION_PETRIFIED),
        [CONSTS.CONDITION_POISONED]: getSources(CONSTS.CONDITION_POISONED),
        [CONSTS.CONDITION_PRONE]: getSources(CONSTS.CONDITION_PRONE),
        [CONSTS.CONDITION_RESTRAINED]: getSources([
            CONSTS.CONDITION_RESTRAINED,
            CONSTS.CONDITION_GRAPPLED
        ]),
        [CONSTS.CONDITION_STUNNED]: getSources(CONSTS.CONDITION_STUNNED),
        [CONSTS.CONDITION_UNCONSCIOUS]: getSources(CONSTS.CONDITION_UNCONSCIOUS),
        [CONSTS.CONDITION_TRUE_SIGHT]: getSources(CONSTS.EFFECT_TRUE_SIGHT),
        [CONSTS.CONDITION_EXHAUSTED]: oImmunitySet.has(CONSTS.CONDITION_EXHAUSTED) ? new Set() : getSources(CONSTS.EFFECT_EXHAUSTION)
    }
}
