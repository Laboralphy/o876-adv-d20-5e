const Store = require('@laboralphy/store')
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
        this._target = {
            handler: null,
            creature: null
        }
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
                this.store.mutations.updateTargetConditions({ conditions: this._target.creature.store.getters.getConditions })
                break
            }
        }
    }

    setTarget (oCreature) {
        if (this._target.creature !== oCreature) {
            this.clearTarget()
            this._target.creature = oCreature
            this._target.handler = ({ name, payload }) => this.updateTarget(name, payload)
            this.store.mutations.updateTargetConditions({ conditions: this._target.creature.store.getters.getConditions })
            oCreature.store.events.on('mutation', this._target.handler)
        }
    }

    getTarget () {
        return this._target.creature
    }

    getDisadvantages (oAgainst) {
        /**
         * Lorsque qu'on veut déterminer les désavantage d'une action de THIS par rapport à oAgainst
         * et si oAgainst === THIS.getTarget(), alors c'est simple : on utilise le getters getDisadvantage
         * Car celui ci va se servir des conditions de la cible.
         * On peut donc calculer les désavantage des jets d'attaque, des jets de sauvegarde et des jets de compétence
         * directement.
         *
         * Si on veut déterminer les désavantages d'une action de THIS par rapport à oAgainst qui ne serai pas
         * la cible actuelle (oAgainst !== THIS.getTarget()),
         * par exemple A cible B et B cible C
         * quels sont les désavantages de B par rapport à A ?
         * B n'attaque pas A car elle cible C donc par besoin de se soucier des désavantages de jet d'attaque
         * B pourrait devoir se défendre d'un sort lancé par A ou par C
         * B pourrait devoir utiliser une compétence d'attaque contre C
         * B pourrait devoir utiliser une compétence de défense (concentration, acrobatie) contre A ou C
         *
         * Si oAgainst === THIS.getTarget()
         * Alors cela veut dire que le calcule des désavantages se fait par rapport à la cible actuelle
         * Donc on peut utiliser getDisadvantages
         *
         * Si oAgainst !== THIS.getTarget()
         * Alors cela veut dire que les désavantages doivent être calculés par oAgainst qui aurait pris THIS pour cible
         *
         */
        const oTarget = this.getTarget()
        if (oAgainst === null || oAgainst === oTarget) {
            return this._store.getters.getDisadvantages
        } else {
            // Il faut que oAgainst ait pour target THIS
            const oAgainstTarget = oAgainst.getTarget()
            if (oAgainstTarget === this) {

            } else {
                // Ben... c'est bizarre ?
            }
        }
    }

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
        if (sExtra !== '')
            switch (sRollType) {
                case CONSTS.ROLL_TYPE_SAVE: {
                    advantage = advantage || ar.threats[sExtra].value
                    disadvantage = disadvantage || dr.threats[sExtra].value
                    al.assign(ar.threats[sExtra].rules)
                    dl.assign(dr.threats[sExtra].rules)
                    break
                }
                case CONSTS.ROLL_TYPE_SKILL: {
                    advantage = advantage || ar.skills[sExtra].value
                    disadvantage = disadvantage || dr.skills[sExtra].value
                    al.assign(ar.skills[sExtra].rules)
                    dl.assign(dr.skills[sExtra].rules)
                    break
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
}

module.exports = Creature
