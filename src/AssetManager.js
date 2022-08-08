const CONSTS = require('./consts')
const TreeSync = require('../libs/tree-sync')
const path = require('path')

class AssetManager {
    constructor () {
        this._assets = {
            blueprints: {},
            data: {}
        }
        this._validator = null
    }

    /**
     * @returns {SchemasValidator}
     */
    get validator () {
        return this._validator
    }

    /**
     * @param value {SchemasValidator}
     */
    set validator (value) {
        this._validator = value
    }

    load () {
        const oBlueprints = TreeSync.recursiveRequire(path.resolve(__dirname, './blueprints'), true)
        const oData = TreeSync.recursiveRequire(path.resolve(__dirname, './data'), true)
        this.addBlueprints(oBlueprints)
        this.addDataSet(oData)
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
        this.validator.validate(oBlueprint, '/blueprint-item')
        this._assets.blueprints[sId] = oBlueprint
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
    addData (sId, oData, sDataType) {
        this._validator.validate(oData, sDataType)
        this._assets.data[sId] = oData
    }

    addDataSet (oData) {
        const DATA_TYPES = [
            'class',
            'weapon-type'
        ]
        const getDataType = (sId) => {
            return DATA_TYPES.find(dt => sId.startsWith(dt + '-'))
        }
        for (const [sId, data] of Object.entries(oData)) {
            const dt = getDataType(sId)
            if (dt) {
                this.addData(sId, data, 'data-' + dt)
            }
        }
    }
}

module.exports = AssetManager
