const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')
const { warmup } = require('../src/assets')

beforeEach(function () {
    warmup()
})

describe('basic instanciation', function () {
    it('should not throw error WHEN instanciated', function () {
        expect(() => {
            new Creature()
        }).not.toThrow()
    })
})

describe('setAbility', function () {
    it('should get 10 strength WHEN setting 10', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })
})

describe('addEffect', function () {
    it('should get 15 strength WHEN base strength is 10 and ability bonus effect is 5 (on strength)', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_ABILITY_BONUS, duration: 10, amp: 5, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
    })

    it('should get 10 strength WHEN base strength is 10 and dexterity bonus +5 is applied', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_ABILITY_BONUS, duration: 10, amp: 5, data: { ability: CONSTS.ABILITY_DEXTERITY }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })

    it('should get 18 strength WHEN to str bonus (+5 and +3) are applied', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        c.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_ABILITY_BONUS, duration: 10, amp: 5, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
        c.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_ABILITY_BONUS, duration: 10, amp: 3, data: { ability: CONSTS.ABILITY_STRENGTH }}})
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(18)
    })

    it('should have an intelligence modifier of 3, -1, -5, -5 WHEN ability is 16, 9, 0, 1', function () {
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

describe('addClass', function () {
    it('should be level 0 WHEN not adding classes', function () {
        const c = new Creature()
        expect(c.store.getters.getLevel).toBe(0)
    })
    it('should be tourist level 1 WHEN a level of tourist is added to new creature', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        expect(c.store.getters.getLevel).toBe(1)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_TOURIST]).toBe(1)
    })
    it('should be tourist lvl 3 and creature lvl 3 WHEN adding 3 levels of tourist to a new creature', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        expect(c.store.getters.getLevel).toBe(3)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_TOURIST]).toBe(3)
    })
    it('should be tourist 2, barbarian 3 and creature 5 WHEN adding 2 levels of tourist and 3 of barbarian to a new creature', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_BARBARIAN })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_BARBARIAN })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_TOURIST })
        c.store.mutations.addClass({ ref: CONSTS.CLASS_BARBARIAN })
        expect(c.store.getters.getLevel).toBe(5)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_TOURIST]).toBe(2)
        expect(c.store.getters.getLevelByClass[CONSTS.CLASS_BARBARIAN]).toBe(3)
    })
})

describe('getMaxHitPoints', function () {
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
    it('should have AC 12 WHEN wearing a class 12 armor', function () {
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
    it('should have AC 14 WHEN wearing magical (+2) armor', function () {
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
    it('should have a higher attack bonus WHEN gaining a level and/or adding a bonus effect on primary stat', function () {
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
    it ('should update attack bonus WHEN switching from weapon melee to ranged', function () {
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
    it ('should update attack bonus WHEN switching from magical weapon melee to ranged', function () {
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

describe('getTarget', function () {
    it('should not be null WHEN setting a target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        expect(c1.store.getters.getTarget).toBeNull()
        c1.setTarget(c2)
        expect(c1.store.getters.getTarget).not.toBeNull()
    })
    it('should see the target WHEN selecting a visible target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.setTarget(c2)
        expect(c1.store.getters.canSeeTarget).toBeTrue()
    })
    it('la target est initialement invisible', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 }})
        c1.setTarget(c2)
        expect(c1.store.getters.canSeeTarget).toBeFalse()
    })
    it('should not see the target WHEN selecting an invisible target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.setTarget(c2)
        expect(c1.store.getters.canSeeTarget).toBeTrue()
        c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 }})
        expect(c1.store.getters.canSeeTarget).toBeFalse()
    })
    it('should update canSeeTarget WHEN invisible effect is added/remove on target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.setTarget(c2)
        expect(c1.store.getters.canSeeTarget).toBeTrue()
        c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 } })
        const eInvis = c2.store.getters.getEffects[0]
        expect(eInvis.tag).toBe(CONSTS.EFFECT_INVISIBILITY)
        expect(c1.store.getters.canSeeTarget).toBeFalse()
        c2.store.mutations.removeEffect({ effect: eInvis })
        expect(c1.store.getters.canSeeTarget).toBeTrue()
    })
})

