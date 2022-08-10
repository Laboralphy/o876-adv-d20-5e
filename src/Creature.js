const Store = require('@laboralphy/store')
const path = require('path')

// Store
const STORE_PATH = path.resolve(__dirname, './store/creature')
const CreatureStore = require('./store/creature')
const { assetManager } = require('./assets')

let LAST_ID = 0

class Creature {
    constructor () {
        this._id = ++LAST_ID
        this._state = CreatureStore.buildState()
        this._dice = null
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
     * @param [ability] {string}
     * @param [skill] {string}
     * @param [threat] {string}
     * @returns {boolean}
     * @private
     */
    _isAdvOrDisadv (d, { ability = '', skill = '', threat = '' }) {
        let b = false
        if (ability !== '') {
            b = d.abilities[ability]
        }
        if (skill !== '') {
            b = b || d.skills[skill]
        }
        if (threat) {
            b = b || d.threats[threat]
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
        return this._isAdvOrDisadv(this.store.getters.getDisadvantages[sRollType], ast)
    }

    /**
     * Renvoie true si la creature est avantagée pour ce type de jet de dé et pour la caractéristique spécifiée
     * @param sRollType {string} ROLL_TYPE_*
     * @param ast {{ability: string, skill: string, threat: string}}
     * @returns {boolean}
     */
    isAdvantaged (sRollType, ast) {
        return this._isAdvOrDisadv(this.store.getters.getDisadvantages[sRollType], ast)
    }

    /**
     * Aggrège les effets spécifié dans la liste, selon un prédicat
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
            .getDefensiveEquipmentItemProperties
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
        const nItemACProps = this.aggregateModifiers(['ac-bonus']).sum
        return nBaseAC + nItemACProps
    }

    getAttackBonus () {
        return this.store.getters.getSelectedWeaponAttackBonus
    }
}

module.exports = Creature
