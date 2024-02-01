const CONSTS = require('./consts')
const EffectProcessor = require('./EffectProcessor')
const Dice = require('./libs/dice')
const { v4: uuidv4 } = require('uuid')
const Events = require('events')
const PHYSICAL_DAMAGE_TYPES = require('./data/physical-damage-types.json')
const Comparator = require('./Comparator')

// Store
const { aggregateModifiers } = require("./store/creature/common/aggregate-modifiers");
const { deepClone } = require("@laboralphy/object-fusion");


/**
 * @class Creature
 */
class Creature {
    constructor () {
        this._id = uuidv4({}, null, 0)
        this._ref = ''
        this._name = this._id
        this._dice = new Dice()
        this._target = {
            handler: null,
            creature: null
        }
        this._aggressor = {
            handler: null,
            creature: null
        }
        if (!Creature.AssetManager) {
            throw new Error('AssetManager not declared')
        }
        if (!Creature.AssetManager.initialized) {
            throw new Error('AssetManager not initialized')
        }
        /**
         * @type {D20CreatureStore}
         * @private
         */
        this._store = Creature.AssetManager.createStore('creature')
        /**
         * @type {EffectProcessor}
         * @private
         */
        this._effectProcessor = new EffectProcessor()
        this._events = new Events()
        this._store.mutations.setId({ value: this._id })
    }

    static set AssetManager (value) {
        Creature._AssetManager = value
    }

    /**
     * @returns {AssetManager}
     */
    static get AssetManager () {
        return Creature._AssetManager
    }

    /**
     * @returns {AssetManager}
     */
    get assetManager () {
        return Creature.AssetManager
    }

    get entityType () {
        return CONSTS.ENTITY_TYPE_ACTOR
    }

    set name (value) {
        this._name = value
    }

    /**
     * Définie la reférence du blueprint qui a servi à construire la creature
     * @param value {string}
     */
    set ref (value) {
        this._ref = value
        this.store.mutations.setRef({ value })
    }

    /**
     * Renvoie la référence du blueprint qui a servit à construire la creature
     * @returns {string}
     */
    get ref () {
        return this._ref
    }

    get name () {
        return this._name
    }

    get events () {
        return this._events
    }

    get dice () {
        return this._dice
    }

    set dice (value) {
        this._dice = value
    }

    /**
     *
     * @returns {EffectProcessor}
     */
    get effectProcessor () {
        return this._effectProcessor
    }

    get EffectProcessor () {
        return EffectProcessor
    }

    get id () {
        return this._id
    }

    set id (value) {
        this._events.emit('change-id', { creature: this, newId: value, oldId: this._id })
        this._id = value
        this.store.mutations.setId({ value })
    }

    get store () {
        return this._store
    }

    get state () {
        const state = this.store.state
        return deepClone({
            id: state.id,
            abilities: state.abilities,
            alignment: state.alignment,
            specie: state.specie,
            size: state.size,
            offensiveSlot: state.offensiveSlot,
            proficiencies: state.proficiencies,
            speed: state.speed,
            effects: state.effects,
            classes: state.classes,
            gauges: state.gauges,
            recentDamageTypes: state.recentDamageTypes,
            feats: state.feats,
            equipment: state.equipment,
            counters: state.counters,
            encumbrance: state.encumbrance,
            data: state.data
        })
    }

    set state (state) {
        this._store.mutations.importCreatureState({ state })
    }

    /**
     *
     * @param oItem {D20Item}
     * @param [sEquipmentSlot] {string}
     * @param [bByPassCurse] {boolean} si true alors, on ne prend pas compte des items maudits
     * @return {{ previousItem: D20Item|null, newItem: D20Item|null, slot: string, cursed: boolean }}
     */
    equipItem (oItem, sEquipmentSlot = '', bByPassCurse = false) {
        const aES = Array.isArray(sEquipmentSlot)
            ? sEquipmentSlot // C'est un tableau
            : sEquipmentSlot === ''
                ? oItem.equipmentSlots.slice(0) // c'est une chaine vide, alors on prend la valeur par défaut
                : [sEquipmentSlot] // c'est un slot précis, on le mets dans une liste
        let oPrevItem = null
        let sES = ''
        do {
            sES = aES.shift()
            oPrevItem = this.store.getters.getEquippedItems[sES]
        } while (oPrevItem !== null && aES.length > 0)
        if (oPrevItem) {
            // Verifier si l'objet est maudit
            if (!bByPassCurse && !!oPrevItem.properties.find(ip => ip.property === CONSTS.ITEM_PROPERTY_CURSED)) {
                return {
                    previousItem: oPrevItem,
                    newItem: oItem,
                    slot: sES,
                    cursed: true
                } // On ne retire pas l'objet, on ne s'équipe pas du nouvel objet
            }
        }
        this.store.mutations.equipItem({ item: oItem, slot: sES })
        return {
            previousItem: oPrevItem,
            newItem: oItem,
            slot: sES,
            cursed: false
        }
    }

    unequipItem (slot, bByPassCurse = false) {
        return this.equipItem(null, slot, bByPassCurse)
    }

    /*
        ######
        #     #   ####   #    #  #    #   ####
        #     #  #    #  ##   #  #    #  #
        ######   #    #  # #  #  #    #   ####
        #     #  #    #  #  # #  #    #       #
        #     #  #    #  #   ##  #    #  #    #
        ######    ####   #    #   ####    ####
     */

    /**
     * Aggrège les effets spécifiés dans la liste, selon un prédicat
     * @param aTags {string[]} liste des effets désirés
     * @param filters {Object} voir la fonction store/creature/common/aggregate-modifiers
     * @returns {{sorter: Object<String, {sum: number, max: number, count: number}>, max: number, min: number, sum: number, count: number, effects: number, ip: number}}
     */
    aggregateModifiers (aTags, filters) {
        return aggregateModifiers(aTags, this.store.getters, filters)
    }