describe('getEffects', function () {
    it('should have no effect WHEN creature is fresh new', function() {
        const c1 = new Creature()
        expect(c1.store.getters.getEffects).toEqual([])
    })
    it('should have an effect WHEN adding an invisible effect', function() {
        const c1 = new Creature()
        c1.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 } })
        expect(c1.store.getters.getEffects[0]).toBeDefined()
    })
})

describe('getAdvantages/getDisadvantages', function () {
    it('should have a condition initiated by c2 WHEN c2 applies an effect on c1', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.setTarget(c2)
        c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10, source: c1.id } })
        expect(c2.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(c1.store.getters.getTargetConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(c2.store.getters.getConditionSources[CONSTS.CONDITION_INVISIBLE]).toEqual([c1.id])
    })
    it ('should have no advantage/disadvantage WHEN  creature is fresh new', function () {
        const c = new Creature()
        expect(c.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
    })
    describe('WHEN me is invisible', function () {
        it('should be an advantage on attack rolls when target cannot see attacker', function () {
            const c1 = new Creature()
            const c2 = new Creature()
            c1.setTarget(c2)
            c2.setTarget(c1)
            // pas d'avantage sur les jets d'attaque en force
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
            // cible visible
            expect(c2.store.getters.canSeeTarget).toBeTrue()
            // cible peut me voir
            expect(c1.store.getters.canTargetSeeMe).toBeTrue()
            // ajout d'effet invisible sur c1
            c1.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 } })
            // c1 vois toujours c2
            expect(c1.store.getters.canSeeTarget).toBeTrue()
            // c1 n'est pas visible par c2
            expect(c1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
            expect(c1.store.getters.canTargetSeeMe).toBeFalse()
            // c1 a donc bien un avantage d'attaque en force sur c2
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeTrue()
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('HIDDEN_AND_TARGET_VISIBLE')).toBeTrue()
        })
        it('should not be an advantage on attack rolls when target has true sight', function () {
            const c1 = new Creature()
            const c2 = new Creature()
            c1.setTarget(c2)
            // pas d'avantage sur les jets d'attaque en force
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
            // cible visible
            expect(c2.store.getters.canSeeTarget).toBeTrue()
            // cible peut me voir
            expect(c1.store.getters.canTargetSeeMe).toBeTrue()
            // ajout d'effet invisible sur c1
            c1.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 } })
            c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_TRUE_SIGHT, amp: 1, duration: 10 } })
            // c1 vois toujours c2
            expect(c1.store.getters.canSeeTarget).toBeTrue()
            expect(c2.store.getters.canSeeTarget).toBeTrue()
            // c1 n'est pas visible par c2
            expect(c1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
            expect(c1.store.getters.canTargetSeeMe).toBeTrue()
            // c1 et c2 se voient
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('TARGET_CANNOT_SEE_ME')).toBeFalse()
        })
        it('should not be an advantage on attack rolls when target also invisible', function () {
            const c1 = new Creature()
            const c2 = new Creature()
            c1.setTarget(c2)
            c2.setTarget(c1)
            // pas d'avantage sur les jets d'attaque en force
            c1.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 } })
            c2.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 } })
            // c1 vois toujours c2
            expect(c1.store.getters.canSeeTarget).toBeFalse()
            expect(c2.store.getters.canSeeTarget).toBeFalse()
            // c1 n'est pas visible par c2
            // c1 et c2 ne se voient pas
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
            expect(c2.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
        })
    })
    it ('should have disadvantage on attack when target is invisible and target can see me', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.setTarget(c2)
        c2.setTarget(c1)

        // ajout d'effet invisible sur c1
        c1.store.mutations.addEffect({ effect: { tag: CONSTS.EFFECT_INVISIBILITY, amp: 1, duration: 10 } })
        // c1 vois toujours c2
        expect(c1.store.getters.canSeeTarget).toBeTrue()
        // c1 n'est pas visible par c2
        expect(c1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        // c2 ne vois plus c1
        expect(c1.store.getters.canTargetSeeMe).toBeFalse()
        expect(c2.store.getters.canSeeTarget).toBeFalse()
        // c2 a donc bien un désavantage d'attaque en tout
        expect(c2.store.getters.getDisadvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeTrue()
        expect(c2.store.getters.getDisadvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('NOT_HIDDEN_AND_TARGET_INVISIBLE')).toBeTrue()
    })
})


// Test : appliquer un effet à impact
// appliquer un effet à durée temporaire
// creature A applique un effet à créature B
