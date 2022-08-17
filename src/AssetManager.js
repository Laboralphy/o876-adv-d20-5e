const CONSTS = require('./consts')
const TreeSync = require('../libs/tree-sync')
const path = require('path')
const SchemaValidator = require("./SchemaValidator");

class AssetManager {
    constructor () {
        this._assets = {
            blueprints: {},
            data: {}
        }
        this._validator = new SchemaValidator()
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

            default: {
                throw new Error('ERR_ASSET_TYPE_INVALID: ' + sType)
            }
        }
    }

    loadModule (sPath) {
        this.loadPath(path.join(sPath, 'blueprints'), 'blueprint')
        this.loadPath(path.join(sPath, 'data'), 'data')
    }

    init () {
        this._validator.init()
        const oBaseData = TreeSync.recursiveRequire(path.resolve(__dirname, 'data'), true)
        for (const [sId, data] of Object.entries(oBaseData)) {
            this.addData(sId, data)
        }
        this.loadModule(path.resolve(__dirname, 'modules', 'base'))
        this.loadModule(path.resolve(__dirname, 'modules', 'classic'))
        this.loadModule(path.resolve(__dirname, 'modules', 'modern'))
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

    /**
     * Ajoute un blueprint d'item
     * @param sId {string}
     * @param oBlueprint {object}
     */
    addItemBlueprint (sId, oBlueprint) {
        try {
            this.validator.validate(oBlueprint, 'blueprint-item')
            this._assets.blueprints[sId] = oBlueprint
        } catch (e) {
            console.error(e)
            if (e.message.startsWith('ERR_SCHEMA_VALIDATION')) {
                throw new Error('ERR_INVALID_ITEM_BLUEPRINT: ' + sId + '\n' + e.message)
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
            'armor-type'
        ]
        const getDataType = (sId) => {
            return DATA_TYPES.find(dt => sId.startsWith(dt + '-'))
        }
        for (const [sId, data] of Object.entries(oData)) {
            const dt = getDataType(sId)
            if (dt) {
                this.addData(sId, data, 'data-' + dt)
            } else {
                const sSupportedTypes = DATA_TYPES.join(', ')
                throw new Error('ERR_INVALID_DATA_TYPE: ' + sId + ' - supported item data types are : [' + sSupportedTypes + ']. but the specified data document is named : ' + sId + ' (does not start with any of the data types).')
            }
        }
    }
}

module.exports = AssetManager
