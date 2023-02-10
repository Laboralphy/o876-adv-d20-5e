const Creature = require('../src/Creature')
const Rules = require('../src/Rules')
const EffectProcessor = require('../src/EffectProcessor')
const ItemProperties = require('../src/item-properties')
const CONSTS = require('../src/consts')
const { warmup } = require('../src/assets')
const { getDisAndAdvEffectRegistry, getThoseProvidedByEffects } = require('../src/store/creature/common/get-disandadv-effect-registry')

beforeEach(function () {
    Error.stackTraceLimit = Infinity
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
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10})
        // ajouter un ability modifier
        const ep = new EffectProcessor()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ABILITY_BONUS, CONSTS.ABILITY_STRENGTH, 5), c, 10)
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
    })

    it('should get 10 strength WHEN base strength is 10 and dexterity bonus +5 is applied', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        const ep = new EffectProcessor()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ABILITY_BONUS, CONSTS.ABILITY_DEXTERITY, 5), c, 10)
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })

    it('should get 18 strength WHEN to str bonus (+5 and +3) are applied', function () {
        const c = new Creature()
        const ep = new EffectProcessor()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        ep.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_ABILITY_BONUS, CONSTS.ABILITY_STRENGTH, 5),
            c,
            10
        )
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
        ep.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_ABILITY_BONUS, CONSTS.ABILITY_STRENGTH, 3),
            c,
            10
        )
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
        c.store.mutations.addClass({ ref: 'tourist' })
        expect(c.store.getters.getLevel).toBe(1)
        expect(c.store.getters.getLevelByClass['tourist']).toBe(1)
    })
    it('should be tourist lvl 3 and creature lvl 3 WHEN adding 3 levels of tourist to a new creature', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: 'tourist' })
        c.store.mutations.addClass({ ref: 'tourist' })
        c.store.mutations.addClass({ ref: 'tourist' })
        expect(c.store.getters.getLevel).toBe(3)
        expect(c.store.getters.getLevelByClass['tourist']).toBe(3)
    })
    it('should be tourist 2, barbarian 3 and creature 5 WHEN adding 2 levels of tourist and 3 of barbarian to a new creature', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: 'tourist' })
        c.store.mutations.addClass({ ref: 'barbarian' })
        c.store.mutations.addClass({ ref: 'barbarian' })
        c.store.mutations.addClass({ ref: 'tourist' })
        c.store.mutations.addClass({ ref: 'barbarian' })
        expect(c.store.getters.getLevel).toBe(5)
        expect(c.store.getters.getLevelByClass['tourist']).toBe(2)
        expect(c.store.getters.getLevelByClass['barbarian']).toBe(3)
    })
})

describe('getMaxHitPoints', function () {
    it('should have 10 hp on first level of fighter', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: 'fighter' })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        expect(c.store.getters.getMaxHitPoints).toBe(10)
    })
    it('should have 16 hp on second level of fighter', function () {
        const c = new Creature()
        c.store.mutations.addClass({ ref: 'fighter', levels: 2 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_CONSTITUTION]).toBe(10)
        expect(c.store.getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION]).toBe(0)
        expect(c.store.getters.getMaxHitPoints).toBe(16)
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
        c.store.mutations.addClass({ ref: 'tourist', levels: 1 })
        expect(c.store.getters.getLevel).toBe(1)
        expect(c.store.getters.getProficiencyBonus).toBe(2)
        expect(c.store.getters.isProficientSelectedWeapon).toBeTrue()
        expect(c.getAttackBonus()).toBe(2)
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 12 })
        expect(c.getAttackBonus()).toBe(3)
        c.store.mutations.addClass({ ref: 'tourist', levels: 4 })
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
        c.store.mutations.addClass({ ref: 'tourist', levels: 1 })
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
        c.store.mutations.addClass({ ref: 'tourist', levels: 1 })
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
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTrue()
    })
    it('la target est initialement invisible', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        const eInvis = EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY)
        c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        c1.setTarget(c2)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalse()
    })
    it('should not see the target WHEN selecting an invisible target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        const ep = new EffectProcessor()
        c1.setTarget(c2)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTrue()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), c2, 10)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalse()
    })
    it('should update canSeeTarget WHEN invisible effect is added/remove on target', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.setTarget(c2)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTrue()
        const eInvis = c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        expect(eInvis.type).toBe(CONSTS.EFFECT_INVISIBILITY)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalse()
        c2.store.mutations.removeEffect({ effect: eInvis })
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTrue()
    })
})

