const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')

describe('basic instanciation', function () {
    it('should be defined', function () {
        expect(() => {
            const c = new Creature()
        }).not.toThrow()
    })
})

describe('Creature setting attribute and reading attribute', function () {
    it('should get 10 strength', function () {
        const c = new Creature()
        c.store.mutations.setAttributeStrength({ value: 10 })
        expect(c.store.getters.getAttributeStrength).toBe(10)
    })
})

describe('Creature reading attribute with effect attribute modifier', function () {
    it('should get 15 strength', function () {
        const c = new Creature()
        c.store.mutations.setAttributeStrength({ value: 10 })
        // ajouter un attribute modifier
        c.applyEffect('attribute-modifier', { attribute: CONSTS.ATTRIBUTE_STRENGTH, value: 5, duration: 10 })
        expect(c.store.getters.getAttributeStrength).toBe(15)
    })

    it('should get 18 strength beacause of two attribute-modifiers', function () {
        const c = new Creature()
        c.store.mutations.setAttributeStrength({ value: 10 })
        // ajouter un attribute modifier
        c.applyEffect('attribute-modifier', { attribute: CONSTS.ATTRIBUTE_STRENGTH, value: 5, duration: 10 })
        expect(c.store.getters.getAttributeStrength).toBe(15)
        c.applyEffect('attribute-modifier', { attribute: CONSTS.ATTRIBUTE_STRENGTH, value: 3, duration: 10 })
        expect(c.store.getters.getAttributeStrength).toBe(18)
    })

})

// Test : appliquer un effet à impact
// appliquer un effet à durée temporaire
// creature A applique un effet à créature B

