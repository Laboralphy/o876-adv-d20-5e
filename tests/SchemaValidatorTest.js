const SchemaValidator = require('../src/SchemaValidator')

describe('basic instanciation', function () {
    it('should be defined', function () {
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
            "properties": [],
            "attributes": []
        }
        const sv = new SchemaValidator()
        sv.init()
        expect(() => sv.validate(bp, 'blueprint-item')).not.toThrow()
    })
    it('should not validate a dagger with invalid weapon attribute', function () {
        const bp = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "weaponType": "weapon-type-dagger",
            "properties": [],
            "attributes": [
                "WEAPON_ATTRIBUTE_ATTR1",
                "WEAPON_ATTRIBUTE_ATTR2",
                "ARMOR_ATTRIBUTE_ATTR1",
            ]
        }
        const sv = new SchemaValidator()
        expect(() => sv.validate(bp, 'blueprint-item', true)).toThrow()
    })
})
