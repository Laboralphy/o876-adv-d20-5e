/**
 * Retaille un tableau pourqu'il ne dépasse pas la taille spécifiée
 * @param a {[]}
 * @param n {number}
 */
function cropArray (a, n) {
    while (a.length > n) {
        a.shift()
    }
}

/**
 * Ajoute un sort à la liste, retaille la liste au besoin si elle dépasse la taille spécifiée
 * @param aStorage {string[]}
 * @param spell {string}
 * @param nMax {number}
 * @param bAutoSize {boolean}
 * @returns {boolean}
 */
function prepareSpell (aStorage, spell, nMax, bAutoSize) {
    if (!bAutoSize && aStorage.length > nMax) {
        return false // ne peut plus ajouter d'élément
    }
    const iSpell = aStorage.indexOf(spell)
    if (iSpell >= 0) {
        aStorage.splice(iSpell, 1)
    }
    aStorage.push(spell)
    cropArray(aStorage, nMax)
    return true
}

/**
 * Memorize a spell, and forget the oldest prepared spell
 * @param state
 * @param spell {string} identifiant du sort
 * @param externals
 */
module.exports = ({ state, getters, externals }, { spell }) => {
    // il faut que le sort existe
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    if (spell in oSpellDB) {
        if (!state.data.spellbook.knownSpells.includes(spell)) {
            throw new Error('This character does not know the spell "' + spell + '"')
        }
        const oSpellData = oSpellDB[spell]
        if (oSpellData.ritual) {
            return // on ne mémorise pas les rituels, on les connait déjà tous
        }
        const nSpellLevel = oSpellData.level
        if (nSpellLevel === 0) {
            // memorisation d'un cantrip
            prepareSpell(state.data.spellbook.preparedCantrips, spell, getters.getMaxPreparableCantrips, true)
        } else {
            // memorisation d'un spell
            prepareSpell(state.data.spellbook.preparedSpells, spell, getters.getMaxPreparableSpells, true)
        }
    } else {
        throw new Error('Spell "' + spell + '" does not exist')
    }
}