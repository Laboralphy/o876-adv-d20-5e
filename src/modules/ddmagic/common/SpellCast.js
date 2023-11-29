const Creature = require("../../../Creature");
const CONSTS = require("../../../consts");
const EffectProcessor = require("../../../EffectProcessor");
const SpellHelper = require("../../classic/common/spell-helper");

/**
 * @class SpellCast
 */
module.exports = class SpellCast {
    constructor ({
        caster,
        spell,
        power = 0,
        hostiles = [],
        friends = [],
        parameters = {}
    }) {
        this._caster = caster
        this._spell = spell
        this._power = power
        this._hostiles = hostiles
        this._firends = friends
        this._parameters = parameters
        this._spelldb = Creature.AssetManager.data['data-ddmagic-spell-database']
        this._spellMark = null
        this._hasClearConcentrationEffects = false
        this._effects = []
        this._maxDuration = 0
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

    get caster () {
        return this._caster
    }

    get target () {
        return this._caster.getTarget()
    }

    get spell () {
        return this._spell
    }

    get dc () {
        return this._caster.store.getters.getSpellDC
    }

    get hostiles () {
        return this._hostiles
    }

    get friends () {
        return this._friends
    }

    /**
     * Renvoie les données relatives au sort
     * @returns {{ level: number, ritual: boolean, concentration: boolean }}
     */
    get spellData () {
        if (this.spell in this._spelldb) {
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

    rangedAttack ({ target = null } = {}) {
        const oTarget = target || this.target
        const caster = this._caster
        const nProfBonus = caster.store.getters.getProficiencyBonus
        const sAbility = CONSTS.ABILITY_INTELLIGENCE
        const nAbilityModifier = caster.store.getters.getAbilityModifiers[sAbility]
        const { value, circumstances } = caster.rollD20(CONSTS.ROLL_TYPE_ATTACK, sAbility)
        const nAtkRoll = nProfBonus + nAbilityModifier + value
        if (!oTarget) {
            throw new Error('ERR_NO_TARGET')
        }
        const ac = oTarget.store.getters.getArmorClass
        const hit = nAtkRoll >= ac
        caster.events.emit('spell-ranged-attack', {
            target: oTarget,
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
            const concentration = this.spellData.concentration
            this._spellMark = {
                spell: this.spell,
                id,
                spellLevel,
                spellCastLevel,
                casterLevel,
                concentration
            }
        }
        return this._spellMark
    }

    clearOtherConcentrationEffects (oCreature) {
        if (this._hasClearConcentrationEffects) {
            return
        }
        this._hasClearConcentrationEffects = true
        const idExcept = this.spellMark.id
        const aSpells = new Set()
        oCreature.store.getters.getEffects.forEach(eff => {
            const d = eff.data.spell
            if (d && d.concentration && d.id !== idExcept) {
                aSpells.add(d.spell)
                eff.duration = 0
            }
        })
        aSpells.forEach(s => oCreature.events.emit('concentration-broken', { spell: s }))
    }

    createSpellEffect (sEffect, ...args) {
        const oEffect = EffectProcessor.createEffect(sEffect, ...args)
        oEffect.data.spell = this.spellMark
        this._effects.push(oEffect)
        return oEffect
    }

    /**
     * Applique un effet à la cible spécifiée (par défaut la cible du caster)
     * @param oEffect {D20Effect}
     * @param duration {number}
     * @param target {Creature}
     */
    applyEffectToTarget (oEffect, duration = 0, target = null) {
        const oTarget = target || this.target
        oTarget.applyEffect(oEffect, duration, this._caster)
    }

    /**
     * Applique un effet au caster
     * @param oEffect {D20Effect}
     * @param duration {number}
     */
    applyEffectToCaster (oEffect, duration = 0) {
        this.applyEffectToTarget(oEffect, duration, this._caster)
    }

    evocationAttack ({
        target = null,
        damage,
        type,
        dc = -1,
        ability = CONSTS.ABILITY_DEXTERITY,
    }) {
        const oTarget = target || this.target
        const oEffect = SpellHelper.evocationAttack({
            caster: this._caster,
            target: oTarget,
            damage,
            type,
            dc: dc < 0 ? this.dc : dc,
            cantrip: this.isCantrip,
            ability,
            apply: false
        })
        oEffect.data.spell = this.spellMark
        return oTarget.applyEffect(oEffect, 0, this._caster)
    }

    /**
     * Lance une attaque dont le succès provoque l'application d'un effet de condition (affliction)
     * @param target {Creature|null}
     * @param condition {string} code condition "CONDITION_*"
     * @param duration {number} durée de la condition en tours
     * @param savingAbility {string} caractéristique utilisée pour le jet de sauvegarde ABILITY_*
     * @param threats {string[]} liste des menaces supplémentaire THREAT_*
     * @param dc {number} dé de difficulté (-1 pur utiliser le DC calculé par défaut)
     * @param subtype {string} sous type de l'effet de condition EFFECT_SUBTYPE_*
     * @returns {D20Effect}
     */
    conditionAttack ({
        target = null,
        condition,
        duration,
        savingAbility,
        threats = [],
        dc = -1,
        subtype = CONSTS.EFFECT_SUBTYPE_MAGICAL
    }) {
        const oTarget = target || this.target
        const oEffect = SpellHelper.conditionAttack({
            caster: this._caster,
            target: oTarget,
            condition,
            savingAbility,
            threats,
            dc: dc < 0 ? this.dc : dc,
            subtype,
            apply: false
        })
        oEffect.data.spell = this.spellMark
        return oTarget.applyEffect(oEffect, duration, this._caster)
    }

    get isSpellAvailable () {
        const cs = this._caster.store.getters.getCastableSpells
        const oSpell = this.spellData
        const nCastLevel = this.spellCastingLevel
        return {
            usable: cs[this.spell] && cs[this.spell][nCastLevel],
            ritual: oSpell.ritual,
            cantrip: this.isCantrip
        }
    }

    consumeSpellSlot () {
        this._caster.store.mutations.consumeSpellSlot({ level: this.spellCastingLevel })
    }

    /**
     * Convertit une durée exprimée en heures, en une durée exprimée en tours
     * @param n {number}
     * @returns {number}
     */
    getDurationHours (n) {
        return n * 60 * 10
    }

    /**
     * Convertit une durée exprimée en minutes, en une durée exprimée en tours
     * @param n {number}
     * @returns {number}
     */
    getDurationMinutes (n) {
        return n * 10
    }

    /**
     * Active la concentration du sort :
     * Annule l'ancienne concentration
     */
    concentrate () {
        if (this.spellData.concentration) {
            const oPreviousConcentrationEffect = this
                .caster
                .store
                .getters
                .getEffects
                .find(eff =>
                    eff.type === CONSTS.EFFECT_GROUP &&
                    eff.tag === 'CONCENTRATION')
            if (oPreviousConcentrationEffect) {
                oPreviousConcentrationEffect.duration = 0
            }
            const duration = this
                ._effects
                .reduce((prev, curr) =>
                    Math.max(prev, curr.duration))
            const eConcentrationGroup = this
                .createSpellEffect(
                    CONSTS.EFFECT_GROUP,
                    this._effects,
                    'CONCENTRATION'
                )
            this.caster.applyEffect(eConcentrationGroup, duration)
        }
    }
}
