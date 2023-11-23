const CONSTS = require('../../../../../consts')

/**
 *
 * @param state
 * @returns {cantrips: string[], spells: string[]}
 */
module.exports = state => ({
    cantrips: state.data.spellbook.preparedCantrips,
    spells: state.data.spellbook.preparedSpells
})
