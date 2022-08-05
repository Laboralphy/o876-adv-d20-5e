const validate = require('jsonschema').validate;
const CONSTS = require('./consts')
const SCHEMAS = {
    ITEMS: require('./schemas/items.json')
}
const TreeSync = require('../libs/tree-sync')
const path = require('path')

class AssetManager {
    constructor () {
        this._assets = {
            blueprints: {},
            data: {}
        }
    }

    load () {
        const oBlueprints = TreeSync.recursiveRequire(path.resolve(__dirname, './blueprints'), true)
        const oData = TreeSync.recursiveRequire(path.resolve(__dirname, './data'), true)
        this.addBlueprints(oBlueprints)
    }

    get blueprints () {
        return this._assets.blueprints
    }

    addItemBlueprint (sId, oBlueprint) {
        const result = validate(oBlueprint, SCHEMAS.ITEMS)
        if (result.valid) {
            this._assets.blueprints[sId] = oBlueprint
            return true
        } else {
            console.error(result.errors)
            throw new Error('ERR_INVALID_BLUEPRINT: ' + sId)
        }
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
}

module.exports = AssetManager
