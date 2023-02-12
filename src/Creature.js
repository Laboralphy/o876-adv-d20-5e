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
     * Aggrège les effets spécifiés dans la liste, selon un prédicat
     * @param aTags {string[]} liste des effets désiré
     * @param filters {*} voir la fonction store/creature/common/aggregate-modifiers
     * @returns {{effects: D20Effect[], properties: object[], sorter: object, min: number, max: number, sum: number}}
     */
    aggregateModifiers (aTags, filters) {
        return aggregateModifiers(aTags, this.store.getters, filters)
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
        const am = this.aggregateModifiers([
            CONSTS.EFFECT_DAMAGE_BONUS,
            CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
            CONSTS.ITEM_PROPERTY_ENHANCEMENT
        ], {
            effectDisc: effect => effect.data.type || sWeaponDamType,
            propDisc: property => property.type || sWeaponDamType
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
        updateResult(am.sorter)
        if (bCritical) {
            const amCrit = this.aggregateModifiers([
                CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
                CONSTS.ITEM_PROPERTY_ENHANCEMENT,
                CONSTS.ITEM_PROPERTY_MASSIVE_CRITICAL
            ], {
                propDisc: property => property.type || sWeaponDamType
            })
            updateResult(amCrit.sorter)
        }
        return oResult
    }

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

    applyEffect (oEffect, duration = 0, source = null) {
        return this._effectProcessor.applyEffect(oEffect, this, duration, source)
    }

    processEffects () {
        this._effectProcessor.processCreatureEffects(this)
    }

    /**
     * Effectue un jet de dé 20, en appliquant les avantages et désavantages de ce type de lancer
     * (attaque, sauvegarde, compétence)
     * @param sRollType {string} ROLL_TYPE_* déterminer en quelle occasion on lance le dé
     * @param sAbility {string} spécifié la caractéristique impliquée dans le jet de dé
     * @param extra {string} information supplémentaire
     * pour un jet de sauvegarde on peut indiquer le type de menace (DAMAGE_TYPE_FIRE, SPELL_TYPE_MIND_CONTROL)
     * pour un jet de compétence on peut indiquer la nature de la compétence (SKILL_STEALTH...)
     * certaines créature ont des avantage ou des désavantaeg spécifique à certaines situations
     * @returns {number}
     */
    rollD20 (sRollType, sAbility, extra) {
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
     * Lance un dé pour déterminer le résultat d'une vérification compétence
     * On détermine la caractéristique associée à la compétence puis lance un D20
     */
    rollSkill (sSkill) {

    }


    /**
     * Lancer un dé pour déterminer les dégâts occasionné par un coup porté par l'arme actuellement sélectionnée
     * La valeur renvoyer ne fait pas intervenir des bonus liés aux effets de la créature  ou à ses caractéristiques
     * @param critical {boolean} si true alors le coup est critique et tous les jets de dé doivent être doublés
     * @param additionals {string[]} jet de dés additionnels tels que sneak attack, dirty strike etc...
     */
    rollWeaponDamage ({ critical = false, additionals = []} = {}) {
        const oWeapon = this.store.getters.getSelectedWeapon
        const n = critical ? 2 : 1
        let nDamage = 0
        for (let i = 0; i < n; ++i) {
            nDamage += this.roll(oWeapon.damage)
            additionals.forEach(ad => {
                nDamage += this.roll(ad)
            })
        }
        const oDamageBonus = this.getDamageBonus(critical)
        if (!(oWeapon.damageType in oDamageBonus)) {
            oDamageBonus[oWeapon.damageType] = nDamage
        } else {
            oDamageBonus[oWeapon.damageType] += nDamage
        }
        return oDamageBonus
    }

    /**
     * Tire des dé en fonction de la formule spécifiée
     * formule exemple : 1d6 ; 2d6+1 ; 10d8 ; 3d8 ; 2d10...
     * @param d {number|string}
     * @returns {number}
     */
    roll (d) {
        return this._dice.evaluate(d)
    }

    doFeatAction (sFeat) {
        if (sFeat in assetManager.data) {
            const oFeatData = assetManager.data[sFeat]
            if ('when' in oFeatData) {
                if (!this.store.getters[oFeatData.when]) {
                    throw new Error('ERR_FEAT_USES_DEPLETED')
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
}

module.exports = Creature
