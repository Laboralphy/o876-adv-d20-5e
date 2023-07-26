const CONSTS = require('./consts')
const EffectProcessor = require('./EffectProcessor')
const Dice = require('../libs/dice')
const { v4: uuidv4 } = require('uuid')
const Events = require('events')
const PHYSICAL_DAMAGE_TYPES = require('./data/physical-damage-types.json')

// Store
const { aggregateModifiers } = require("./store/creature/common/aggregate-modifiers");

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
        this._effectProcessor = new EffectProcessor()
        this._events = new Events()
        this._store.mutations.setId({ value: this._id })
    }

    static set AssetManager (value) {
        Creature._AssetManager = value
    }

    static get AssetManager () {
        return Creature._AssetManager
    }

    get entityType () {
        return CONSTS.ENTITY_TYPE_ACTOR
    }

    set name (value) {
        this._name = value
    }

    /**
     * Définie la reférence du blueprint qui a servit à construire la creature
     * @param value {string}
     */
    set ref (value) {
        this._ref = value
    }

    /**
     * Renvoie la référence du blueprint qui a servit a construre la creature
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

    get effectProcessor () {
        return this._effectProcessor
    }
    get id () {
        return this._id
    }

    set id (value) {
        this._id = value
        this.store.mutations.setId({ value })
    }

    get store () {
        return this._store
    }

    get state () {
        return this._store.getters.getExportedState
    }

    set state (state) {
        this._store.mutations.importCreatureState({ state })
    }

    /**
     *
     * @param oItem {D20Item}
     * @param [sEquipmentSlot] {string}
     */
    equipItem (oItem, sEquipmentSlot = '') {
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
        this.store.mutations.equipItem({ item: oItem, slot: sES })
        return oPrevItem
    }

    unequipItem (slot) {
        return this.equipItem(null, slot)
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
     * @returns {{sorter: Object<String, {sum: number, max: number, count: number}>, max: number, sum: number, count: number, effects: number, ip: number}}
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
        if (this._target.creature && this._target.handler) {
            this._target.creature.store.events.off('mutation', this._target.handler)
            this._target.creature = null
            this._target.handler = null
            this.store.mutations.clearTarget()
        }
    }

    updateTarget (name) {
        switch (name) {
            case 'removeEffect':
            case 'addEffect': {
                this.store.mutations.updateTargetConditions({ conditions: this._target.creature.store.getters.getConditionSources })
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
                conditions: this._target.creature.store.getters.getConditionSources
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
        if (this._aggressor.creature && this._aggressor.handler) {
            this._aggressor.creature.store.events.off('mutation', this._aggressor.handler)
            this._aggressor.creature = null
            this._aggressor.handler = null
            this.store.mutations.clearAggressor()
        }
    }

    updateAggressor (name) {
        switch (name) {
            case 'removeEffect':
            case 'addEffect': {
                this.store.mutations.updateAggressorConditions({ conditions: this._aggressor.creature.store.getters.getConditionSources })
                break
            }
        }
    }

    setAggressor (oCreature) {
        if (this._aggressor.creature !== oCreature) {
            this.clearAggressor()
            this._aggressor.creature = oCreature
            this._aggressor.handler = ({ name, payload }) => this.updateAggressor(name, payload)
            this.store.mutations.updateAggressorConditions({ id: oCreature.id, conditions: this._aggressor.creature.store.getters.getConditionSources })
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
        if (this.getAggressor() === oCreature) {
            this.clearAggressor()
        }
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
            this.events.emit('death', { killer: source })
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
        return Creature.AssetManager.data[sSkillDataProp]
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
     */
    rollSkill (sSkill, dc = undefined) {
        const sg = this.store.getters
        // données du skill
        const aSkills = sg.getSkillProficiencies
        const bProficient = aSkills.has(sSkill)
        // déterminer les bonus du skill
        const nSkillBonus = this
            .aggregateModifiers([CONSTS.ITEM_PROPERTY_SKILL_BONUS], {
                propFilter: prop => prop.data.skill === sSkill
            })
            .sum +
            (bProficient ? sg.getProficiencyBonus : 0)
        // déterminer la carac du skill
        const oSkillData = this.getSkillData(sSkill)
        const sSkillAbility = oSkillData.ability
        const nAbilityBonus = sg.getAbilityModifiers[sSkillAbility]
        const nTotalBonus = nAbilityBonus + nSkillBonus
        const { value, circumstances } = this.rollD20(CONSTS.ROLL_TYPE_CHECK, sSkillAbility, [sSkill])
        const nTotal = value + nTotalBonus
        const output = {
            bonus: nTotalBonus,
            roll: value,
            value: nTotal,
            dc,
            success: dc !== undefined ? nTotal >= dc : undefined,
            ability: sSkillAbility,
            circumstance: this.getCircumstanceNumValue(circumstances)
        }
        this._events.emit('check-skill', output)
        return output
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
            oDamageBonus[oWeapon.damageType] = Math.max(1, nDamage)
        } else {
            oDamageBonus[oWeapon.damageType] = Math.max(1, oDamageBonus[oWeapon.damageType] + nDamage)
        }
        return oDamageBonus
    }

    getChallengeRating () {
        const data = Creature.AssetManager.data['challenge-rating']
        const getters = this.store.getters

        const half = x => (Math.abs(x) / 2) * Math.sign(x)

        const hp = getters.getMaxHitPoints
        const ac = getters.getArmorClass
        const indexDefCR = data.findIndex(({ hpmin, hpmax }) => hpmin <= hp && hp <= hpmax)
        const oRowDefCR = data[indexDefCR]
        const nDeltaAC = ac - oRowDefCR.ac
        const defcr = oRowDefCR.cr + half(nDeltaAC)

        this._dice.debug(true, 0.5)
        const oAverageDamage = this.rollWeaponDamage({ critical: false })
        this._dice.debug(false)

        const atk = getters.getAttackBonus
        const nAverageDamage = Object.values(oAverageDamage).reduce((prev, curr) => prev + curr, 0)
        const indexOffCR = data.findIndex(({ dmgmin, dmgmax }) => dmgmin <= nAverageDamage && nAverageDamage <= dmgmax)
        const oRowOffCR = data[indexOffCR]
        const nDeltaAtk = atk - oRowOffCR.atk
        const offcr = oRowOffCR.cr + half(nDeltaAtk)

        const cr = Math.round(100 * ((defcr + offcr) / 2)) / 100

        console.log({
            def: {
                CR: defcr,
                AC: ac,
                refAC: oRowDefCR.ac,
                deltaAC: nDeltaAC,
                HP: hp,
            },
            off: {
                CR: offcr,
                Atk: atk,
                refAtk: oRowOffCR.atk,
                deltaAtk: nDeltaAtk,
                Dmg: nAverageDamage,
            }
        })

        return cr
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
     * @returns {{ roll, bonus, value, circumstance, success }}
     */
    rollSavingThrow (sAbility, aThreats = [], dc) {
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
            bonus,
            value,
            ability: sAbility,
            threats: aThreats,
            dc,
            success: dc !== undefined ? value >= dc : undefined,
            circumstance: this.getCircumstanceNumValue(r.circumstances)
        }
        this._events.emit('saving-throw', output)
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
        if (sFeat in Creature.AssetManager.data) {
            const oFeatData = Creature.AssetManager.data[sFeat]
            if ('when' in oFeatData) {
                if (!this.store.getters[oFeatData.when]) {
                    throw new Error('ERR_FEAT_ACTION_NOT_AVAILABLE')
                }
            }
            if ('action' in oFeatData) {
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
            this._events.emit('attack', { outcome })
            return outcome
        }

        const sBetterSlot = this.store.getters.getSuitableOffensiveSlot
        if (sBetterSlot === '') {
            return this.createDefaultAttackOutcome()
        }
        this.useOffensiveSlot(sBetterSlot)

        if (!this.store.getters.canAttackTarget) {
            const outcome = this.createDefaultAttackOutcome({
                failed: true,
                failure: CONSTS.ATTACK_OUTCOME_CONDITION,
            })
            this._events.emit('attack', { outcome })
            return outcome
        }
        // Déterminer si on est à portée
        if (!this.store.getters.isTargetInWeaponRange) {
            const outcome = this.createDefaultAttackOutcome({
                failed: true,
                failure: CONSTS.ATTACK_OUTCOME_UNREACHABLE,
            })
            this._events.emit('attack', { outcome })
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
            let amount = 0
            const oResisted = {}
            Object
                .entries(oDamages)
                .forEach(([sType, nValue]) => {
                    const aDamageEffectMaterials = PHYSICAL_DAMAGE_TYPES.includes(sType)
                        ? [...this.store.getters.getSelectedWeaponMaterial]
                        : undefined

                    const eDam = EffectProcessor.createEffect(
                        CONSTS.EFFECT_DAMAGE,
                        nValue,
                        sType,
                        aDamageEffectMaterials,
                        oAtk.critical
                    )
                    eDam.subtype = CONSTS.EFFECT_SUBTYPE_WEAPON
                    const eMitigDam = oTarget.applyEffect(eDam)
                    const n = eMitigDam.data.resistedAmount
                    if (!(sType in oResisted)) {
                        oResisted[sType] = n
                    } else {
                        oResisted[sType] += n
                    }
                    amount += eMitigDam.amp
                    oDamages[sType] -= n
                    return eMitigDam
                })
            // appliquer les effets sur la cible
            oAtk.damages.resisted = oResisted
            oAtk.damages.types = oDamages
            oAtk.damages.amount = amount

            // application d'effets on hit
            if (amount > 0) {
                this.processOnHit(oTarget, oAtk)
            }
        }
        this._events.emit('attack', { outcome: oAtk })
        return oAtk
    }

    getDeflectingArmorPart (nAttackRoll) {
        const d = this
            .store
            .getters
            .getArmorClassRanges
            .find(({ min, max }) => min <= nAttackRoll && nAttackRoll <= max)
        if (d) {
            return d
        } else {
            console.error(this
                .store
                .getters
                .getArmorClassRanges, this
                .store
                .getters
                .getArmorClassDetails,
                nAttackRoll)
            throw new Error('WTF ' + nAttackRoll + ' not in range')
        }
    }
}

module.exports = Creature
