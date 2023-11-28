const Creature = require("../../../Creature");
const CONSTS = require("../../../consts");
const EffectProcessor = require("../../../EffectProcessor");
const SpellHelper = require("../../classic/common/spell-helper");
module.exports = class Spell {
    constructor () {
        this._target = null
        this._caster = null
        this._spell = ''
        this._power = 0
        this._spelldb = Creature.AssetManager.data['data-ddmagic-spell-database']
        this._spellMark = null
    }

    /**
     * Renvoie true si le sort est de niveau 0
     * @return {boolean}
     */
    get isCantrip () {
        this.spellData.level === 0
    }

    /**
     * Renvoie le niveau de puissance = nombre de slots au-dessus du niveau de slot natif du sort
     * @returns {number}
     */
    get power () {
        return this.isCantrip ? 0 : this._power
    }

    get spell () {
        return this._spell
    }

    /**
     * Renvoie les données relatives au sort
     * @returns {{ level: number, ritual: boolean, concentration: boolean }}
     */
    get spellData () {
        if (this._spell in this._spelldb) {
            return this._spelldb[this._spell]
        } else {
            throw new Error('ERR_SPELL_NOT_FOUND')
        }
    }

    /**
     * Renvoie le niveau de lancement du sort (inclue le power)
     * @returns {number}
     */
    get spellCastingLevel () {
        return Math.min(20, this.spellData.level + Math.max(0, this.power))
    }

    /**
     * Renvoie le niveau de lanceur de sort
     * @return {number}
     */
    get casterLevel () {
        return this._caster.store.getters.getWizardLevel
    }

    /**
     * Règle spéciale des dégâts des cantrip
     * @param nBaseDice {number} nombre de face du dé
     * @returns {string}
     */
    getCantripDamageDice (nBaseDice) {
        const d = 'd' + nBaseDice
        const nCasterLevel = this.casterLevel
        if (nCasterLevel >= 17) {
            return '4' + d
        } else if (nCasterLevel >= 11) {
            return '3' + d
        } else if (nCasterLevel >= 5) {
            return '2' + d
        } else {
            return '1' + d
        }
    }

    rangedAttack () {
        const caster = this._caster
        const nProfBonus = caster.store.getters.getProficiencyBonus
        const sAbility = CONSTS.ABILITY_INTELLIGENCE
        const nAbilityModifier = caster.store.getters.getAbilityModifiers[sAbility]
        const { value, circumstances } = caster.rollD20(CONSTS.ROLL_TYPE_ATTACK, sAbility)
        const nAtkRoll = nProfBonus + nAbilityModifier + value
        const target = caster.getTarget()
        if (!target) {
            throw new Error('ERR_NO_TARGET')
        }
        const ac = target.store.getters.getArmorClass
        const hit = nAtkRoll >= ac
        caster.events.emit('spell-ranged-attack', {
            target,
            hit
        })
        return {
            attack: nAtkRoll,
            ac,
            hit,
            circumstances
        }
    }

    get spellMark () {
        if (!this._spellMark) {
            const spellLevel = this.spellData.level
            const spellCastLevel = spellLevel + this.power
            const id = Math.random().toString(36).slice(2)
            const casterLevel = this.casterLevel
            this._spellMark = {
                spell: this._spell,
                id,
                spellLevel,
                spellCastLevel,
                casterLevel
            }
        }
        return this._spellMark
    }

    createSpellEffect (spell, caster, power, sEffect, ...args) {
        const oEffect = EffectProcessor.createEffect(sEffect, ...args)
        oEffect.data.spell = this.spellMark
        return oEffect
    }

    evocationAttack ({
        damage,
        type,
        dc,
        ability = CONSTS.ABILITY_DEXTERITY,
    }) {
        const oEffect = SpellHelper.evocationAttack({
            caster: this._caster,
            target: this._target,
            damage,
            type,
            dc,
            cantrip: this.isCantrip,
            ability,
            apply: false
        })
        oEffect.data.spell = this.spellMark
        return this._target.applyEffect(oEffect, 0, this._caster)
    }

    conditionAttack ({
        condition,
        duration,
        savingAbility,
        threats = [],
        dc,
        subtype = CONSTS.EFFECT_SUBTYPE_MAGICAL
    }) {
        const oEffect = SpellHelper.conditionAttack({
            caster: this._caster,
            target: this._target,
            condition,
            savingAbility,
            threats,
            dc,
            subtype,
            apply: false
        })
        oEffect.data.spell = this.spellMark
        return this._target.applyEffect(oEffect, duration, this._caster)
    }

    get isSpellAvailable () {
        const cs = this._caster.store.getters.getCastableSpells
        const oSpell = this.spellData
        const nCastLevel = this.spellCastingLevel
        return {
            usable: cs[this._spell] && cs[this._spell][nCastLevel],
            ritual: oSpell.ritual,
            cantrip: this.isCantrip
        }
    }
}
