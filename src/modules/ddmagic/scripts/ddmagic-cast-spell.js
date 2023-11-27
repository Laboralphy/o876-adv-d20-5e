const Creature = require('../../../Creature')

/**
 *
 * @param spell {string}
 * @returns {*}
 */
function getSpellData (spell) {
    const spelldb = Creature.AssetManager.data['data-ddmagic-spell-database']
    if (spell in spelldb) {
        return spelldb[spell]
    } else {
        throw new Error('ERR_SPELL_NOT_FOUND')
    }
}

function getSpellCastingLevel (spell, power) {
    const oSpell = getSpellData(spell)
    return oSpell.level === 0
        ? 0
        : Math.min(20, oSpell.level + Math.max(0, power))
}

/**
 * Permet de déterminer si le sort spécifié est disponible pour la créature au niveau
 * @param caster {Creature}
 * @param spell {string}
 * @param power {number}
 * @returns {boolean}
 */
function isSpellAvailable (caster, spell, power) {
    const cs = caster.store.getters.getCastableSpells
    const oSpell = getSpellData(spell)
    const nCastLevel = getSpellCastingLevel(spell, power)
    return {
        usable: cs[spell] && cs[spell][nCastLevel],
        ritual: oSpell.ritual,
        cantrip: oSpell.level === 0
    }
}

function consumeSpellSlot (caster, slot) {
    caster.store.mutations.consumeSpellSlot({ level: slot })
}

/**
 * @param spell {string}
 * @param caster {Creature}
 * @param target {Creature}
 * @param power {number}
 * @param hostiles {Creature[]}
 * @param friends {Creature[]}
 * @param parameters {{}}
 */
module.exports = ({ spell, caster, power = 0, hostiles = [], friends = [], parameters = {} }) => {
    if (isSpellAvailable(caster, spell, power)) {
        const sScript = 'spell-' + spell
        const pScript = Creature.AssetManager.scripts[sScript]
        if (pScript) {
            consumeSpellSlot(caster, getSpellCastingLevel(spell, power))
            pScript({ caster, power, hostiles, friends, parameters })
            return true
        } else {
            throw new Error('ERR_SPELL_SCRIPT_NOT_FOUND: ' + sScript)
        }
    } else {
        return false
    }
}
