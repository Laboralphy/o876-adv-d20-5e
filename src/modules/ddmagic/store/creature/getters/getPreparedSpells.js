const CONSTS = require('../../../../../consts')

/**
 * @typedef D20SpellRepositoryEntry {object}
 * @property ref {string}
 * @property level {number}
 * @property concentration {boolean}
 * @property rituals {boolean}
 * @property target {string}
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @param externals {*}
 * @returns {cantrips: string[], spells: string[], repository: D20SpellRepositoryEntry[]}
 */
module.exports = (state, getters, externals) => ({
    cantrips: state.data.spellbook.preparedCantrips,
    spells: state.data.spellbook.preparedSpells,
    repository: state.data.spellbook.knownSpells.map(spell => ({
        ref: spell,
        ...externals.data['data-ddmagic-spell-database'][spell]
    }))
})
