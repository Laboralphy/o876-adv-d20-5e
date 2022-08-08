const SchemaValidator = require('../src/SchemasValidator')

describe('basic instanciation', function () {
    it('should be defined', function () {
        expect(() => {
            const sv = new SchemaValidator()
        }).not.toThrow()
    })

    it('should initialize', function () {
        expect(() => {
            const sv = new SchemaValidator()
            sv.init()
        }).not.toThrow()
    })

    it('should initialize', function () {
        expect(() => {
            const sv = new SchemaValidator()
            sv.init()
        }).not.toThrow()
    })
})

describe ('validate', function () {
    it('should validate a dagguer', function () {
        const bp = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "weaponType": "weapon-type-dagger",
            "properties": []
        }
        const sv = new SchemaValidator()
        sv.validate(bp, 'blueprint-item')
    })
})