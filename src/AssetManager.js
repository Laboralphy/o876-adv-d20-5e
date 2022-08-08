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

    get validator () {
        return this._validator
    }

    set validator (value) {
        this._validator = value
    }

    load () {
        const oBlueprints = TreeSync.recursiveRequire(path.resolve(__dirname, './blueprints'), true)
        const oData = TreeSync.recursiveRequire(path.resolve(__dirname, './data'), true)
        this.addBlueprints(oBlueprints)
        this.addDataSet(oData)
    }

    get blueprints () {
        return this._assets.blueprints
    }

    get data () {
        return this._assets.data
    }

    addItemBlueprint (sId, oBlueprint) {
        this.validator.validate(oBlueprint, '/blueprint-item')
        this._assets.blueprints[sId] = oBlueprint
    }

    addBlueprint (sId, oBlueprint) {
        switch (oBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                return this.addItemBlueprint(sId, oBlueprint)
            }
        }
    }

    addBlueprints (oBlueprints) {
        for (const [sId, oBlueprint] of Object.entries(oBlueprints)) {
            this.addBlueprint(sId, oBlueprint)
        }
    }

    addDataItem (sId, oData, sDataType) {
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
                this.addDataItem(sId, data, 'data-' + dt)
            }
        }
    }
}

module.exports = AssetManager
