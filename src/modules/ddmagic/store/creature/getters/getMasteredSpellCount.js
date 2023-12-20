/**
 * Renvoie le nombre de sorts maitrisés
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @param externals {object}
 * @return {number}
 */
module.exports = (state, getters, externals) => {
    if (getters.getFeats.has('feat-spell-mastery')) {
        return externals.data['data-ddmagic-constants'].featSpellMasterySpellCount
    } else {
        return 0
    }
}
