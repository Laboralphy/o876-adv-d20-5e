const jsonschema = require('jsonschema')
const Validator = jsonschema.Validator
const TreeSync = require('../libs/tree-sync')
const path = require('path')

class SchemaValidator {
    constructor () {
        this._schemas = {}
        this._validator = null
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
        if (!(sSchemaId in this._schemas)) {
            throw new Error('ERR_UNKNOWN_SCHEMA: ' + sSchemaId)
        }
        const r = this._validator.validate(oObject, this._schemas[sSchemaId])
        if (!r.valid) {
            const sErrors = r
                .errors
                .map(e => e.stack)
                .join('\n')
            throw new Error('ERR_SCHEMA_VALIDATION: ' + sSchemaId + '\n' + sErrors)
        }
        return true
    }
}

module.exports = SchemaValidator