    /**
     * Renvoie le bonus de la caractéristique offensive
     * @return {number}
     */
    getOffensiveAbilityBonus () {
        const getters = this.store.getters
        const sOffensiveAbility = getters.getOffensiveAbility
        return getters.getAbilityModifiers[sOffensiveAbility]
    }

    /**
     * Calcule le bonus de dégât de l'arme actuellement
     * Inclue les effets appliqués à la créature qui peuvent influencer les dégats
     * Inclue les effets et propriété de l'arme
     * Inclue le bonus de caractéristique offensive
     * @param critical {boolean}
     * @return {Object<string, number>}
     */
    getDamageBonus ({ critical = false } = {}) {
        // Effect & Props damageBonus
        // Effect enhancement
        // offensive ability modifier
        // critical : roll damage twice
        // Weapon attribute Two handed : +50%
        // Weapon attribute semi auto : +50%
        // Weapon attribute auto : +100%
        const getters = this.store.getters
        const oWeapon = getters.getSelectedWeapon
        const sWeaponDamType = oWeapon.damageType
        const ampRndMapper = ({ amp }) => this.roll(amp)
        const am = this.aggregateModifiers([
            CONSTS.EFFECT_DAMAGE_BONUS,
            CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
            CONSTS.ITEM_PROPERTY_ENHANCEMENT
        ], {
            effectSorter: effect => effect.data.type || sWeaponDamType,
            propSorter: prop => prop.property === CONSTS.ITEM_PROPERTY_ENHANCEMENT
                ? sWeaponDamType
                : prop.data.type,
            effectAmpMapper: eff => ampRndMapper(eff),
            propAmpMapper: prop => ampRndMapper(prop)
        })
        const oResult = {
            [sWeaponDamType]: this.store.getters.getOffensiveAbilityBonus
        }
        const updateResult = sorter => {
            for (const [sDamageType, oDamageStruct] of Object.entries(sorter)) {
                if (sDamageType in oResult) {
                    oResult[sDamageType] += oDamageStruct.sum
                } else {
                    oResult[sDamageType] = oDamageStruct.sum
                }
            }
        }
        // Les bonus fixes
        updateResult(am.sorter)
        // les bonus randoms
        if (critical) {
            const amCrit = this.aggregateModifiers([
                CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
                CONSTS.ITEM_PROPERTY_ENHANCEMENT,
                CONSTS.ITEM_PROPERTY_MASSIVE_CRITICAL
            ], {
                propSorter: prop => prop.property === CONSTS.ITEM_PROPERTY_ENHANCEMENT
                    ? sWeaponDamType
                    : prop.data.type,
                propAmpMapper: prop => ampRndMapper(prop)
            })
            updateResult(amCrit.sorter)
        }
        return oResult
    }

    /**
     * Obtenir le bonus d'attaque pour l'arme spécifiée
     * @return {number}
     */
    getAttackBonus () {
        return this.store.getters.getAttackBonus
    }

/*
       #                                                              ##
      # #     ####    ####   #####   ######   ####    ####           #  #
     #   #   #    #  #    #  #    #  #       #       #                ##
    #     #  #       #       #    #  #####    ####    ####           ###
    #######  #  ###  #  ###  #####   #            #       #         #   # #
    #     #  #    #  #    #  #   #   #       #    #  #    #         #    #
    #     #   ####    ####   #    #  ######   ####    ####           #### #

    #######
       #       ##    #####    ####   ######   #####   ####
       #      #  #   #    #  #    #  #          #    #
       #     #    #  #    #  #       #####      #     ####
       #     ######  #####   #  ###  #          #         #
       #     #    #  #   #   #    #  #          #    #    #
       #     #    #  #    #   ####   ######     #     ####

 */

    clearTarget () {
        if (this._target.creature) {
            if (this._target.handler) {
                this._target.creature.store.events.off('mutation', this._target.handler)
                this._target.handler = null
            }
            this._target.creature.endAggression(this)
            this._target.creature = null
            this.store.mutations.clearTarget()
        }
    }

    updateTarget (name) {
        switch (name) {
            case 'equipItem':
            case 'dispelEffect':
            case 'addEffect': {
                const conditions = this._target.creature.store.getters.getConditionSources
                const effects = this._target.creature.store.getters.getEffectSet
                const itemProperties = this._target.creature.store.getters.getEquipmentItemPropertySet
                this.store.mutations.updateTargetConditions({ conditions, effects, itemProperties })
                break
            }
        }
    }

    /**
     * Définit la distance entre la creature et sa cible ET RECIPROQUEMENT
     * @param n {number} nouvelle distance
     * @param bRecursed {boolean} indique que la fonction a été appelée recursivement
     */
    setDistanceToTarget (n, bRecursed = false) {
        const oTarget = this.getTarget()
        if (oTarget) {
            const td = this.store.getters.getTargetDistance
            if (n !== td) {
                if (!bRecursed) {
                    oTarget.setDistanceToTarget(n, true)
                }
                const oEventPayload = { value: n, creature: this, target: oTarget }
                this._events.emit('target-distance', oEventPayload)
                this.store.mutations.setTargetDistance({ value: oEventPayload.value })
            }
        }
    }

    /**
     * envoie la cible de la cible
     * @returns {Creature|null}
     */
    getTargetTarget () {
        const oTarget = this.getTarget()
        if (oTarget) {
            return oTarget.getTarget()
        } else {
            return null
        }
    }

    setTarget (oCreature) {
        if (oCreature === this) {
            this.clearTarget()
            return
        }
        if (this._target.creature !== oCreature) {
            this.clearTarget()
            this._target.creature = oCreature
            this._target.handler = ({ name, payload }) => this.updateTarget(name, payload)
            this.store.mutations.updateTargetConditions({
                id: oCreature.id,
                conditions: this._target.creature.store.getters.getConditionSources,
                effects: this._target.creature.store.getters.getEffectSet,
                itemProperties: this._target.creature.store.getters.getEquipmentItemPropertySet
            })
            oCreature.store.events.on('mutation', this._target.handler)
            this.initializeDistanceToTarget(Creature.AssetManager.data.variables.DEFAULT_TARGET_DISTANCE)
        }
    }

