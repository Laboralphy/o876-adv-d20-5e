const CONSTS = require('../../../consts')

/**
 * Registre des altérations d'états, et de leurs sources
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20ConditionBooleanRegistry}
 */
module.exports = (state, getters) => {
    const aEffects = getters.getEffects
    const aTags = aEffects.map(eff => ({ tag: eff.tag, source: eff.source }))
    const oRegistry = {}
    for (const { tag, source } of aTags) {
        if (!(tag in oRegistry)) {
            oRegistry[tag] = {
                tag,
                sources: []
            }
        }
        oRegistry[tag].sources.push(source)
    }

    const getSources = sEffect => sEffect in oRegistry ? oRegistry[sEffect].sources : []

    return {
        [CONSTS.CONDITION_BLINDED]: getSources(CONSTS.EFFECT_BLINDNESS),
        [CONSTS.CONDITION_CHARMED]: getSources(CONSTS.EFFECT_CHARM),
        [CONSTS.CONDITION_DEAFENED]: getSources(CONSTS.EFFECT_DEAFNESS),
        [CONSTS.CONDITION_FRIGHTENED]: getSources(CONSTS.EFFECT_FEAR),
        [CONSTS.CONDITION_GRAPPLED]: [],
        [CONSTS.CONDITION_INCAPACITATED]: [],
        [CONSTS.CONDITION_INVISIBLE]: getSources(CONSTS.EFFECT_INVISIBILITY),
        [CONSTS.CONDITION_PARALYZED]: getSources(CONSTS.EFFECT_HOLD),
        [CONSTS.CONDITION_PETRIFIED]: getSources(CONSTS.EFFECT_PETRIFY),
        [CONSTS.CONDITION_POISONED]: getSources(CONSTS.EFFECT_POISON),
        [CONSTS.CONDITION_PRONE]: [],
        [CONSTS.CONDITION_RESTRAINED]: getSources(CONSTS.EFFECT_ROOT),
        [CONSTS.CONDITION_STUNNED]: getSources(CONSTS.EFFECT_STUN),
        [CONSTS.CONDITION_UNCONSCIOUS]: getSources(CONSTS.EFFECT_SLEEP),
        [CONSTS.CONDITION_TRUE_SIGHT]: getSources(CONSTS.EFFECT_TRUE_SIGHT)
    }
}
