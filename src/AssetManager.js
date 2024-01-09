const CONSTS = require('./consts')
const TreeSync = require('./libs/tree-sync')
const path = require('path')
const SchemaValidator = require("./SchemaValidator")
const StoreManager = require('./StoreManager')
const { deepMerge, deepClone } = require('@laboralphy/object-fusion')
const { CONFIG } = require('./config')
const STRINGS = {
    fr: require('./strings/fr.json'),
    en: require('./strings/en.json')
}

class AssetManager {
    constructor ({ config = CONFIG } = {}) {
        this._initialized = false
        this._config = config
        this._lang = 'fr'
        this._assets = {
            blueprints: {},
            data: {},
            scripts: {},
            strings: STRINGS
        }
        this._validator = new SchemaValidator()
        this._storeManagers = {
            creature: new StoreManager({
                state: require(path.resolve(__dirname, 'store', 'creature', 'state')),
                mutations: TreeSync.recursiveRequire(path.resolve(__dirname, 'store', 'creature', 'mutations'), true),
                getters: TreeSync.recursiveRequire(path.resolve(__dirname, 'store', 'creature', 'getters'), true),
                externals: {
                    blueprints: this.blueprints,
                    data: this.data
                }
            })
        }
    }

    get initialized () {
        return this._initialized
    }

    set lang (value) {
        this._lang = value
    }

    get lang () {
        return this._lang
    }

    get storeManagers () {
        return this._storeManagers
    }

    /**
     * @returns {SchemaValidator}
     */
    get validator () {
        return this._validator
    }

    /**
     * @param value {SchemaValidator}
     */
    set validator (value) {
        this._validator = value
    }

    loadPath (sPath, sType) {
        if (!TreeSync.exists(sPath)) {
            return
        }
        const d = TreeSync.recursiveRequire(sPath, true)
        switch (sType) {
            case 'blueprint': {
                this.addBlueprints(d)
                break
            }

            case 'data': {
                this.addDataSet(d)
                break
            }

            case 'getters/creature': {
                this.storeManagers.creature.defineGetters(d)
                break
            }

            case 'state/creature': {
                this.storeManagers.creature.patchState(d.index)
                break
            }

            case 'mutations/creature': {
                this.storeManagers.creature.defineMutations(d)
                break
            }

            case 'script': {
                Object.assign(this._assets.scripts, d)
                break
            }

            case 'strings': {
                deepMerge(this._assets.strings, d)
                break
            }

            default: {
                throw new Error('ERR_ASSET_TYPE_INVALID: ' + sType)
            }
        }
    }

    loadModule (sPath) {
        this.loadPath(path.join(sPath, 'blueprints'), 'blueprint')
        this.loadPath(path.join(sPath, 'data'), 'data')
        this.loadPath(path.join(sPath, 'store', 'creature', 'getters'), 'getters/creature')
        this.loadPath(path.join(sPath, 'store', 'creature', 'state'), 'state/creature')
        this.loadPath(path.join(sPath, 'store', 'creature', 'mutations'), 'mutations/creature')
        this.loadPath(path.join(sPath, 'scripts'), 'script')
        this.loadPath(path.join(sPath, 'strings'), 'strings')
    }

    init () {
        if (!this._initialized) {
            this._validator.init()
            const oBaseData = TreeSync.recursiveRequire(path.resolve(__dirname, 'data'), true)
            for (const [sId, data] of Object.entries(oBaseData)) {
                this.addData(sId, data)
            }
            this
                ._config
                .activeModules
                .forEach(m => {
                    this.loadModule(m)
                })
            this._initialized = true
        }
    }

    /**
     * @returns {{}}
     */
    get blueprints () {
        return this._assets.blueprints
    }

    /**
     * @returns {{}}
     */
    get data () {
        return this._assets.data
    }

    get scripts () {
        return this._assets.scripts
    }

    get strings () {
        return this._assets.strings[this.lang]
    }

