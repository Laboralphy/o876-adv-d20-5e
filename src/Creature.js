const Store = require('@laboralphy/store')
const path = require('path')
const TreeSync = require('../libs/tree-sync')
const CONFIG = require('./config')
const CONSTS = require('./consts')
const EffectProcessor = require('./EffectProcessor')

// Store
const STORE_PATH = path.resolve(__dirname, './store/creature')
const buildState = require(path.join(STORE_PATH, 'state'))
const MUTATIONS = TreeSync.recursiveRequire(path.join(STORE_PATH, 'mutations'))
const GETTERS = TreeSync.recursiveRequire(path.join(STORE_PATH, 'getters'))

class Creature {
    constructor () {
        this._id = 0
        this._state = buildState()
        this._store = new Store({
            state: this._state,
            getters: this._configureGetters(),
            mutations: this._configureMutations()
        })
        this._effectProcessor = new EffectProcessor()
    }

    get id () {
        return this._id
    }

    get store () {
        return this._store
    }

    applyEffect (sEffect, payload = {}) {
        const oEffect = this._effectProcessor.createEffect(sEffect, payload)
        const {
            duration = 0,
            source = null
        } = payload
        oEffect.source = source ? source.id : this.id
        oEffect.duration = duration || 0
        this._effectProcessor.runEffect(oEffect, this, source || this)
        if (duration > 0) {
            this.store.mutations.addEffect({ effect: oEffect })
        }
    }

    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */
    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */
    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */

    /**
     * Keep a value ina range
     * @param value {number}
     * @param min {number}
     * @param max {number}
     * @returns {number}
     * @private
     */
    _clamp (value, min, max) {
        return Math.max(min, Math.min(max, value))
    }

    /**
     * Compose attribute mutation name
     * @param sAttr {string}
     * @returns {string} mutation name
     * @private
     */
    _getAttributeMutationName (sAttr) {
        return 'setAttribute' + sAttr.charAt(0).toUpperCase() + sAttr.slice(1).toLowerCase()
    }

    /**
     * Compose a given attribute getter name
     * @param sAttr {string} attribute
     * @returns {string} getter name
     * @private
     */
    _getAttributeGetterName (sAttr) {
        return 'getAttribute' + sAttr.charAt(0).toUpperCase() + sAttr.slice(1).toLowerCase()
    }

    /**
     * Compose bonus getter name for a given attribute
     * @param sAttr {string} attribute
     * @returns {string} getter name
     * @private
     */
    _getBonusGetterName (sAttr) {
        return 'getAttributeBonus' + sAttr.charAt(0).toUpperCase() + sAttr.slice(1).toLowerCase()
    }

    /**
     * Compose bonus getter modifier name for a given attribute
     * @param sAttr {string} attribute
     * @returns {string} getter name
     * @private
     */
    _getAttributeModifierGetterName (sAttr) {
        return 'getAttributeModifier' + sAttr.charAt(0).toUpperCase() + sAttr.slice(1).toLowerCase()
    }

    /**
     * Configure getters for a main attribute
     * @param oGetters
     * @param sAttribute {string}
     * @private
     */
    _configureAttributeGetter (oGetters, sAttribute) {
        oGetters[this._getAttributeGetterName(sAttribute)] = (state, getters) => {
            return Math.max(0,
                state.attributes[sAttribute] +
                getters[this._getBonusGetterName(sAttribute)]
            )
        }
    }

    /**
     * Configure getters for attribute bonus
     * @param oGetters
     * @param sAttribute {string}
     * @private
     */
    _configureAttributeBonusGetter (oGetters, sAttribute) {
        oGetters[this._getBonusGetterName(sAttribute)] = state =>
            Math.max(0, state
                .effects
                .filter(eff => eff.tag === CONFIG.ATTRIBUTE_MODIFIER_EFFECT && eff.data.attribute === sAttribute)
                .reduce((value, eff) => value + eff.amp, 0)
            )
    }


    _configureAttributeModifierGetter (oGetters, sAttribute) {
        oGetters[this._getAttributeModifierGetterName(sAttribute)] = (state, getters) =>
            getters[this._getAttributeGetterName(sAttribute)]
    }

    /**
     * Configure getters for attributes (main and derivated)
     * @returns {{}}
     * @private
     */
    _configureGetters () {
        const oGetters = {
            ...GETTERS
        }
        for (const a in this._state.attributes) {
            this._configureAttributeBonusGetter(oGetters, a)
            this._configureAttributeGetter(oGetters, a)
        }
        return oGetters
    }

    /**
     * Configure mutations for Attribute
     * @returns {{}}
     * @private
     */
    _configureMutations () {
        const oMutations = {
            ...MUTATIONS
        }
        Object
            .keys(this._state.attributes)
            .forEach(a => {
                oMutations[this._getAttributeMutationName(a)] =
                    ({ state }, { value }) => {
                        if (isNaN(value)) {
                            throw new TypeError('Attribute value is non numeric')
                        } else {
                            state.attributes[a] = Math.max(0, Math.floor(value))
                        }
                    }
            })

        return oMutations
    }
}

module.exports = Creature
