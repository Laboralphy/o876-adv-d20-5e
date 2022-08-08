const jsonschema = require('jsonschema')
const Validator = jsonschema.Validator
const TreeSync = require('../libs/tree-sync')
const path = require('path')

class SchemasValidator {
    constructor () {
        this._schemas = {}
        this._validator = null
        this.init()
    }

    get validator () {
        return this._validator
    }

    get schemas () {
        return this._schemas
    }

    init () {
        const v = new Validator()
        const s = TreeSync.recursiveRequire(path.resolve(__dirname, './schemas'), true)
        this._validator = v
        /**
         * @type {object}
         * @private
         */
        this._schemas = s
        for (const [sId, oData] of Object.entries(s)) {
            const sSchemaId = sId
            oData.id = sSchemaId
            v.addSchema(oData, '/' + sSchemaId)
        }
    }

    validate (oObject, sSchemaId) {
        const r = this._validator.validate(oObject, this._schemas[sSchemaId])
        if (!r.valid) {
            console.log(r)
            console.error(r.errors)
            throw new Error('ERR_SCHEMAS_VALIDATION')
        }
        return true
    }
}

module.exports = SchemasValidator
