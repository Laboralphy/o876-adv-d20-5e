const Creature = require("../../../Creature");
const CONSTS = require("../../../consts");
const EffectProcessor = require("../../../EffectProcessor");
const SpellHelper = require("../../classic/common/spell-helper");

/**
 * @typedef D20SpellParameters {object}
 * @property item {string}
 * @property overchannel {boolean}
 *
 */

/**
 * @class SpellCast
 */
module.exports = class SpellCast {
    /**
     *
     * @param caster {Creature} creature qui lance le sort
     * @param target {Creature} créature sur laquelle lancer le sort
     * @param spell {string} ref du sort
     * @param power {number} nombre de niveau de slot supplémentaire
     * @param hostiles {Creature[]} liste des créatures hostiles présente aux alentours
     * @param friends {Creature[]} liste des créatures amies présente aux alentours
     * @param extraTargets {Creature[]} davantage de cibles
     * @param cheat {boolean} si TRUE alors, on n'a pas besoin d'avoir le sort mémorisé, et on ne consomme pas le slot.
     */
    constructor ({
        caster,
        target,
        spell,
        power = 0,
        hostiles = [],
        friends = [],
        extraTargets = [],
        cheat = false
    }) {
        this._caster = caster
        this._target = target
        this._spell = spell
        this._power = power
        this._hostiles = hostiles.filter(f => f !== target)
        this._friends = friends.filter(f => f !== target)
        if (!this._friends.includes(this._caster)) {
            this._friends.unshift(this._caster)
        }
        this._extraTargets = extraTargets.slice(0)
        this._spelldb = Creature.AssetManager.data['data-ddmagic-spell-database']
        this._spellMark = null
        this._effects = []
        this._hasEmpowered = false
        this._hasOverchannel = false
        this._cheat = cheat
    }

    /**
     * Renvoie true si le sort est de niveau 0
     * @return {boolean}
     */
    get isCantrip () {
        return this.spellData.level === 0
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
        return this.spellData.target === 'TARGET_TYPE_SELF'
            ? this.caster
            : this._target || this.caster.getTarget() || this.caster
    }

    get spell () {
        return this._spell
    }

    get dc () {
        return this.caster.store.getters.getSpellDC
    }

    get hostiles () {
        return this._hostiles
    }

    get friends () {
        return this._friends
    }

    get extraTargets () {
        return this._extraTargets
    }

    /**
     * Renvoie les données relatives au sort
     * @returns {{ level: number, ritual: boolean, concentration: boolean, target: string, school: string }}
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
        return this.caster.store.getters.getSpellCasterLevel
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
        const caster = this.caster
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
        const oOutcome = {
            type: 'ranged-attack',
            caster,
            target: oTarget,
            ability: sAbility,
            abilityModifier: nAbilityModifier,
            roll: value,
            circumstances,
            attack: nAtkRoll,
            hit,
            ac
        }
        caster.events.emit('spell-ranged-attack', oOutcome)
        return oOutcome
    }

    /**
     * @typedef SpellMark {object}
     * @property id {string} identifiant du lancement de sort
     * @property spell {string} ref du sort
     * @property spellLevel {number} niveau natif du sort
     * @property spellCastLevel {number} niveau effectif de lancement (compte tenu du slot utilisé)
     * @property casterLevel {number} niveau de lanceur de sort
     * @property concentration {boolean} si true alors le osrt est un sort de concentration
     *
     * @returns {SpellMark}
     */
    get spellMark () {
        if (!this._spellMark) {
            const spellLevel = this.spellData.level
            const spellCastLevel = spellLevel + this.power
            const id = Math.random().toString(36).slice(2)
            const casterLevel = this.casterLevel
            const concentration = this.spellData.concentration
            const spellSchool = this.spellData.school
            this._spellMark = {
                spell: this.spell,
                id,
                spellLevel,
                spellCastLevel,
                spellSchool,
                casterLevel,
                concentration
            }
        }
        return this._spellMark
    }

    /**
     * If caster has empowered evocation, adds intelligence modifier to damage effect amp
     * @param oDamageEffect {D20Effect}
     */
    empowerEvocationDamageEffect (oDamageEffect) {
        const cg = this.caster.store.getters
        if (
            cg.getFeats.has('feat-empowered-evocation') &&
            this.spellData.school === 'SPELL_SCHOOL_EVOCATION' &&
            !this._hasEmpowered &&
            oDamageEffect.type === CONSTS.EFFECT_DAMAGE
        ) {
            oDamageEffect.amp += cg.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]
            this._hasEmpowered = true
        }
    }

    /**
     * If caster has used overchannel, maximize damage
     * @param oDamageEffect {D20Effect}
     */
    overchannelDamageEffect (oDamageEffect) {
        const cg = this.caster.store.getters
        if (
            cg.getFeats.has('feat-overchannel') &&
            !this._hasOverchannel &&
            oDamageEffect.type === CONSTS.EFFECT_DAMAGE
        ) {
            oDamageEffect.amp += cg.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]
            this._hasEmpowered = true
        }
    }

    createSpellEffect (sEffect, ...args) {
        const oEffect = EffectProcessor.createEffect(sEffect, ...args)
        oEffect.data.spellmark = this.spellMark
        this.empowerEvocationDamageEffect(oEffect)
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
        const oAppliedEffect = oTarget.applyEffect(oEffect, duration, this.caster)
        this._effects.push(oAppliedEffect)
    }

    /**
     * Applique un effet au caster
     * @param oEffect {D20Effect}
     * @param duration {number}
     */
    applyEffectToCaster (oEffect, duration = 0) {
        this.applyEffectToTarget(oEffect, duration, this.caster)
    }

    /**
     *
     * @param sDice {string|number}
     * @returns {number}
     */
    rollCasterDamageDice (sDice) {
        return typeof sDice === 'number'
            ? sDice
            : this.caster.roll(sDice)
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
            caster: this.caster,
            target: oTarget,
            damage,
            type,
            dc: dc < 0 ? this.dc : dc,
            cantrip: this.isCantrip && !this.caster.store.getters.getFeats.has('feat-potent-cantrip'),
            ability,
            apply: false
        })
        if (oEffect) {
            this.empowerEvocationDamageEffect(oEffect)
            oEffect.data.spellmark = this.spellMark
            return oTarget.applyEffect(oEffect, 0, this.caster)
        } else {
            return null
        }
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
            caster: this.caster,
            target: oTarget,
            condition,
            savingAbility,
            threats,
            dc: dc < 0 ? this.dc : dc,
            subtype,
            apply: false
        })
        if (oEffect) {
            this.empowerEvocationDamageEffect(oEffect)
            oEffect.data.spellmark = this.spellMark
            return oTarget.applyEffect(oEffect, duration, this.caster)
        } else {
            return null
        }
    }

    getCheckTargetCompatibility () {
        switch (this.spellData.target) {
            case 'TARGET_TYPE_HOSTILE': {
                return !!this.target // TODO Check reputation
            }
            case 'TARGET_TYPE_FRIEND': {
                return !!this.target // TODO Check reputation
            }
            case 'TARGET_TYPE_SPECIAL': {
                throw new Error('ERR_TARGET_TYPE_NOT_SUPPORTED_YET')
            }
            case 'TARGET_TYPE_SELF': {
                return true
            }
            default: {
                throw new Error('ERR_TARGET_TYPE_INVALID')
            }
        }
    }

    /**
     *
     * @returns {{usable: boolean, ritual: boolean, cantrip: boolean}}
     */
    get spellAvailability () {
        const cs = this.caster.store.getters.getCastableSpells
        const oSpell = this.spellData
        const nCastLevel = this.spellCastingLevel
        return {
            usable: this.spell in cs ? cs[this.spell][nCastLevel] : this._cheat,
            ritual: oSpell.ritual,
            cantrip: this.isCantrip
        }
    }

    /**
     * Consommer les slots le cas échéant
     */
    consumeSpellSlot () {
        // Déterminer si c'est un rituel ou un cantrip -> pas de consomation
        if (this.isCantrip || this.spellData.ritual) {
            return
        }
        const csg = this.caster.store.getters
        const bCastAtInnateLevel = this.spellCastingLevel === this.spellData.level
        // Déterminer si c'est un sort maîtrisé et que le niveau de lancement est le niveau natif du sort
        if (bCastAtInnateLevel && csg.getCastableMasteredSpells.has(this.spell)) {
            return
        }
        // Déterminer si c'est un sort de signature -> on consomme en premier les slot de signature
        if (bCastAtInnateLevel && csg.getCastableSignatureSpells.has(this.spell)) {
            // reduire l'utilisation du slot de signature
            this.caster.store.mutations.consumeSignatureSpellSlot({ spell: this.spell })
            return
        }
        this.caster.store.mutations.consumeSpellSlot({ level: this.spellCastingLevel })
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
                .find(eff => eff.type === CONSTS.EFFECT_CONCENTRATION)
            if (oPreviousConcentrationEffect) {
                this.caster.events.emit('spellcast-concentration-end', {
                    caster: this.caster,
                    spell: oPreviousConcentrationEffect.data.spellmark.spell,
                    reason: 'CONCENTRATION_CHANGE'
                })
                this.caster.effectProcessor.dispelEffect(oPreviousConcentrationEffect)
            }
            const aEffectCopy = this._effects.filter(eff => eff.type !== CONSTS.EFFECT_CONCENTRATION)
            const duration = aEffectCopy.reduce((prev, curr) => Math.max(prev, curr.duration), 0)
            const eConcentrationGroup = this
                .createSpellEffect(
                    CONSTS.EFFECT_CONCENTRATION,
                    aEffectCopy
                )
            this.caster.events.emit('spellcast-concentration', {
                caster: this.caster,
                spell: this.spellMark.spell
            })
            this.caster.applyEffect(eConcentrationGroup, duration)
        }
    }

    /**
     * nom du script de sort
     * @returns {string}
     */
    get spellScriptName () {
        return 'spell-' + this.spell
    }

    /**
     * renvoie le script du sort
     * @returns {function}
     */
    get spellScript () {
        return Creature.AssetManager.scripts[this.spellScriptName]
    }

    /**
     * Lancement d'un sort
     * @param parameters {D20SpellParameters|undefined} liste des paramètres
     * @returns {boolean}
     */
    cast (parameters = undefined) {
        if (this.spellScript) {
            if (this.spellAvailability.usable) {
                if (!this.getCheckTargetCompatibility()) {
                    throw new Error('SPELLCAST_BAD_TARGET')
                }
                if (parameters.overchannel) {
                    this._hasOverchannel = true
                }
                this.caster.events.emit('spellcast', {
                    caster: this.caster,
                    target: this.target,
                    spell: this.spell,
                    level: this.spellCastingLevel,
                    parameters
                })
                this.target.events.emit('spellcast-at', {
                    caster: this.caster,
                    target: this.target,
                    spell: this.spell,
                    level: this.spellCastingLevel,
                    parameters
                })
                if (!this._cheat) {
                    this.consumeSpellSlot()
                }
                this.spellScript(this, parameters)
                this.concentrate()
                return true
            } else {
                return false
            }
        } else {
            throw new Error('ERR_SPELL_SCRIPT_NOT_FOUND: ' + this.spellScriptName)
        }
    }
}
