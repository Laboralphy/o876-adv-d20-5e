const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')

describe('basic instanciation', function () {
    it('should be defined', function () {
        expect(() => {
            const c = new Creature()
        }).not.toThrow()
    })
})

describe('Creature setting ability and reading ability', function () {
    it('should get 10 strength', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ attribute: CONSTS.ABILITY_STRENGTH, value: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })
})

describe('Creature reading ability with effect ability modifier', function () {
    it('should get 15 strength', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ attribute: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.applyEffect('ability-bonus', { ability: CONSTS.ABILITY_STRENGTH, value: 5, duration: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
    })

    it('should get 18 strength beacause of two ability-bonuss', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ attribute: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.applyEffect('ability-bonus', { ability: CONSTS.ABILITY_STRENGTH, value: 5, duration: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
        c.applyEffect('ability-bonus', { ability: CONSTS.ABILITY_STRENGTH, value: 3, duration: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(18)
    })

    it('should have an ability modifier of 3', function () {
        const c1 = new Creature()
        c1.store.mutations.setAbility({ attribute: CONSTS.ABILITY_INTELLIGENCE, value: 16 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(3)
        c1.store.mutations.setAbility({ attribute: CONSTS.ABILITY_INTELLIGENCE, value: 9 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(-1)
        c1.store.mutations.setAbility({ attribute: CONSTS.ABILITY_INTELLIGENCE, value: 0 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(-5)
        c1.store.mutations.setAbility({ attribute: CONSTS.ABILITY_INTELLIGENCE, value: 1 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(-5)
    })
})

describe('Creature gaining level', function () {
    it('creature as 1 level of tourist', function () {
        const c = new Creature()
        c.store.mutations.addClass({ name: CONSTS.CLASS_TOURIST })
        expect(c.store.getters.getLevel).toBe(1)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_TOURIST]).toBe(1)
    })
    it('creature as 3 level of tourist', function () {
        const c = new Creature()
        c.store.mutations.addClass({ name: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ name: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ name: CONSTS.CLASS_TOURIST })
        expect(c.store.getters.getLevel).toBe(3)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_TOURIST]).toBe(3)
    })
})

// Test : appliquer un effet à impact
// appliquer un effet à durée temporaire
// creature A applique un effet à créature B

