const CONSTS = require('../../../consts')

/**
 * Indique si la cible est auto criticable
 * c'est à dire que chaque coup porté sur elle, est un coup critique automatique
 * (les coups ratés, restent ratés)
 * @param state {*}
 * @param getters {D20CreatureStoreGetters}
 * @return {boolean}
 */
module.exports = (state, getters) => {
    const bInMeleeWeaponRange = getters.isTargetInMeleeWeaponRange
    const cond = getters.getTargetConditions
    const bDefenseLess = cond.has(CONSTS.CONDITION_PARALYZED) || cond.has(CONSTS.CONDITION_UNCONSCIOUS)
    return bInMeleeWeaponRange && bDefenseLess
}