    /**
     * Definit une distance entre les cibles si celles ci sont totalement incinue l'une de l'autre
     * sinon alors l'une des creature connais sa distance par rapport à l'autre et on copie
     * cette distance sur l'autre
     * @param nDefault {number}
     */
    initializeDistanceToTarget(nDefault) {
        const oTarget = this.getTarget()
        const oTargetTarget = this.getTargetTarget()
        if (oTargetTarget === this) {
            // copie de la distance
            this.setDistanceToTarget(oTarget.store.getters.getTargetDistance, true)
        } else {
            // aucune de ces deux entités ne se connait
            this.setDistanceToTarget(nDefault)
        }
    }

    getTarget () {
        return this._target.creature
    }


    clearAggressor () {
        if (this._aggressor.creature) {
            if (this._aggressor.handler) {
                this._aggressor.creature.store.events.off('mutation', this._aggressor.handler)
                this._aggressor.handler = null
            }
            this._aggressor.creature = null
            this.store.mutations.clearAggressor()
        }
    }

    updateAggressor (name) {
        switch (name) {
            case 'equipItem':
            case 'dispelEffect':
            case 'addEffect': {
                const conditions = this._aggressor.creature.store.getters.getConditionSources
                const effects = this._aggressor.creature.store.getters.getEffectSet
                const itemProperties = this._aggressor.creature.store.getters.getEquipmentItemPropertySet
                this.store.mutations.updateAggressorConditions({ conditions, effects, itemProperties })
                break
            }
        }
    }

    setAggressor (oCreature) {
        if (this._aggressor.creature !== oCreature) {
            this.clearAggressor()
            this._aggressor.creature = oCreature
            this._aggressor.handler = ({ name, payload }) => this.updateAggressor(name, payload)
            this.store.mutations.updateAggressorConditions({
                id: oCreature.id,
                conditions: this._aggressor.creature.store.getters.getConditionSources,
                effects: this._aggressor.creature.store.getters.getEffectSet,
                itemProperties: this._aggressor.creature.store.getters.getOffensiveEquipmentList
            })
            oCreature.store.events.on('mutation', this._aggressor.handler)
        }
    }

    getAggressor () {
        return this._aggressor.creature
    }

    /**
     * Défini la manière dont la créature réagit à la destruction technique d'une autre créature
     * Il s'agit de couper tout lien vers cette créature
     */
    notifyCreatureDestroyed (oCreature) {
        if (this.getTarget() === oCreature) {
            this.clearTarget()
        }
        this.endAggression(oCreature)
    }

    /**
     * Signifie qu'une creature arrête de nous attaquer
     * @param oCreature {Creature}
     */
    endAggression (oCreature) {
        if (this.getAggressor() === oCreature) {
            this.clearAggressor()
        }
    }

    /**
     * La créature spécifiée est supprimée du système, retire toute trace de cette instance dans
     * le store ou les registres.
     * @param oCreature {Creature}
     */
    removeCreatureInfluence (oCreature) {
        if (this.getTarget() === oCreature) {
            this.clearTarget()
        }
        if (this.getAggressor() === oCreature) {
            this.clearAggressor()
        }
        this.effectProcessor.removeCreatureFromRegistry(this, oCreature)
    }

    /*
        #######
        #        ######  ######  ######   ####    #####
        #        #       #       #       #    #     #
        #####    #####   #####   #####   #          #
        #        #       #       #       #          #
        #        #       #       #       #    #     #
        #######  #       #       ######   ####      #

        ######
        #     #  #####    ####    ####   ######   ####    ####    ####   #####
        #     #  #    #  #    #  #    #  #       #       #       #    #  #    #
        ######   #    #  #    #  #       #####    ####    ####   #    #  #    #
        #        #####   #    #  #       #            #       #  #    #  #####
        #        #   #   #    #  #    #  #       #    #  #    #  #    #  #   #
        #        #    #   ####    ####   ######   ####    ####    ####   #    #
     */

    applyEffect (oEffect, duration = 0, source = null) {
        const bDamageEffect = oEffect.type === CONSTS.EFFECT_DAMAGE
        const bWeaponEffect = oEffect.subtype === CONSTS.EFFECT_SUBTYPE_WEAPON
        if (bDamageEffect) {
            this.processOnDamaged(oEffect, source)
        }
        const eEffect = this._effectProcessor.applyEffect(oEffect, this, duration, source)
        this._events.emit('effect-applied', { effect: eEffect })

        if (bDamageEffect && !bWeaponEffect) {
            // Damaged by non-weapon source
            this._events.emit('damaged', {
                type: eEffect.data.type,
                amount: eEffect.data.appliedAmount,
                source,
                resisted: eEffect.data.resistedAmount
            })
        }
        if (this.store.getters.getHitPoints <= 0) {
            this.events.emit('death', { killer: source, effect: oEffect })
            if (source) {
                this.effectProcessor.invokeAllEffectsMethod(source, 'kill', this, source, { effect: oEffect })
            }
        }

        return eEffect
    }