    get publicAssets () {
        const filterData = f => {
            const o = {}
            Object
                .entries(this.data)
                .filter(([k]) => k.startsWith(f))
                .forEach(([k, v]) => {
                    o[k] = deepClone(v)
                })
            return o
        }
        const data = {
            weaponType: filterData('weapon-type-'),
            armorType: filterData('armor-type-'),
            shieldType: filterData('shield-type-'),
            ammoType: filterData('ammo-type-'),
            itemProperty: require('./templates/item-properties.json')
        }
        return {
            strings: deepClone(this.strings),
            data,
            templates: {
                ammo: require('./templates/ammo.json'),
                armor: require('./templates/armor.json'),
                shield: require('./templates/shield.json'),
                weapon: require('./templates/weapon.json'),
            }
        }
    }

    validateBlueprint (oBlueprint) {
        switch (oBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                this.validator.validate(oBlueprint, 'blueprint-item')
                break
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                this.validator.validate(oBlueprint, 'blueprint-actor')
                break
            }

            default: {
                throw new Error('ERR_INVALID_BLUEPRINT: entityType missing')
            }
        }
    }

    validateImportData (data) {
        this.validator.validate(data, 'actor-state')
    }

    /**
     * Ajoute un blueprint d'item
     * @param sId {string}
     * @param oBlueprint {object}
     */
    addItemBlueprint (sId, oBlueprint) {
        try {
            this.validator.validate(oBlueprint, 'blueprint-item')
            this._assets.blueprints[sId] = {
                ...oBlueprint,
                ref: sId
            }
        } catch (e) {
            console.error(e)
            if (e.message.startsWith('ERR_SCHEMA_VALIDATION')) {
                throw new Error('ERR_INVALID_ITEM_BLUEPRINT: ' + sId + '\n' + e.message)
            }
            throw e
        }
    }

    addActorBlueprint (sId, oBlueprint) {
        try {
            this.validator.validate(oBlueprint, 'blueprint-actor')
            this._assets.blueprints[sId] = {
                ...oBlueprint,
                ref: sId
            }
        } catch (e) {
            console.error(e)
            if (e.message.startsWith('ERR_SCHEMA_VALIDATION')) {
                throw new Error('ERR_INVALID_ITEM_ACTOR: ' + sId + '\n' + e.message)
            }
            throw e
        }
    }

    /**
     * Ajoute un blueprint
     * @param sId {string}
     * @param oBlueprint {object}
     */
    addBlueprint (sId, oBlueprint) {
        switch (oBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                return this.addItemBlueprint(sId, oBlueprint)
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                return this.addActorBlueprint(sId, oBlueprint)
            }

            default: {
                throw new Error('ERR_ENTITY_TYPE_UNSUPPORTED: ' + oBlueprint.entityType)
            }
        }
    }

    /**
     * Ajoute une série de blueprint
     * @param oBlueprints {object}
     */
    addBlueprints (oBlueprints) {
        for (const [sId, oBlueprint] of Object.entries(oBlueprints)) {
            this.addBlueprint(sId, oBlueprint)
        }
    }

    /**
     * Ajoute un item de data
     * @param sId
     * @param oData
     * @param sDataType
     */
    addData (sId, oData, sDataType = '') {
        try {
            if (sDataType !== '') {
                this._validator.validate(oData, sDataType)
            }
            this._assets.data[sId] = oData
        } catch (e) {
            if (e.message.startsWith('ERR_SCHEMA_VALIDATION')) {
                throw new Error('ERR_INVALID_DATA: ' + sId + ' - must be validated by: ' + sDataType + '\n' + e.message)
            }
            throw e
        }
    }

    addDataSet (oData) {
        const DATA_TYPES = [
            'class',
            'weapon-type',
            'armor-type',
            'shield-type',
            'ammo-type',
            'skill',
            'feat',
            'template',
            'data'
        ]
        const getDataType = (sId) => {
            return DATA_TYPES.find(dt => sId.startsWith(dt + '-'))
        }
        for (const [sId, data] of Object.entries(oData)) {
            const dt = getDataType(sId)
            if (dt) {
                if (dt === 'data') {
                    this.addData(sId, data)
                } else {
                    this.addData(sId, data, 'data-' + dt)
                }
            } else {
                const sSupportedTypes = DATA_TYPES.join(', ')
                throw new Error('ERR_INVALID_DATA_TYPE: ' + sId + ' - supported item data types are : [' + sSupportedTypes + ']. but the specified data document is named : ' + sId + ' (does not start with any of the data types).')
            }
        }
    }

    createStore (sType) {
        return this.storeManagers[sType].createStore()
    }
}

module.exports = AssetManager