describe('getEffects', function () {
    it('should have no effect WHEN creature is fresh new', function() {
        const c1 = new Creature()
        expect(c1.store.getters.getEffects).toEqual([])
    })
    it('should have an effect WHEN adding an invisible effect', function() {
        const c1 = new Creature()
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        expect(c1.store.getters.getEffects[0]).toBeDefined()
    })
})

describe('dis and adv', function () {
    it('should not return anything when creature has no effect', function () {
        const c1 = new Creature()
        expect(getDisAndAdvEffectRegistry(c1.store.getters.getEffects, [])).toEqual({})
    })
    it('should return ADV1 when creature has one advantage effect with ADV1 tag', function () {
        const c1 = new Creature()
        const ep = new EffectProcessor()
        const eAdv = EffectProcessor.createEffect(
            CONSTS.EFFECT_ADVANTAGE,
            [CONSTS.ROLL_TYPE_ATTACK], [CONSTS.ABILITY_INTELLIGENCE], 'ADV1'
        )
        ep.applyEffect(eAdv, c1, 10)
        expect(getDisAndAdvEffectRegistry(c1.store.getters.getEffects, [])).toEqual({
            ROLL_TYPE_ATTACK: {
                ABILITY_INTELLIGENCE: ['ADV1']
            }
        })
    })
    it('should return many ADV1 (on each ability) when creature has one advantage effect with ADV1 tag and multiple ability', function () {
        const c1 = new Creature()
        const ep = new EffectProcessor()
        const eAdv = EffectProcessor.createEffect( CONSTS.EFFECT_ADVANTAGE,
            [CONSTS.ROLL_TYPE_ATTACK],
            [
                CONSTS.ABILITY_STRENGTH,
                CONSTS.ABILITY_DEXTERITY,
                CONSTS.ABILITY_CONSTITUTION,
                CONSTS.ABILITY_INTELLIGENCE,
                CONSTS.ABILITY_WISDOM,
                CONSTS.ABILITY_CHARISMA
            ],
            'ADV1'
        )
        ep.applyEffect(eAdv, c1, 10)
        if (!c1.store.getters.getEffects) {
            throw new Error('WTF getEffects is undefined')
        }
        expect(getDisAndAdvEffectRegistry(c1.store.getters.getEffects, [])).toEqual({
            ROLL_TYPE_ATTACK: {
                ABILITY_STRENGTH: ['ADV1'],
                ABILITY_DEXTERITY: ['ADV1'],
                ABILITY_CONSTITUTION: ['ADV1'],
                ABILITY_INTELLIGENCE: ['ADV1'],
                ABILITY_WISDOM: ['ADV1'],
                ABILITY_CHARISMA: ['ADV1']
            }
        })
    })
    it('should return a structure compatible with advantages', function () {
        const data = {
            ROLL_TYPE_ATTACK: {
                ABILITY_STRENGTH: ['ADV1'],
                ABILITY_DEXTERITY: ['ADV1'],
                ABILITY_CONSTITUTION: ['ADV1'],
                ABILITY_INTELLIGENCE: ['ADV1'],
                ABILITY_WISDOM: ['ADV1'],
                ABILITY_CHARISMA: ['ADV1']
            }
        }
        expect(getThoseProvidedByEffects(
            data,
            CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_STRENGTH)
        ).toEqual({
            ADV1: true
        })
        expect(getThoseProvidedByEffects(
            data,
            CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_DEXTERITY)
        ).toEqual({
            ADV1: true
        })
        expect(getThoseProvidedByEffects(
            data,
            CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_WISDOM)
        ).toEqual({
            ADV1: true
        })
        expect(getThoseProvidedByEffects(
            data,
            CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_WISDOM)
        ).toEqual({})
    })
})

