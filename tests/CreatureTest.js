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
        c.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_ABILITY_BONUS, duration: 10, amp: 5, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
    })

    it('should get 18 strength beacause of two ability-bonus', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_ABILITY_BONUS, duration: 10, amp: 5, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
        c.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_ABILITY_BONUS, duration: 10, amp: 3, data: { ability: CONSTS.ABILITY_STRENGTH }}})
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
            "equipmentSlots": [CONSTS.EQUIPMENT_SLOT_CHEST]
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

describe('getAttackBonus', function () {
    it ('level 1 with no weapons', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        const oUnarmedStrike = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_NATURAL_WEAPON",
            "properties": [],
            "damage": "1",
            "damageType": "DAMAGE_TYPE_CRUSHING",
            "attributes": []
        }
        c.store.mutations.equipItem({ item: oUnarmedStrike, slot: CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON })
        expect(c.store.getters.getLevel).toBe(0)
        expect(c.store.getters.getProficiencyBonus).toBe(1)
        c.store.mutations.addClass({ class: CONSTS.CLASS_TOURIST, levels: 1 })
        expect(c.store.getters.getLevel).toBe(1)
        expect(c.store.getters.getProficiencyBonus).toBe(2)
        expect(c.store.getters.isProficientSelectedWeapon).toBeTrue()
        expect(c.getAttackBonus()).toBe(2)
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 12 })
        expect(c.getAttackBonus()).toBe(3)
        c.store.mutations.addClass({ class: CONSTS.CLASS_TOURIST, levels: 4 })
        expect(c.getAttackBonus()).toBe(4)
    })
    it ('switching from weapon melee to ranged', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        const oSword = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "weaponType": "WEAPON_TYPE_LONGSWORD",
            "properties": [],
            "damage": "1d8",
            "damageType": "DAMAGE_TYPE_SLASHING",
            "attributes": []
        }
        const oDagger = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "weaponType": "WEAPON_TYPE_DAGGER",
            "properties": [],
            "damage": "1d4",
            "damageType": "DAMAGE_TYPE_PIERCING",
            "attributes": ["WEAPON_ATTRIBUTE_FINESSE"]
        }
        const oBow = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "weaponType": "WEAPON_TYPE_SHORTBOW",
            "properties": [],
            "damage": "1d6",
            "damageType": "DAMAGE_TYPE_PIERCING",
            "attributes": ["WEAPON_ATTRIBUTE_RANGED"]
        }
        const oArrow = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_AMMO",
            "properties": [],
            "stack": 10
        }
        c.store.mutations.equipItem({ item: oSword, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        c.store.mutations.equipItem({ item: oBow, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        c.store.mutations.equipItem({ item: oArrow, slot: CONSTS.EQUIPMENT_SLOT_AMMO })
        expect(c.store.getters.getSelectedWeapon).toEqual(oSword)
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 14 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 18 })
        c.store.mutations.addClass({ class: CONSTS.CLASS_TOURIST, levels: 1 })
        expect(c.getAttackBonus()).toBe(2)
        c.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        expect(c.getAttackBonus()).toBe(4)
        c.store.mutations.equipItem({ item: oDagger, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        expect(c.getAttackBonus()).toBe(4)
    })
    it ('switching from magical weapon melee to ranged', function () {
        const c = new Creature()
        const oSword = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "weaponType": "WEAPON_TYPE_LONGSWORD",
            "proficiency": CONSTS.PROFICIENCY_WEAPON_MARTIAL,
            "properties": [{
                property: CONSTS.ITEM_PROPERTY_ATTACK_BONUS,
                amp: 1
            }],
            "damage": "1d8",
            "damageType": "DAMAGE_TYPE_SLASHING",
            "attributes": []
        }
        // dagger +2
        const oDagger = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "proficiency": CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            "weaponType": "WEAPON_TYPE_DAGGER",
            "properties": [{
                property: CONSTS.ITEM_PROPERTY_ENHANCEMENT,
                amp: 2
            }],
            "damage": "1d4",
            "damageType": "DAMAGE_TYPE_PIERCING",
            "attributes": ["WEAPON_ATTRIBUTE_FINESSE"]
        }
        const oBow = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_WEAPON",
            "proficiency": CONSTS.PROFICIENCY_WEAPON_MARTIAL,
            "weaponType": "WEAPON_TYPE_SHORTBOW",
            "properties": [{
                property: CONSTS.ITEM_PROPERTY_ATTACK_BONUS,
                amp: 3
            }],
            "damage": "1d6",
            "damageType": "DAMAGE_TYPE_PIERCING",
            "attributes": [CONSTS.WEAPON_ATTRIBUTE_RANGED, CONSTS.WEAPON_ATTRIBUTE_AMMUNITION]
        }
        // Arrow +2
        const oArrow = {
            "entityType": "ENTITY_TYPE_ITEM",
            "itemType": "ITEM_TYPE_AMMO",
            "properties": [{
                property: CONSTS.ITEM_PROPERTY_ENHANCEMENT,
                amp: 2
            }],
            "stack": 10
        }
        c.store.mutations.equipItem({ item: oSword, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        c.store.mutations.equipItem({ item: oBow, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        c.store.mutations.equipItem({ item: oArrow, slot: CONSTS.EQUIPMENT_SLOT_AMMO })
        c.store.mutations.addProficiency({ proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
        c.store.mutations.addProficiency({ proficiency: CONSTS.PROFICIENCY_WEAPON_MARTIAL })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 14 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 18 })
        c.store.mutations.addClass({ class: CONSTS.CLASS_TOURIST, levels: 1 })
        expect(c.store.getters.getAbilityModifiers[CONSTS.ABILITY_STRENGTH]).toBe(2)
        expect(c.store.getters.getAbilityModifiers[CONSTS.ABILITY_DEXTERITY]).toBe(4)
        expect(c.store.getters.isProficientSelectedWeapon).toBeTrue()
        expect(c.store.getters.getProficiencyBonus).toBe(2)
        // +2 prof, +1 weapon +2 ability
        expect(c.store.getters.getOffensiveEquipmentList.length).toBe(1)
        expect(c.getAttackBonus()).toBe(5)
        c.store.mutations.equipItem({ item: oDagger, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        // +2 prof, +2 weapon +4 ability
        expect(c.getAttackBonus()).toBe(8)
        c.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        // +2 prof, +3 weapon +2 ammo +4 ability
        expect(c.store.getters.getOffensiveEquipmentList.length).toBe(2)
        expect(c.store.getters.getSelectedWeaponProperties.length).toBe(2)
        expect(c.getAttackBonus()).toBe(11)
    })
})

describe('Combat Advantages & Disadvantages', function () {
    it('should have no disadvantage', function () {
        const c = new Creature()
        expect(c.isDisadvantaged(CONSTS.ROLL_TYPE_ATTACK, { ability: CONSTS.ABILITY_STRENGTH })).toBeFalse()
    })
    it('a creature should be invisible', function () {
        const c1 = new Creature()
        c1.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 }})
        expect(c1.store.getters.getEffects.some(eff => eff.tag === CONSTS.EFFECT_INVISIBILITY)).toBeTrue()
        expect(c1.store.getters.getConditions[CONSTS.CONDITION_INVISIBLE]).toBeTrue()
    })
    it('should have attack disadvantage because of invisible target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.store.mutations.setTarget({ target: c2 })
        console.log('is target visible ?')
        expect(c1.store.getters.isTargetVisible).toBeTrue()
        console.log('is condition invisible ?')
        expect(c2.store.getters.getConditions[CONSTS.CONDITION_INVISIBLE]).toBeFalse()
        c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 }})
        console.log('is target visible ?')
        expect(c1.store.getters.isTargetVisible).toBeFalse()
        console.log('is condition invisible ?')
        expect(c2.store.getters.getConditions[CONSTS.CONDITION_INVISIBLE]).toBeTrue()
    })
    xit('should have attack disadvantage because of invisible target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        //c1.store.mutations.setTarget({ target: c2 })
        console.log('c2 effects', c2.store.state.effects)
        console.log('c1 target effects', c1.store.state.target?.effects)
        console.log('c1 target is visible', c1.store.getters.isTargetVisible)
        console.log('c2 condition invisible', c2.store.getters.getConditions[CONSTS.CONDITION_INVISIBLE])
        c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 }})
        console.log(c2.store.state.effects)
        console.log('c2 effects', c2.store.state.effects)
        console.log('c1 target effects', c1.store.state.target?.effects)
        console.log('c1 target is visible', c1.store.getters.isTargetVisible)
        console.log('c2 condition invisible', c2.store.getters.getConditions[CONSTS.CONDITION_INVISIBLE])
        console.log('c2 have one effect', c2.store.getters.getEffects)
        console.log('c2 have one effect', c2.store.state.effects)
        // expect(c1.store.getters.isTargetVisible).toBeFalse()
    })
})

// Test : appliquer un effet à impact
// appliquer un effet à durée temporaire
// creature A applique un effet à créature B
