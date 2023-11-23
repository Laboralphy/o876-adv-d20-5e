const Store = require('@laboralphy/store')
const { deepClone, deepMerge} = require('@laboralphy/object-fusion')

class StoreManager {
    constructor ({
        state = {},
        getters = {},
        mutations = {},
        externals = {}
    }) {
        this._state = state
        this._moduleStates = []
        this._getters = getters
        this._mutations = mutations
        this._storeCreated = 0
        this._warned = false
        this._externals = externals
    }

    get externals () {
        return this._externals
    }

    set externals (ex) {
        this._externals = ex
    }

    tryWarn () {
        if (!this._warned && this._storeCreated > 0) {
            console.warn('A store has already been created. Adding more items in store definition will lead to different store versions.')
            this._warned = true
        }
    }
    patchState (oState) {
        this._moduleStates.push(oState)
        this.tryWarn()
    }

    defineGetter (sGetter, pGetter) {
        if (sGetter in this._getters) {
            throw new Error('ERR_GETTER_ALREADY_DEFINED: ' + sGetter)
        } else {
            this._getters[sGetter] = pGetter
            this.tryWarn()
        }
    }

    defineMutation (sMutation, pMutation) {
        if (sMutation in this._mutations) {
            throw new Error('ERR_MUTATION_ALREADY_DEFINED')
        } else {
            this._mutations[sMutation] = pMutation
            this.tryWarn()
        }
    }

    defineGetters (oGetters) {
        for (const [sGetter, pGetter] of Object.entries(oGetters)) {
            this.defineGetter(sGetter, pGetter)
        }
    }

    defineMutations (oMutations) {
        for (const [sMutation, pMutation] of Object.entries(oMutations)) {
            this.defineMutation(sMutation, pMutation)
        }
    }

    createStore () {
        ++this._storeCreated
        const state = typeof this._state === 'function' ? this._state() : this._state
        this._moduleStates.forEach(s => {
            deepMerge(state, s)
        })
        const storeDef = {
            state,
            mutations: this._mutations,
            getters: this._getters,
            externals: this._externals
        }
        return new Store(storeDef)
    }
}

module.exports = StoreManager
