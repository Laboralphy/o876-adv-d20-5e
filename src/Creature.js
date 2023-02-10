const CONSTS = require('./consts')
const EffectProcessor = require('./EffectProcessor')
const Dice = require('../libs/dice')

// Store
const CreatureStore = require('./store/creature')
const { assetManager } = require('./assets')

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
     * Evalue le tir de dé
     * @param d {number|string}
     * @returns {number}
     */
    roll (d) {
        return this._dice.evaluate(d)
    }

    /**
     * Aggrège les effets spécifiés dans la liste, selon un prédicat
     * @param aTags {string[]} liste des effets désiré
     * @param effectFilter {function} prédicat de selection d'effets
     * @param propFilter {function}
     * @param effectDisc {function} prédicat de discrimination des effets filtrés
     * @param propDisc {function}
     * @returns {{effects: D20Effect[], properties: object[], sorter: object, min: number, max: number, sum: number}}
     */
    aggregateModifiers (aTags, {
        effectFilter = null,
        propFilter = null,
        effectDisc = null,
        propDisc = null
    } = {}) {
        const aTypeSet = new Set(
            Array.isArray(aTags)
                ? aTags
                : [aTags]
        )
        const aFilteredEffects = this
            .store
            .getters
            .getEffects
            .filter(eff =>
                aTypeSet.has(eff.type) &&
                (effectFilter ? effectFilter(eff) : true)
            )
        aFilteredEffects.forEach(eff => {
            eff.amp = this.roll(eff.amp)
        })
        const aFilteredExtraProperties = this
            .store
            .getters
            .getEquipmentExtraProperties
            .filter(ip =>
                aTypeSet.has(ip.property) &&
                (propFilter ? propFilter(ip) : true)
            )
        aFilteredExtraProperties.forEach(ip => {
            ip.amp = this.roll(ip.amp)
        })
        const oSorter = {}
        const rdisc = sDisc => {
            if (!(sDisc in oSorter)) {
                oSorter[sDisc] = {
                    properties: [],
                    effects: [],
                    sum: 0,
                    min: 0,
                    max: 0
                }
            }
            return oSorter[sDisc]
        }
        if (effectDisc) {
            aFilteredEffects.forEach(f => {
                const sDisc = effectDisc(f)
                const sd = rdisc(sDisc)
                const amp = f.amp
                sd.effects.push(f)
                sd.min = Math.min(sd.min, amp)
                sd.max = Math.max(sd.max, amp)
                sd.sum += amp
            })
        }
        if (propDisc) {
            aFilteredExtraProperties.forEach(f => {
                const sDisc = propDisc(f)
                const sd = rdisc(sDisc)
                const amp = f.amp
                sd.properties.push(f)
                sd.min = Math.min(sd.min, amp)
                sd.max = Math.max(sd.max, amp)
                sd.sum += amp
            })
        }

        const nEffAcc = aFilteredEffects.reduce((prev, curr) => prev + curr.amp, 0)
        const nEffMax = aFilteredEffects.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
        const nEffMin = aFilteredEffects.reduce((prev, curr) => Math.min(prev, curr.amp), nEffMax)
        const nIPAcc = aFilteredExtraProperties.reduce((prev, curr) => prev + curr.amp, 0)
        const nIPMax = aFilteredExtraProperties.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
        const nIPMin = aFilteredExtraProperties.reduce((prev, curr) => Math.min(prev, curr.amp), nEffMax)
        return {
            effects: aFilteredEffects,
            properties: aFilteredExtraProperties,
            sum: nEffAcc + nIPAcc,
            min: Math.min(nEffMin, nIPMin),
            max: Math.max(nEffMax, nIPMax),
            sorter: oSorter
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
            CONSTS.EXTRA_PROPERTY_AC_BONUS
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
        const bRanged = getters.getSelectedWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
        return nAbilityBonus + nProfBonus + this.aggregateModifiers([
            CONSTS.EFFECT_ATTACK_BONUS,
            bRanged ? CONSTS.EFFECT_RANGED_ATTACK_BONUS : CONSTS.EFFECT_MELEE_ATTACK_BONUS,
            CONSTS.EXTRA_PROPERTY_ENHANCEMENT,
            CONSTS.EXTRA_PROPERTY_ATTACK_BONUS
        ]).sum
    }

    /**
     * Calcule le bonus de dégât de l'arme actuellement
     * @return {object}
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
        const oWeapon = getters.getSelectedWeapon
        const nAbilityBonus = getters.getAbilityModifiers[sOffensiveAbility]
        const sWeaponDamType = oWeapon.damageType
        const am = this.aggregateModifiers([
            CONSTS.EFFECT_DAMAGE_BONUS,
            CONSTS.EXTRA_PROPERTY_DAMAGE_BONUS,
            CONSTS.EXTRA_PROPERTY_ENHANCEMENT
        ], {
            effectDisc: effect => effect.data.type || sWeaponDamType,
            propDisc: property => property.type || sWeaponDamType
        })
        const oResult = {
            [sWeaponDamType]: nAbilityBonus
        }
        for (const [sDamageType, oDamageStruct] of Object.entries(am.sorter)) {
            if (sDamageType in oResult) {
                oResult[sDamageType] += oDamageStruct.sum
            } else {
                oResult[sDamageType] = oDamageStruct.sum
            }
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
