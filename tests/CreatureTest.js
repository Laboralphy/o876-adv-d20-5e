const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')
const { warmup, assetManager } = require('../src/assets')

beforeEach(function () {
    warmup()
})

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
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })
})

describe('Creature reading ability with effect ability modifier', function () {
    it('should get 15 strength', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.store.mutations.addEffect({ effect: { tag: 'ability-bonus', duration: 10, amp: 5, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
    })

    it('should get 18 strength beacause of two ability-bonus', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.store.mutations.addEffect({ effect: { tag: 'ability-bonus', duration: 10, amp: 5, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
        c.store.mutations.addEffect({ effect: { tag: 'ability-bonus', duration: 10, amp: 3, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(18)
    })

    it('should have an ability modifier of 3', function () {
        const c1 = new Creature()
        c1.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 16 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(3)
        c1.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 9 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(-1)
        c1.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 0 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(-5)
        c1.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 1 })
        expect(c1.store.getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]).toBe(-5)
    })
})

describe('Creature gaining level', function () {
    it('creature as 1 level of tourist', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        expect(c.store.getters.getLevel).toBe(1)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_TOURIST]).toBe(1)
    })
    it('creature as 3 level of tourist', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        expect(c.store.getters.getLevel).toBe(3)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_TOURIST]).toBe(3)
    })
})

describe('Creature max hit points', function () {
    it('should have 12 hp on first level of barbarian', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: CONSTS.CLASS_BARBARIAN })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        expect(c.store.getters.getMaxHitPoints).toBe(12)
    })
    it('should have 19 hp on second level of barbarian', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: CONSTS.CLASS_BARBARIAN, levels: 2 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_CONSTITUTION]).toBe(10)
        expect(c.store.getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION]).toBe(0)
        expect(c.store.getters.getMaxHitPoints).toBe(19)
    })
})

describe('getAC', function () {
    it('should have AC 12 with armor', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 12 })
        const oArmorLeather = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_ARMOR",
            "armorType": "ARMOR_TYPE_LEATHER",
            "properties": [],
            "proficiency": "PROFICIENCY_ARMOR_LIGHT",
            "ac": 11,
            "maxDexterityModifier": false,
            "minStrengthRequired": 0,
            "disadvantageStealth": false,
            "weight": 10,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        }
        c.equipItem(oArmorLeather)
        expect(c.getAC()).toBe(12)
    })
    it('should have AC 14 with magical armor', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 12 })
        const oArmorLeather = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_ARMOR",
            "armorType": "ARMOR_TYPE_LEATHER",
            "properties": [{
                "property": CONSTS.ITEM_PROPERTY_AC_BONUS,
                "amp": 2
            }],
            "proficiency": "PROFICIENCY_ARMOR_LIGHT",
            "ac": 11,
            "maxDexterityModifier": false,
            "minStrengthRequired": 0,
            "disadvantageStealth": false,
            "weight": 10,
            "equipmentSlots": [CONSTS.EQUIPMENT_SLOT_CHEST]
        }
        c.equipItem(oArmorLeather)
        expect(c.getAC()).toBe(14)
    })
})

// Test : appliquer un effet à impact
// appliquer un effet à durée temporaire
// creature A applique un effet à créature B

