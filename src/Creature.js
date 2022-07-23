const Store = require('@laboralphy/store')
const path = require('path')
const TreeSync = require('../libs/tree-sync')
const CONFIG = require('./config')
const CONSTS = require('./consts')
const DATA = require('./data')
const EffectProcessor = require('./EffectProcessor')

console.log(DATA)

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
            getters: GETTERS,
            mutations: MUTATIONS
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
}

module.exports = Creature
