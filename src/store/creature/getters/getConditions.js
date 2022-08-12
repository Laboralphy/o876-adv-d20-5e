const CONSTS = require('../../../consts')

/**
 * Registre des altérations d'états
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20ConditionBooleanRegistry}
 */
module.exports = (state, getters) => {
    const tags = getters
        .getEffects
        .reduce((prev, eff) => {
            prev.add(eff.tag)
        }, new Set())
    return {
        [CONSTS.CONDITION_BLINDED]: tags.has(CONSTS.EFFECT_BLINDNESS),
        [CONSTS.CONDITION_CHARMED]: tags.has(CONSTS.EFFECT_CHARM),
        [CONSTS.CONDITION_DEAFENED]: tags.has(CONSTS.EFFECT_DEAFNESS),
        [CONSTS.CONDITION_FRIGHTENED]: tags.has(CONSTS.EFFECT_FEAR),
        [CONSTS.CONDITION_GRAPPLED]: false,
        [CONSTS.CONDITION_INCAPACITATED]: false,
        [CONSTS.CONDITION_INVISIBLE]: tags.has(CONSTS.EFFECT_INVISIBILITY),
        [CONSTS.CONDITION_PARALYZED]: tags.has(CONSTS.EFFECT_HOLD),
        [CONSTS.CONDITION_PETRIFIED]: tags.has(CONSTS.EFFECT_PETRIFY),
        [CONSTS.CONDITION_POISONED]: tags.has(CONSTS.EFFECT_POISON),
        [CONSTS.CONDITION_PRONE]: false,
        [CONSTS.CONDITION_RESTRAINED]: tags.has(CONSTS.EFFECT_ROOT),
        [CONSTS.CONDITION_STUNNED]: tags.has(CONSTS.EFFECT_STUN),
        [CONSTS.CONDITION_UNCONSCIOUS]: tags.has(CONSTS.EFFECT_SLEEP)
    }
}
