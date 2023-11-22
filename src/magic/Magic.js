const Spell = require('./Spell')

const MAGIC_NAMESPACE = 'MAGIC_SPELLBOOK'

/**
 * @typedef MagicClientEntitySpellBook {object}
 * @property knownSpells {string[]}
 *
 * @typedef MagicClientEntity {object}
 * @property data {{ MAGIC_SPELLBOOK: MagicClientEntitySpellBook }}
 */

module.exports = class Magic {
    constructor () {
        this._spells = new Map()
    }

    /**
     *
     * @returns {Map<string, Spell>}
     */
    get spells () {
        return this._spells
    }

    addSpell (oSpell) {
        if (oSpell instanceof Spell) {
            this._spells.set(oSpell.id, oSpell)
        } else {
            throw new TypeError('Parameter must be instance of Spell')
        }
    }

    getSpell (id) {
        return this._spells.get(id)
    }

    /**
     * Récupération du spellbook d'une creature
     * @param oClientEntity {MagicClientEntity}
     * @returns {MagicClientEntitySpellBook}
     */
    getClientEntitySpellBook (oClientEntity) {
        if ('data' in oClientEntity) {
            if (!(MAGIC_NAMESPACE in oClientEntity.data)) {
                oClientEntity.data[MAGIC_NAMESPACE] = {
                    knownSpells: [],
                    wizardLevel: 1
                }
            }
            return oClientEntity.data[MAGIC_NAMESPACE]
        } else {
            throw new Error('This client entity has no "data" property')
        }
    }

    /**
     * Ajoute un sort à la liste des sorts connus
     * @param oClientEntity {MagicClientEntity}
     * @param idSpell {string}
     */
    learnSpell (oClientEntity, idSpell) {
        const sb = this.getClientEntitySpellBook(oClientEntity)
        if (!sb.knownSpells.includes(idSpell)) {
            sb.knownSpells.push(idSpell)
        }
    }
}
