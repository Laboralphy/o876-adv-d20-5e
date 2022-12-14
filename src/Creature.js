const Store = require('@laboralphy/store')
const path = require('path')
const CONSTS = require('./consts')

// Store
const CreatureStore = require('./store/creature')
const { assetManager } = require('./assets')

let LAST_ID = 0

class Creature {
    constructor () {
        this._id = ++LAST_ID
        this._state = CreatureStore.buildState()
        this._dice = null
        this._target = null
        /**
         * @type {D20CreatureStore}
         * @private
         */
        this._store = new Store({
            state: this._state,
            getters: CreatureStore.getters,
            mutations: CreatureStore.mutations,
            externals: {
                data: assetManager.data,
                blueprints: assetManager.blueprints
            }
        })
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
     * @param d {D20AdvantagesOrDisadvantages}
     * @param sRollType {string}
     * @param [target] {Creature}
     * @param [ability] {string}
     * @param [skill] {string}
     * @param [threat] {string}
     * @returns {boolean}
     * @private
     */
    _isAdvOrDisadv (d, sRollType, { ability = '', skill = '', threat = '' }) {
        let b = false
        if (ability !== '') {
            b = d[sRollType].abilities[ability].value
        }
        if (skill !== '' && sRollType === CONSTS.ROLL_TYPE_SKILL) {
            b = b || d.ROLL_TYPE_SKILL.skills[skill].value
        }
        if (threat !== '' && sRollType === CONSTS.ROLL_TYPE_SAVE) {
            b = b || d.ROLL_TYPE_SAVE.threats[threat].value
        }
        return b
    }

    /**
     * Renvoie true si la creature est désavantagée pour ce type de jet de dé et pour la caractéristique spécifiée
     * @param sRollType {string} ROLL_TYPE_*
     * @param ast {{ability: string, skill: string, threat: string}}
     * @returns {boolean}
     */
    isDisadvantaged (sRollType, ast) {
        return this._isAdvOrDisadv(this.store.getters.getDisadvantages, sRollType, ast)
    }

    /**
     * Renvoie true si la creature est avantagée pour ce type de jet de dé et pour la caractéristique spécifiée
     * @param sRollType {string} ROLL_TYPE_*
     * @param ast {{ability: string, skill: string, threat: string}}
     * @returns {boolean}
     */
    isAdvantaged (sRollType, ast) {
        return this._isAdvOrDisadv(this.store.getters.getAdvantages, sRollType, ast)
    }

    /**
     * Aggrège les effets spécifiés dans la liste, selon un prédicat
     * @param aTags {string[]} liste des effets désiré
     * @param effectFilter {function} prédicat de selection d'effets
     * @param propFilter {function}
     * @returns {{effects: D20Effect[], min: number, max: number, sum: number}}
     */
    aggregateModifiers (aTags, { effectFilter, propFilter } = {}) {
        const aTagSet = new Set(
            Array.isArray(aTags)
                ? aTags
                : [aTags]
        )
        const aFilteredEffects = this
            .store
            .getters
            .getEffects
            .filter(eff =>
                aTagSet.has(eff.tag) &&
                (effectFilter ? effectFilter(eff) : true)
            )
        const aFilteredItemProperties = this
            .store
            .getters
            .getEquipmentItemProperties
            .filter(ip =>
                aTagSet.has(ip.property) &&
                (propFilter ? propFilter(ip) : true)
            )
        const nEffAcc = aFilteredEffects.reduce((prev, curr) => prev + curr.amp, 0)
        const nEffMax = aFilteredEffects.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
        const nEffMin = aFilteredEffects.reduce((prev, curr) => Math.min(prev, curr.amp), nEffMax)
        const nIPAcc = aFilteredItemProperties.reduce((prev, curr) => prev + curr.amp, 0)
        const nIPMax = aFilteredItemProperties.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
        const nIPMin = aFilteredItemProperties.reduce((prev, curr) => Math.min(prev, curr.amp), nEffMax)
        return {
            effects: aFilteredEffects,
            sum: nEffAcc + nIPAcc,
            min: Math.min(nEffMin, nIPMin),
            max: Math.max(nEffMax, nIPMax)
        }
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
     * Calcule la classe d'armure de la créature
     * @return {number}
     */
    getAC () {
        const nBaseAC = this.store.getters.getArmorAndShieldClass
        const nItemACProps = this.aggregateModifiers([
            CONSTS.EFFECT_AC_BONUS,
            CONSTS.ITEM_PROPERTY_AC_BONUS
        ]).sum
        return nBaseAC + nItemACProps
    }

    /**
     * Calcule le bonus d'attaque
     * @returns {number}
     */
    getAttackBonus () {
        const getters = this.store.getters
        const bProficient = getters.isProficientSelectedWeapon
        const nProfBonus = bProficient ? getters.getProficiencyBonus : 0
        const sOffensiveAbility = getters.getOffensiveAbility
        const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAbility]
        return nAbilityBonus + nProfBonus + this.aggregateModifiers([
            CONSTS.EFFECT_ATTACK_BONUS,
            CONSTS.ITEM_PROPERTY_ENHANCEMENT,
            CONSTS.ITEM_PROPERTY_ATTACK_BONUS
        ]).sum
    }

    /**
     * Calcule le bonus de dégât de l'arme actuellement
     * @return {number}
     */
    getDamageBonus () {
        // Effect & Props damageBonus
        // Effect enhancement
        // offensive ability modifier
        // critical : roll damage twice
        // Weapon attribute Two handed : +50%
        // Weapon attribute semi auto : +50%
        // Weapon attribute auto : +100%
        const getters = this.store.getters
        const sOffensiveAbility = getters.getOffensiveAbility
        const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAbility]
        return nAbilityBonus + this.aggregateModifiers([
            CONSTS.EFFECT_DAMAGE_BONUS,
            CONSTS.ITEM_PROPERTY_DAMAGE_BONUS,
            CONSTS.ITEM_PROPERTY_ENHANCEMENT
        ]).sum
    }

    rollD20 (sRollType, sAbility, { target = null, extra = '' }) {
        const oAdvantages = this.store.getters.getAdvantages
        const oDisadvantages = this.store.getters.getDisadvantages
        let
            a = oAdvantages[sRollType].abilities[sAbility],
            d = oDisadvantages[sRollType].abilities[sAbility]
        if (extra !== '' && sRollType === CONSTS.ROLL_TYPE_SAVE) {
            a = a || oAdvantages[sRollType].threats[extra]
            d = d || oDisadvantages[sRollType].threats[extra]
        }
        if (extra !== '' && sRollType === CONSTS.ROLL_TYPE_SKILL) {
            a = a || oAdvantages[sRollType].skills[extra]
            d = d || oDisadvantages[sRollType].skills[extra]
        }
        const r = this._dice.roll(20)
        if (a && !d) {
            const r2 = this._dice.roll(20)
            return Math.max(r, r2)
        }
        if (d && !a) {
            const r2 = this._dice.roll(20)
            return Math.min(r, r2)
        }
        return r
    }
}

module.exports = Creature