describe('getAdvantages/getDisadvantages', function () {
    it('should have a condition initiated by c2 WHEN c2 applies an effect on c1', function () {
        const c1 = new Creature()
        const c2 = new Creature()
        c1.setTarget(c2)
        const ep = new EffectProcessor()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), c2, 10, c1)
        expect(c2.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(c1.store.getters.getTargetConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(c2.store.getters.getConditionSources[CONSTS.CONDITION_INVISIBLE]).toEqual(new Set([c1.id]))
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
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeTrue()
            // cible peut me voir
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeTrue()
            // ajout d'effet invisible sur c1
            c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            // c1 vois toujours c2
            expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTrue()
            // c1 n'est pas visible par c2
            expect(c1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeFalse()
            // c1 a donc bien un avantage d'attaque en force sur c2
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeTrue()
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('UNDETECTED')).toBeTrue()
        })
        it('should not be an advantage on attack rolls when target has true sight', function () {
            const c1 = new Creature()
            const c2 = new Creature()
            c1.setTarget(c2)
            // pas d'avantage sur les jets d'attaque en force
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
            // cible visible
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeTrue()
            // cible peut me voir
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeTrue()
            // ajout d'effet invisible sur c1
            c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_TRUE_SIGHT), 10)
            // c1 vois toujours c2
            expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTrue()
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeTrue()
            // c1 n'est pas visible par c2
            expect(c1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeTrue()
            // c1 et c2 se voient
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('UNDETECTED')).toBeFalse()
        })
        it('should not be an advantage on attack rolls when target also invisible', function () {
            const c1 = new Creature()
            const c2 = new Creature()
            c1.setTarget(c2)
            c2.setTarget(c1)
            // pas d'avantage sur les jets d'attaque en force
            c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            // c1 vois toujours c2
            expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalse()
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeFalse()
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
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        // c1 vois toujours c2
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTrue()
        // c1 n'est pas visible par c2
        expect(c1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        // c2 ne vois plus c1
        expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeFalse()
        expect(c2.store.getters.getEntityVisibility.detectable.target).toBeFalse()
        // c2 a donc bien un désavantage d'attaque en tout
        expect(c2.store.getters.getDisadvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeTrue()
        expect(c2.store.getters.getDisadvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('TARGET_UNSEEN')).toBeTrue()
    })
})

// Test : appliquer un effet à impact
// appliquer un effet à durée temporaire
// creature A applique un effet à créature B

describe('groupEffect', function () {
    it('should create 3 effects when applying a group of two effects', function () {
        const c = new Creature()
        const ep = new EffectProcessor()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_GROUP, [
                EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY),
                EffectProcessor.createEffect(CONSTS.EFFECT_TRUE_SIGHT)
            ]
        ), c, 10)
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_TRUE_SIGHT)).toBeTrue()
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        ep.processCreatureEffects(c)
        expect(c.store.getters.getEffects.length).toBe(3)
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_TRUE_SIGHT)).toBeTrue()
        ep.processCreatureEffects(c)
        expect(c.store.getters.getEffects.length).toBe(0)
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeFalse()
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_TRUE_SIGHT)).toBeFalse()
    })
    it('should dispel all effects when dispelling the group effect', function () {
        const c = new Creature()
        const eInvis = EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY)
        const eThrSi = EffectProcessor.createEffect(CONSTS.EFFECT_TRUE_SIGHT)
        const eGroup = EffectProcessor.createEffect(CONSTS.EFFECT_GROUP, [eInvis, eThrSi], 'TEST_GROUP')
        c.applyEffect(eGroup, 10)
        c.processEffects()
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_TRUE_SIGHT)).toBeTrue()
        const effFound = c.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_GROUP && eff.tag === 'TEST_GROUP')
        c.store.mutations.dispellEffect({ effect: effFound })
        c.processEffects()
        const effFound2 = c.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_GROUP && eff.tag === 'TEST_GROUP')
        expect(effFound2).not.toBeDefined()
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeFalse()
        expect(c.store.getters.getConditions.has(CONSTS.CONDITION_TRUE_SIGHT)).toBeFalse()
    })
})

describe('getDamageBonus', function () {
    it('should have damage bonus +1 slashing when equiping sword +1', function () {
        const r = new Rules()
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_WISDOM, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CHARISMA, value: 10 })
        r.init()
        const oSword = r.createEntity('wpn-shortsword')
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_ENHANCEMENT]({ value: 1 }))
        c.store.mutations.equipItem({ item: oSword })
        const db = c.getDamageBonus()
        expect(db).toEqual({ DAMAGE_TYPE_SLASHING: 1 })
    })
    it('should have damage bonus +1 slashing +1 fire when equiping sword +1 of flame', function () {
        const r = new Rules()
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_WISDOM, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CHARISMA, value: 10 })
        r.init()
        const oSword = r.createEntity('wpn-shortsword')
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_ENHANCEMENT]({ value: 1 }))
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_DAMAGE_BONUS]({ value: 1, type: CONSTS.DAMAGE_TYPE_FIRE }))
        c.store.mutations.equipItem({ item: oSword })
        const db = c.getDamageBonus()
        expect(db).toEqual({ DAMAGE_TYPE_SLASHING: 1, DAMAGE_TYPE_FIRE: 1 })
    })
})