    processRegenEffects () {
        const ag = this.aggregateModifiers([
            CONSTS.ITEM_PROPERTY_REGEN
        ], {})
        // Health Regeneration
        if (ag.sum > 0) {
            this.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_HEAL, ag.sum))
        }
    }

    /**
     * Cette créature inspecte les différentes auras de sa cible.
     * Une créature qui n'a pas de cible n'est pas sujette à des auras.
     * Les aura seront donc considérées comme des réactions passives contre un agresseur
     */
    processTargetAuraEffects () {
        const oTarget = this.getTarget()
        if (!oTarget) {
            return
        }
        const oContext = {
            target: this,
            source: oTarget,
            property: null,
            data: {}
        }
        const oScripts = Creature.AssetManager.scripts
        const d = this.store.getters.getTargetDistance
        oTarget.aggregateModifiers([
            CONSTS.ITEM_PROPERTY_AURA
        ], {
            propFilter: prop => prop.data.radius >= d,
            propForEach: prop => {
                const sScript = prop.data.script
                oContext.property = prop
                if (sScript in oScripts) {
                    oScripts[sScript](oContext)
                } else {
                    throw new Error('Could not find ON HIT script ' + sScript)
                }
            }
        })
    }

    /**
     * Dans un contexte comme un MUD, les combats s'effectuent en temps réel,
     * Un round s'effectue en 6 seconde par exemple.
     * Hors combat le processEffects s'effectue lorsque l'entité change de pièce
     */
    processEffects () {
        this.store.mutations.updateFeatEffects()
        this._effectProcessor.processCreatureEffects(this)
        this.processRegenEffects()
        this.processTargetAuraEffects()
        this.store.mutations.clearRecentDamageTypes()
    }

    /*
         #####
        #     #     #    #####    ####   #    #  #    #   ####    #####    ##    #    #   ####   ######   ####
        #           #    #    #  #    #  #    #  ##  ##  #          #     #  #   ##   #  #    #  #       #
        #           #    #    #  #       #    #  # ## #   ####      #    #    #  # #  #  #       #####    ####
        #           #    #####   #       #    #  #    #       #     #    ######  #  # #  #       #            #
        #     #     #    #   #   #    #  #    #  #    #  #    #     #    #    #  #   ##  #    #  #       #    #
         #####      #    #    #   ####    ####   #    #   ####      #    #    #  #    #   ####   ######   ####
     */

    getSkillData (sSkill) {
        const sSkillDataProp = sSkill.toLowerCase().replace(/_/g, '-')
        if (sSkillDataProp in Creature.AssetManager.data) {
            return Creature.AssetManager.data[sSkillDataProp]
        } else {
            if (sSkillDataProp.startsWith('skill-')) {
                throw new Error(sSkill + ' is not in data')
            }
        }
    }

    /**
     * @typedef D20CircumstancesDetails {string[]}
     *
     * @typedef D20Circumstances {object}
     * @property disadvantage {boolean}
     * @property advantage {boolean}
     * @property details {{advnatages: D20CircumstancesDetails, disadvantages: D20CircumstancesDetails}}
     *
     * @param sRollType
     * @param aAbilitySkillThreats
     * @returns {D20Circumstances}
     */
    getCircumstances (sRollType, aAbilitySkillThreats) {
        const oAdvantages = this.store.getters.getAdvantages
        const oDisadvantages = this.store.getters.getDisadvantages
        const ar = oAdvantages[sRollType]
        if (!ar) {
            throw new Error('This roll type (' + sRollType + ') does not exist in advantages. Available roll types are : ' + Object.keys(oAdvantages).join(', '))
        }
        const dr = oDisadvantages[sRollType]
        if (!dr) {
            throw new Error('This roll type (' + sRollType + ') does not exist in disadvantages. Available roll types are : ' + Object.keys(oDisadvantages).join(', '))
        }
        const al = []
        const dl = []
        let
            advantage = false,
            disadvantage = false
        aAbilitySkillThreats.forEach(ex => {
            // dans le cas d'un skill particulier...
            // comme ce système propose des skill configurable par module...
            if (sRollType === CONSTS.ROLL_TYPE_CHECK) {
                // 1) lire les data du skill pour déterminer le getter du skill
                const sSkill = ex
                const oSkillData = this.getSkillData(ex)
                if (oSkillData) {
                    // 2) lire ce getter
                    const oGetters = oSkillData.getters
                    // 3) extraire les avantages/désavantages
                    const oSkillAdvantages = this.store.getters[oGetters.advantage]
                    if (!oSkillAdvantages) {
                        throw new Error('This skill adv/dis getters does not exist : "' + oGetters.advantage + '"')
                    }
                    const oSkillDisadvantages = this.store.getters[oGetters.disadvantage]
                    if (!oSkillDisadvantages) {
                        throw new Error('This skill adv/dis getters does not exist : "' + oGetters.disadvantage + '"')
                    }
                    ex = oSkillData.ability
                    if (sSkill in oSkillAdvantages) {
                        advantage = advantage || oSkillAdvantages[sSkill].value
                        al.push(...oSkillAdvantages[sSkill].rules)
                    }
                    if (sSkill in oSkillDisadvantages) {
                        disadvantage = disadvantage || oSkillDisadvantages[sSkill].value
                        dl.push(...oSkillDisadvantages[sSkill].rules)
                    }
                }
            }
            if (ex in ar) {
                advantage = advantage || ar[ex].value
                al.push(...ar[ex].rules)
            }
            if (ex in dr) {
                disadvantage = disadvantage || dr[ex].value
                dl.push(...dr[ex].rules)
            }
        })

        return {
            advantage,
            disadvantage,
            details: {
                advantages: al,
                disadvantages: dl,
            }
        }
    }

    /*
        ######
        #     #   ####   #       #        ####
        #     #  #    #  #       #       #
        ######   #    #  #       #        ####
        #   #    #    #  #       #            #
        #    #   #    #  #       #       #    #
        #     #   ####   ######  ######   ####

     */

    /**
     * Tire des dés en fonction de la formule spécifiée
     * formule exemple : 1d6 ; 2d6+1 ; 10d8 ; 3d8 ; 2d10...
     * @param d {number|string}
     * @returns {number}
     */
    roll (d) {
        return this._dice.evaluate(d)
    }

    /**
     * Effectue un jet de dé 20, en appliquant les avantages et désavantages de ce type de lancer
     * (attaque, sauvegarde, compétence)
     * @param sRollType {string} ROLL_TYPE_* déterminer en quelle occasion on lance le dé
     * @param sAbility {string} spécifié la caractéristique impliquée dans le jet de dé
     * @param [extra] {string[]} information supplémentaire
     * pour un jet de sauvegarde on peut indiquer le type de menace (DAMAGE_TYPE_FIRE, SPELL_TYPE_MIND_CONTROL)
     * pour un jet de compétence on peut indiquer la nature de la compétence (SKILL_STEALTH...)
     * certaines créature ont des avantages ou des désavantages spécifiques à certaines situations
     * @returns {{ value: number, circumstances: D20Circumstances }}
     */
    rollD20 (sRollType, sAbility, extra = []) {
        const circumstances = this.getCircumstances(sRollType, [sAbility, ...extra])
        const { advantage, disadvantage } = circumstances
        const r = this._dice.roll(20)
        if (advantage && !disadvantage) {
            return {
                value: Math.max(r, this._dice.roll(20)),
                circumstances
            }
        }
        if (disadvantage && !advantage) {
            return {
                value: Math.min(r, this._dice.roll(20)),
                circumstances
            }
        }
        return {
            value: r,
            circumstances
        }
    }

    /**
     * Vérifie l'effet LUCKY pour savoir si on a la possibilité de transformer un echec en réussite
     * @return {boolean}
     */
    checkLuck () {
        if (!this.store.getters.getEffectSet.has(CONSTS.EFFECT_LUCKY)) {
            return false
        }
        const eLucky = this.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_LUCKY)
        if (eLucky.amp >= 20) {
            eLucky.amp = 0
            return true
        } else {
            return false
        }
    }

    /**
     * Effectue une attaque, ajoute les bonus d'attaque, détermine si le coup est critique
     * Ne fonctionne qu'avec les attaques physiques, pas les sorts
     *
     * @typedef AttackOutcome {object}
     * @property ac {number}
     * @property bonus {number}
     * @property critical {boolean}
     * @property deflector {string}
     * @property dice {number}
     * @property distance {number}
     * @property hit {boolean}
     * @property range {number}
     * @property roll {number}
     * @property target {Creature}
     * @property weapon {D20Item}
     * @property ammo {D20Item}
     * @property advantages {D20RuleValue}
     * @property disadvantages {D20RuleValue}
     * @property sneakable {boolean}
     * @property damages {amount: number, types: object<string, number>, resisted: object<string, number>}
     *
     * @returns {AttackOutcome}
     */
    rollAttack () {
        const sg = this.store.getters
        const oTarget = this.getTarget()
        const bonus = this.getAttackBonus()
        const sOffensiveAbility = this.store.getters.getOffensiveAbility
        const dice = this.rollD20(CONSTS.ROLL_TYPE_ATTACK, sOffensiveAbility).value
        const critical = dice >= sg.getSelectedWeaponCriticalThreat
        const ac = oTarget.store.getters.getArmorClass
        const roll = dice + bonus
        const distance = sg.getTargetDistance
        const range = sg.getSelectedWeaponRange
        const weapon = sg.getSelectedWeapon
        const ammo = sg.isRangedWeaponProperlyLoaded ? sg.getEquippedItems[CONSTS.EQUIPMENT_SLOT_AMMO] : null
        const advantages = sg.getAdvantages[CONSTS.ROLL_TYPE_ATTACK][sOffensiveAbility]
        const disadvantages = sg.getDisadvantages[CONSTS.ROLL_TYPE_ATTACK][sOffensiveAbility]
        const bCriticalHit = dice >= Creature.AssetManager.data.variables.ROLL_AUTO_SUCCESS
        const bCriticalFail = dice <= Creature.AssetManager.data.variables.ROLL_AUTO_FAIL
        const bFinesseWeapon = sg.isWieldingFinesseWeapon
        const bRangedWeapon = sg.isWieldingRangedWeapon && sg.isRangedWeaponProperlyLoaded
        const bAdvantaged = advantages.value
        const bDisadvantaged = disadvantages.value
        const bDistractedTarget = oTarget.getTarget() !== this
        const bSneakableWeapon = bFinesseWeapon || bRangedWeapon
        // Regle du sneak :
        // 1: disposer d'une arme finesse ou ranged
        // 2: être avantagé en attaque
        // 3: ne pas être avantagé en attaque mais la cible est occupée avec une autre cible
        // resultat = 1 && (2 || 3)
        const sneakable = bSneakableWeapon && (bAdvantaged || (!bDisadvantaged && bDistractedTarget))
        const hit = bCriticalHit
            ? true
            : bCriticalFail
                ? false
                : roll >= ac
        const target = this.getTarget()
        const deflector = hit ? '' : target.getDeflectingArmorPart(bCriticalFail ? -1 : roll).type
        return {
            ac,
            bonus,
            critical: critical || this.store.getters.isTargetAutoCritical,
            deflector,
            dice,
            distance,
            hit,
            range,
            roll,
            target,
            weapon,
            ammo,
            advantages,
            disadvantages,
            sneakable,
            damages: {
                amount: 0,
                resisted: {},
                types: {}
            }
        }
    }

    createDefaultAttackOutcome (oDefault = {}) {
        const sg = this.store.getters
        const target = this.getTarget()
        const tsg = target.store.getters
        const distance = sg.getTargetDistance
        const range = sg.getSelectedWeaponRange
        const ac = tsg.getArmorClass
        const weapon = sg.getSelectedWeapon
        return {
            ac,
            bonus: 0,
            critical: false,
            deflector: '',
            dice: 0,
            distance,
            hit: false,
            range,
            roll: 0,
            target,
            weapon,
            kill: false,
            failed: false,
            failure: '',
            advantages: { rules: [], value: false },
            disadvantages: { rules: [], value: false },
            sneakable: false,
            damages: {
                amount: 0,
                resisted: {},
                types: {}
            },
            ...oDefault
        }
    }

    /**
     * Lance un dé pour déterminer le résultat d'une vérification compétence
     * On détermine la caractéristique associée à la compétence puis lance un D20
     *
     * Pour sleight of hand il faut faire un rollSkill('skill-sleight-of-hand', ...)
     * Mais si on utilise un thieves tool on doit ajouter le bonus proficiency (si on a l'expertise)
     *
     * @param sSkill {string} le skill à tester
     * @param dc {number} difficulty class
     * @param sExtraStackingProficiency {string|''} principalement utilisé lorsqu'un outil permet d'appuyer l'expertise
     * de la compétence, généralement THIEVES TOOL
     */
    rollSkill (sSkill, dc, sExtraStackingProficiency = '') {
        const sg = this.store.getters
        // données du skill
        const aSkills = sg.getProficiencies
        const bSkillProficient = aSkills.includes(sSkill)
        // déterminer les bonus du skill
        const nSkillBonus = this
            .aggregateModifiers([
                CONSTS.ITEM_PROPERTY_SKILL_BONUS,
                CONSTS.EFFECT_SKILL_BONUS
            ], {
                propFilter: prop => prop.data.skill === sSkill,
                effectFilter: eff => eff.data.skill === sSkill,
            }).sum
        // déterminer la carac du skill
        const oSkillData = this.getSkillData(sSkill)
        const sSkillAbility = oSkillData.ability
        // Ajouter un evéntuel bonus de proficiency (mais qui ne se stack pas)
        const nSkillProfBonus = (bSkillProficient ? sg.getProficiencyBonus : 0)
        const amExpertise = this
            .aggregateModifiers([
                CONSTS.EFFECT_SKILL_EXPERTISE
            ], {
                effectFilter: eff => eff.data.type === sSkill || eff.data.type === sSkillAbility || eff.data.type === sExtraStackingProficiency,
                effectAmpMapper: eff => Math.ceil(eff.amp * sg.getProficiencyBonus),
                effectSorter: eff => eff.data.type
            })
        const amExpertiseSorter = amExpertise.sorter
        const nSkillExpertiseValue = amExpertiseSorter[sSkill]?.max || 0
        const nAbilityExpertiseValue = amExpertiseSorter[sSkillAbility]?.max || 0
        const nStackedExpertiseValue = amExpertiseSorter[sExtraStackingProficiency]?.max || 0
        const nMinimumRoll = nSkillExpertiseValue > 0
            ? this
                .aggregateModifiers([
                    CONSTS.EFFECT_SKILL_EXPERTISE_MINIMUM_ROLL
                ], {
                }).max || 0
            : 0
        const nExtraProfBonus = Math.max(nSkillExpertiseValue, nAbilityExpertiseValue)
        const nTotalProfBonus = Math.max(nSkillProfBonus, nExtraProfBonus)
        const nAbilityBonus = sg.getAbilityModifiers[sSkillAbility]
        const nTotalBonus = nAbilityBonus + nSkillBonus + nTotalProfBonus + nStackedExpertiseValue
        const { value, circumstances } = this.rollD20(CONSTS.ROLL_TYPE_CHECK, sSkillAbility, [sSkill])
        const roll = Math.max(nMinimumRoll, value)
        const nTotal = roll + nTotalBonus
        const success = nTotal >= dc
        const outcome = {
            bonus: nTotalBonus,
            roll,
            value: nTotal,
            dc,
            success,
            ability: sSkillAbility,
            circumstance: this.getCircumstanceNumValue(circumstances)
        }
        this.effectProcessor.invokeAllEffectsMethod(this, 'check', this, this, { outcome })
        // To unlock door : throw skill sleight of hand + ptoficiency bonus with thieves tools
        this._events.emit('check-skill', outcome)
        return outcome
    }

    /**
     * Lancer un dé pour déterminer les dégâts occasionné par un coup porté par l'arme actuellement sélectionnée
     * La valeur renvoyée ne fait pas intervenir des bonus liés aux effets de la créature ou à ses caractéristiques
     * @param critical {boolean} si true alors le coup est critique et tous les jets de dé doivent être doublés
     * @param dice {Dice} dé à utiliser
     * return {Object<string, number>}
     */
    rollWeaponDamage ({ critical = false } = {}) {
        const oWeapon = this.store.getters.getSelectedWeapon
        const nExtraDamageDice = this.store.getters.isWieldingHeavyMeleeWeapon
            ? this.store.getters.getSizeProperties.extraMeleeDamageDice
            : 0
        const n = (critical ? Creature.AssetManager.data.variables.CRITICAL_FACTOR : 1) + nExtraDamageDice
        let nDamage = 0
        const nRerollThreshold = this.store.getters.getDamageRerollThreshold
        let bRerolled = false
        for (let i = 0; i < n; ++i) {
            let nRoll = this.roll(oWeapon.damage)
            if (nRoll <= nRerollThreshold && !bRerolled) {
                bRerolled = true
                nRoll = this.roll(oWeapon.damage)
            }
            nDamage += nRoll
        }
        const oDamageBonus = this.getDamageBonus({ critical })
        if (!(oWeapon.damageType in oDamageBonus)) {
            oDamageBonus[oWeapon.damageType] = 0
        }
        oDamageBonus[oWeapon.damageType] = Math.max(1, oDamageBonus[oWeapon.damageType] + nDamage)
        return oDamageBonus
    }

    /**
     *
     * @param oTarget {Creature}
     * @returns {ComparatorConsiderResult}
     */
    compare (oTarget) {
        return Comparator.consider(this, oTarget)
    }

    /**
     * Renvoie un code de circonstance
     * 0 pour : ni avantage, ni désavantage, (ou bien avantage et désavantage)
     * 1 pour : avantage
     * -1 pour : désavantage
     * @param oCirc {D20Circumstances}
     * @return {number}
     */
    getCircumstanceNumValue (oCirc) {
        if (oCirc.advantage && oCirc.disadvantage) {
            return 0
        } else if (oCirc.advantage) {
            return 1
        } else if (oCirc.disadvantage) {
            return -1
        } else {
            return 0
        }
    }

    /**
     *
     * @param sAbility {string}
     * @param aThreats {string[]}
     * @param dc {number}
     * @param source {Creature|null}
     * @returns {{ roll, bonus, value, source, circumstance, success }}
     */
    rollSavingThrow (sAbility, aThreats = [], dc, source = null) {
        if (source) {
            this.setAggressor(source)
        }
        const st = this.store.getters.getSavingThrowBonus
        const sta = sAbility in st ? st[sAbility] : 0
        const stt = aThreats.reduce((prev, sThreat) => {
            return sThreat in st ? prev + st[sThreat] : prev
        }, 0)
        const bonus = sta + stt
        const r = this.rollD20(CONSTS.ROLL_TYPE_SAVE, sAbility, aThreats)
        const value = r.value + bonus
        const output = {
            roll: r.value,
            source,
            bonus,
            value,
            ability: sAbility,
            threats: aThreats,
            dc,
            success: dc !== undefined ? value >= dc : undefined,
            circumstance: this.getCircumstanceNumValue(r.circumstances)
        }
        this._events.emit('saving-throw', { output })
        return output
    }

    /**
     * @typedef D20OnHitContext {object}
     * @property target {Creature} Créature sur laquelle s'applique l'effet de l'itemproperty onhit
     * @property source {Creature} Créature qui détient l'arme qui a l'itemproperty onhit
     * @property property {object} ItemProperty
     * @property data {{}} objet aditionel de sauvegarde d'information enter les appel
     *
     * @param oTarget {Creature}
     * @param oAttackOutcome {AttackOutcome}
     */

    processOnHit (oTarget, oAttackOutcome) {
        const aHitProps = this
            .store
            .getters
            .getSelectedWeaponOnHitProperties
        const oContext = {
            target: oTarget,
            source: this,
            property: null,
            attackOutcome: oAttackOutcome,
            data: {}
        }
        const oScripts = Creature.AssetManager.scripts
        aHitProps.forEach(prop => {
            const sScript = prop.data.script
            oContext.property = prop
            if (sScript in oScripts) {
                oScripts[sScript](oContext)
            } else {
                throw new Error('Could not find ON HIT script ' + sScript)
            }
        })
    }

    processOnDamaged (oDamageEffect, oSource) {
        const oContext = {
            target: this,
            source: oSource,
            damage: oDamageEffect,
            property: null,
            data: {}
        }
        const oScripts = Creature.AssetManager.scripts
        this.aggregateModifiers([
            CONSTS.ITEM_PROPERTY_ON_DAMAGED
        ], {
            propForEach: prop => {
                oContext.property = prop
                const sScript = prop.data.script
                if (sScript in oScripts) {
                    oScripts[sScript](oContext)
                } else {
                    throw new Error('Could not find ON DAMAGE script ' + sScript)
                }
            }
        })
        this.store.getters.getBreakableEffects.forEach(eff => {
            eff.duration = 0
        })
    }

    /*
           #
          # #     ####    #####     #     ####   #    #   ####
         #   #   #    #     #       #    #    #  ##   #  #
        #     #  #          #       #    #    #  # #  #   ####
        #######  #          #       #    #    #  #  # #       #
        #     #  #    #     #       #    #    #  #   ##  #    #
        #     #   ####      #       #     ####   #    #   ####
     */

    action (sAction) {
        this._events.emit('action', {
            action: sAction
        })
        const scriptFunction = Creature.AssetManager.scripts[sAction]
        if (!scriptFunction) {
            throw new Error('ERR_SCRIPT_ACTION_NOT_FOUND: ' + sAction)
        } else {
            scriptFunction(this)
        }
    }

    featAction (sFeat) {
        const oCounters = this.store.getters.getCounters
        if (sFeat in Creature.AssetManager.data) {
            const oFeatData = Creature.AssetManager.data[sFeat]
            if ('when' in oFeatData) {
                if (!this.store.getters[oFeatData.when]) {
                    throw new Error('ERR_FEAT_ACTION_NOT_AVAILABLE')
                }
            }
            if ('action' in oFeatData) {
                if (sFeat in oCounters) {
                    if (oCounters[sFeat].value > 0) {
                        this.store.mutations.setCounterValue({
                            counter: sFeat,
                            value: oCounters[sFeat].value - 1
                        })
                    } else {
                        // le compteur est épuisé
                        throw new Error('ERR_FEAT_ACTION_DEPLETED_USE')
                    }
                }
                this.action(oFeatData.action)
            } else {
                throw new Error('ERR_FEAT_HAS_NO_ACTION')
            }
        } else {
            throw new Error('ERR_FEAT_IS_INVALID')
        }
    }

    useOffensiveSlot (slot) {
        if (slot !== this.store.getters.getOffensiveSlot) {
            const oEmit = {
                previous: {
                    slot: this.store.getters.getOffensiveSlot,
                    weapon: this.store.getters.getSelectedWeapon
                },
                current: {
                    slot,
                    weapon: this.store.getters.getEquippedItems[slot]
                }
            }
            this._events.emit('offensive-slot', oEmit)
            this.store.mutations.setSelectedWeapon({ slot })
        }
    }

    /**
     * Se précipite vers la cible, pour se mettre à portée de l'arme
     */
    rushToTarget () {
        const nDistance = this.store.getters.getTargetDistance
        this.setDistanceToTarget(Math.max(1, nDistance - this.store.getters.getSpeed))
    }

    /**
     * Transmet un évènement d'attaque au gestionnaire.
     * Notifie à tous les effets de cette attaque
     * @param outcome {AttackOutcome}
     */
    notifyAttack (outcome) {
        this.effectProcessor.invokeAllEffectsMethod(this, 'attack', outcome.target, this, { outcome })
        outcome.target.effectProcessor.invokeAllEffectsMethod(outcome.target, 'attacked', outcome.target, this, { outcome })
        this._events.emit('attack', { outcome })
    }

    /**
     * Effectue une attaque contre la cible actuelle
     * @param target {Creature} définit une nouvelle cible
     * @returns {AttackOutcome|false}
     */
    attack (target = null) {
        // On a vraiment une cible
        if (target) {
            this.setTarget(target)
        }
        const oTarget = this.getTarget()

        if (!oTarget) {
            const outcome = this.createDefaultAttackOutcome({
                failed: true,
                failure: CONSTS.ATTACK_OUTCOME_NO_TARGET,
            })
            this.notifyAttack(outcome)
            return outcome
        }

        const sBetterSlot = this.store.getters.getSuitableOffensiveSlot
        if (sBetterSlot === '') {
            /*
                avant on renvoyait un outcome ATTACK_OUTCOME_UNREACHABLE
                Et cela ne réglais pas les problèmes
                car le système gardait une arme à distance non-approvisionné, equipée,
                et la créature ne pouvait pas attaquer et restait inactive
            */
            // déterminer si on a une arme de mélée ou bien une arme naturelle

            if (this.store.getters.getEquippedWeapons.melee) {
                this.useOffensiveSlot(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
            } else if (this.store.getters.getEquippedWeapons.natural) {
                this.useOffensiveSlot(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON)
            } else {
                // Vraiment aucune arme
                const outcome = this.createDefaultAttackOutcome({
                    failed: true,
                    failure: CONSTS.ATTACK_OUTCOME_UNREACHABLE
                })
                this.notifyAttack(outcome)
                return outcome
            }
        } else {
            this.useOffensiveSlot(sBetterSlot)
        }

        if (!this.store.getters.canAttackTarget) {
            const outcome = this.createDefaultAttackOutcome({
                failed: true,
                failure: CONSTS.ATTACK_OUTCOME_CONDITION,
            })
            this.notifyAttack(outcome)
            return outcome
        }
        // Déterminer si on est à portée
        if (!this.store.getters.isTargetInWeaponRange) {
            const outcome = this.createDefaultAttackOutcome({
                failed: true,
                failure: CONSTS.ATTACK_OUTCOME_UNREACHABLE,
            })
            this.notifyAttack(outcome)
            return outcome
        }
        oTarget.setAggressor(this)
        // jet d'attaque
        const oAtk = this.rollAttack()
        // si ça touche, calculer les dégâts
        if (oAtk.hit) {
            const oDamages = this.rollWeaponDamage({
                critical: oAtk.critical
            })
            // générer les effets de dégâts
            const oResisted = {}
            // appliquer les effets sur la cible
            oAtk.damages.resisted = oResisted
            oAtk.damages.types = oDamages
            oAtk.damages.amount = 0
            this.notifyAttack(oAtk)
            Object
                .entries(oDamages)
                .forEach(([sType, nValue]) => {
                    const aDamageEffectMaterials = PHYSICAL_DAMAGE_TYPES.includes(sType)
                        ? [...this.store.getters.getSelectedWeaponMaterialSet]
                        : undefined

                    const eDam = EffectProcessor.createEffect(
                        CONSTS.EFFECT_DAMAGE,
                        nValue,
                        sType,
                        aDamageEffectMaterials,
                        oAtk.critical
                    )
                    eDam.subtype = CONSTS.EFFECT_SUBTYPE_WEAPON
                    const eMitigDam = oTarget.applyEffect(eDam, 0, this)
                    const n = eMitigDam.data.resistedAmount
                    if (!(sType in oResisted)) {
                        oResisted[sType] = n
                    } else {
                        oResisted[sType] += n
                    }
                    oAtk.damages.amount += eMitigDam.amp
                    oDamages[sType] -= n
                    return eMitigDam
                })
            // application d'effets on hit
            if (oAtk.damages.amount > 0) {
                this.processOnHit(oTarget, oAtk)
            }
        } else {
            this.notifyAttack(oAtk)
        }
        return oAtk
    }

    /**
     * Calcule quelle partie de la défense a permis d'esquiver le coup.
     * Permet d'enrichir la description de l'esquive d'un coup
     * @param nAttackRoll
     * @returns {*|{min: *, max: number, type: (*|string), value: number}}
     */
    getDeflectingArmorPart (nAttackRoll) {
        const acr = this
            .store
            .getters
            .getArmorClassRanges
        const d = acr.find(({ min, max }) => min <= nAttackRoll && nAttackRoll <= max)
        if (d) {
            return d
        } else {
            return { type: CONSTS.ARMOR_DEFLECTOR_HIT, min: acr[acr.length - 1].max + 1, max: Infinity, value: Infinity }
        }
    }

    /**
     * Renvoie la capcité de la créature à voir une autre créature
     * @param oTarget {Creature}
     * @return {string}
     */
    canSee (oTarget) {
        const csg = this.store.getters
        const tsg = oTarget.store.getters
        const bMeBlind = csg.getConditionSet.has(CONSTS.CONDITION_BLINDED)
        if (bMeBlind) {
            return CONSTS.PERCEPTION_BLIND
        }
        const bTargetInvisible = tsg.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)
        const bMeSeeInvisibility =
            csg.getEffectSet.has(CONSTS.EFFECT_SEE_INVISIBILITY) ||
            csg.getEffectSet.has(CONSTS.EFFECT_TRUE_SIGHT)
        if (bTargetInvisible && !bMeSeeInvisibility) {
            return CONSTS.PERCEPTION_INVISIBLE
        }
        return CONSTS.PERCEPTION_VISIBLE
    }
}

module.exports = Creature
