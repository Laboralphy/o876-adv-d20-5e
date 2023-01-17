const CONSTS = require('../../../consts')

/**
 * Registre des altérations d'états
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20ConditionBooleanRegistry}
 */
module.exports = (state, getters) => {
    return new Set(Object
        .entries(getters.getConditionSources)
        .filter(([key, value]) => value.length > 0)
        .map(([key, value]) => key)
    )
    /*
    const aEffects = getters.getEffects
    const aTags = aEffects.map(eff => eff.tag)
    const oTags = new Set(aTags)
    const aConditions = {
        [CONSTS.CONDITION_BLINDED]: oTags.has(CONSTS.EFFECT_BLINDNESS),
        [CONSTS.CONDITION_CHARMED]: oTags.has(CONSTS.EFFECT_CHARM),
        [CONSTS.CONDITION_DEAFENED]: oTags.has(CONSTS.EFFECT_DEAFNESS),
        [CONSTS.CONDITION_FRIGHTENED]: oTags.has(CONSTS.EFFECT_FEAR),
        [CONSTS.CONDITION_GRAPPLED]: false,
        [CONSTS.CONDITION_INCAPACITATED]: false,
        [CONSTS.CONDITION_INVISIBLE]: oTags.has(CONSTS.EFFECT_INVISIBILITY),
        [CONSTS.CONDITION_PARALYZED]: oTags.has(CONSTS.EFFECT_HOLD),
        [CONSTS.CONDITION_PETRIFIED]: oTags.has(CONSTS.EFFECT_PETRIFY),
        [CONSTS.CONDITION_POISONED]: oTags.has(CONSTS.EFFECT_POISON),
        [CONSTS.CONDITION_PRONE]: false,
        [CONSTS.CONDITION_RESTRAINED]: oTags.has(CONSTS.EFFECT_ROOT),
        [CONSTS.CONDITION_STUNNED]: oTags.has(CONSTS.EFFECT_STUN),
        [CONSTS.CONDITION_UNCONSCIOUS]: oTags.has(CONSTS.EFFECT_SLEEP),
        [CONSTS.CONDITION_TRUE_SIGHT]: oTags.has(CONSTS.EFFECT_TRUE_SIGHT)
    }
    return new Set(
        Object
            .entries(aConditions)
            .filter(([key, value]) => value)
            .map(([key, value]) => key)
    )
    */
}
