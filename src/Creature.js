const CONSTS = require('./consts')
const EffectProcessor = require('./EffectProcessor')
const Dice = require('../libs/dice')

// Store
const CreatureStore = require('./store/creature')
const { assetManager } = require('./assets')
const {aggregateModifiers} = require("./store/creature/common/aggregate-modifiers");

let LAST_ID = 0

class Creature {
    constructor () {
        this._id = ++LAST_ID
        this._dice = new Dice()
        this._target = {
            handler: null,
            creature: null
        }
        this._aggressor = {
            handler: null,
            creature: null
        }
        /**
         * @type {D20CreatureStore}
         * @private
         */
        this._store = assetManager.createStore('creature')
        this._effectProcessor = new EffectProcessor()
    }

    get dice () {
        return this._dice
    }

    set dice (value) {
        this._dice = value
    }

    get id () {
        return this._id
    }

    get store () {
        return this._store
    }

    /**
     *
     * @param oItem {D20Item}
     * @param sEquipmentSlot {string}
     */
    equipItem (oItem, sEquipmentSlot = '') {
        const sES = sEquipmentSlot === '' ? oItem.equipmentSlots[0] : sEquipmentSlot
        const oPrevItem = this.store.getters.getEquippedItems[sES]
        this.store.mutations.equipItem({ item: oItem, slot: sES })
        return oPrevItem
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
     * @returns {{sorter: {Object}, max: number, sum: number}}
     */
    aggregateModifiers (aTags, filters = {}) {
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
     * @return {Object<string, number>}
     */
    getDamageBonus (bCritical = false) {
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
            propSorter: property => property.type || sWeaponDamType,
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
        if (bCritical) {
            const amCrit = this.aggregateModifiers([
                CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
                CONSTS.ITEM_PROPERTY_ENHANCEMENT,
                CONSTS.ITEM_PROPERTY_MASSIVE_CRITICAL
            ], {
                propSorter: property => property.type || sWeaponDamType,
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

    setTarget (oCreature) {
        if (this._target.creature !== oCreature) {
            this.clearTarget()
            this._target.creature = oCreature
            this._target.handler = ({ name, payload }) => this.updateTarget(name, payload)
            this.store.mutations.updateTargetConditions({ id: oCreature.id, conditions: this._target.creature.store.getters.getConditionSources })
            oCreature.store.events.on('mutation', this._target.handler)
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
        return this._effectProcessor.applyEffect(oEffect, this, duration, source)
    }

    processEffects () {
        this._effectProcessor.processCreatureEffects(this)
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

    /**
     *
     * @param sRollType
     * @param sAbility
     * @param sExtra
     * @returns {{disadvantage: *, advantage: *, details: {advantages: (*|string|CSSRuleList), disadvantages: (*|string|CSSRuleList)}}}
     */
    getCircumstances (sRollType, sAbility, sExtra) {
        const oAdvantages = this.store.getters.getAdvantages
        const oDisadvantages = this.store.getters.getDisadvantages
        const ar = oAdvantages[sRollType]
        const dr = oDisadvantages[sRollType]
        const ara = ar.abilities[sAbility].value
        const dra = dr.abilities[sAbility].value
        const al = ar.abilities[sAbility].rules
        const dl = dr.abilities[sAbility].rules
        let
            advantage = ara,
            disadvantage = dra
        if (sExtra !== '') {
            switch (sRollType) {
                case CONSTS.ROLL_TYPE_SAVE: {
                    advantage = advantage || ar[sExtra].value
                    disadvantage = disadvantage || dr[sExtra].value
                    al.assign(ar[sExtra].rules)
                    dl.assign(dr[sExtra].rules)
                    break
                }
                case CONSTS.ROLL_TYPE_CHECK: {
                    advantage = advantage || ar[sExtra].value
                    disadvantage = disadvantage || dr[sExtra].value
                    al.assign(ar[sExtra].rules)
                    dl.assign(dr[sExtra].rules)
                    break
                }
            }
        }
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
     * Tire des dé en fonction de la formule spécifiée
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
     * @param [extra] {string} information supplémentaire
     * pour un jet de sauvegarde on peut indiquer le type de menace (DAMAGE_TYPE_FIRE, SPELL_TYPE_MIND_CONTROL)
     * pour un jet de compétence on peut indiquer la nature de la compétence (SKILL_STEALTH...)
     * certaines créature ont des avantages ou des désavantages spécifiques à certaines situations
     * @returns {number}
     */
    rollD20 (sRollType, sAbility, extra = '') {
        const { advantage, disadvantage } = this.getCircumstances(sRollType, sAbility, extra)
        const r = this._dice.roll(20)
        if (advantage && !disadvantage) {
            return Math.max(r, this._dice.roll(20))
        }
        if (disadvantage && !advantage) {
            return Math.min(r, this._dice.roll(20))
        }
        return r
    }

    /**
     * Effectue une attaque, ajoute les bonus d'attaque, détermine si le coup est critique
     * Ne fonctionne qu'avec les attaques physiques, pas les sorts
     *
     * @typedef AttackOutcome {object}
     * @property ac {number}
     * @property hit {boolean}
     * @property critical {boolean}
     * @property bonus {number}
     * @property roll {number}
     * @property damages {amount: number, types: object<string, number>}
     *
     * @returns {AttackOutcome}
     */
    rollAttack () {
        const bonus = this.getAttackBonus()
        const sOffensiveAbility = this.store.getters.getOffensiveAbility
        const roll = this.rollD20(CONSTS.ROLL_TYPE_ATTACK, sOffensiveAbility)
        const nCritThreat = this.store.getters.getSelectedWeaponCriticalThreat
        const critical = roll >= nCritThreat
        const ac = this.store.getters.getArmorClass
        const hit = critical
            ? true
            : roll === 1
                ? false
                : (roll + bonus) >= ac
        return {
            ac,
            bonus,
            critical,
            hit,
            roll,
            damages: {
                amount: 0,
                types: {}
            }
        }
    }

    /**
     * Lance un dé pour déterminer le résultat d'une vérification compétence
     * On détermine la caractéristique associée à la compétence puis lance un D20
     */
    rollSkill (sSkill) {

    }


    /**
     * Lancer un dé pour déterminer les dégâts occasionné par un coup porté par l'arme actuellement sélectionnée
     * La valeur renvoyer ne fait pas intervenir des bonus liés aux effets de la créature ou à ses caractéristiques
     * @param critical {boolean} si true alors le coup est critique et tous les jets de dé doivent être doublés
     */
    rollWeaponDamage ({ critical = false } = {}) {
        const oWeapon = this.store.getters.getSelectedWeapon
        const n = critical ? 2 : 1
        let nDamage = 0
        const nRerollThreshold = this
            .aggregateModifiers(
                [CONSTS.EFFECT_REROLL],
                { effectFilter: f => f.data.when === CONSTS.ROLL_TYPE_DAMAGE }
            ).sum
        let bRerolled = false
        for (let i = 0; i < n; ++i) {
            let nRoll = this.roll(oWeapon.damage)
            if (nRoll <= nRerollThreshold && !bRerolled) {
                bRerolled = true
                nRoll = this.roll(oWeapon.damage)
            }
            nDamage += nRoll
        }
        const oDamageBonus = this.getDamageBonus(critical)
        if (!(oWeapon.damageType in oDamageBonus)) {
            oDamageBonus[oWeapon.damageType] = nDamage
        } else {
            oDamageBonus[oWeapon.damageType] += nDamage
        }
        return oDamageBonus
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

    doFeatAction (sFeat) {
        if (sFeat in assetManager.data) {
            const oFeatData = assetManager.data[sFeat]
            if ('when' in oFeatData) {
                if (!this.store.getters[oFeatData.when]) {
                    throw new Error('ERR_FEAT_ACTION_NOT_AVAILABLE')
                }
            }
            if ('action' in oFeatData) {
                assetManager.scripts[oFeatData.action](this)
            } else {
                throw new Error('ERR_FEAT_HAS_NO_ACTION')
            }
        } else {
            throw new Error('ERR_FEAT_IS_INVALID')
        }
    }

    /**
     * Effectue une attaque contre la cible actuelle
     */
    doAttack () {
        // jet d'attaque
        const oAtk = this.rollAttack()
        // si ça touche, calculer les dégâts
        if (oAtk.hit) {
            const oDamages = this.rollWeaponDamage({
                critical: oAtk.critical
            })
            // générer les effets de dégâts
            let amount = 0
            const aDamageEffects = Object
                .entries(oDamages)
                .map(([sType, nValue]) => {
                    amount += nValue
                    return EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, nValue, { type: sType })
                })
            // appliquer les effets sur la cible
            const oTarget = this.getTarget()
            aDamageEffects.forEach(d => oTarget.applyEffect(d, 0))
            oAtk.damages.types = oDamages
            oAtk.damages.amount = amount
        }
        return oAtk
    }
}

module.exports = Creature
