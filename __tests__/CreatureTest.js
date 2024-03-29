const Creature = require('../src/Creature')
const ManagerProto = require('../src/Manager')
const EffectProcessor = require('../src/EffectProcessor')
const ItemProperties = require('../src/item-properties')
const CONSTS = require('../src/consts')
const { getDisAndAdvEffectRegistry, getThoseProvidedByEffects } = require('../src/store/creature/common/get-disandadv-effect-registry')

const DISTANCE_MELEE = 4
const DISTANCE_REACH = 9
const DISTANCE_RANGED = 30

class Manager extends ManagerProto {
    constructor() {
        super()
        this.config.setModuleActive('classic', true)
    }
}

describe('basic instanciation', function () {
    it('should not throw error WHEN instanciated', function () {
        expect(() => {
            new Creature()
        }).not.toThrow()
    })
})

describe('setAbility', function () {
    it('should get 10 strength WHEN setting 10', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })
})

describe('addEffect', function () {
    it('should get 15 strength WHEN base strength is 10 and ability bonus effect is 5 (on strength)', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10})
        // ajouter un ability modifier
        const ep = new EffectProcessor()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ABILITY_BONUS, CONSTS.ABILITY_STRENGTH, 5), c, 10)
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(15)
    })

    it('should get 10 strength WHEN base strength is 10 and dexterity bonus +5 is applied', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        // ajouter un ability modifier
        const ep = new EffectProcessor()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ABILITY_BONUS, CONSTS.ABILITY_DEXTERITY, 5), c, 10)
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]).toBe(10)
    })

    it('should get 18 strength WHEN to str bonus (+5 and +3) are applied', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
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
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
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
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        expect(c.store.getters.getLevel).toBe(0)
    })
    it('should be tourist level 1 WHEN a level of tourist is added to new creature', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.addClass({ ref: 'tourist' })
        expect(c.store.getters.getLevel).toBe(1)
        expect(c.store.getters.getLevelByClass['tourist']).toBe(1)
    })
    it('should be tourist lvl 3 and creature lvl 3 WHEN adding 3 levels of tourist to a new creature', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.addClass({ ref: 'tourist' })
        c.store.mutations.addClass({ ref: 'tourist' })
        c.store.mutations.addClass({ ref: 'tourist' })
        expect(c.store.getters.getLevel).toBe(3)
        expect(c.store.getters.getLevelByClass['tourist']).toBe(3)
    })
    it('should be tourist 2, barbarian 3 and creature 5 WHEN adding 2 levels of tourist and 3 of barbarian to a new creature', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
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
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.addClass({ ref: 'fighter' })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        expect(c.store.getters.getMaxHitPoints).toBe(10)
    })
    it('should have 16 hp on second level of fighter', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.addClass({ ref: 'fighter', levels: 2 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        expect(c.store.getters.getAbilityValues[CONSTS.ABILITY_CONSTITUTION]).toBe(10)
        expect(c.store.getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION]).toBe(0)
        expect(c.store.getters.getMaxHitPoints).toBe(16)
    })
})

describe('getAC', function () {
    it('should have AC 12 WHEN wearing a class 12 armor', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
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
        expect(c.store.getters.getArmorClass).toBe(12)
    })
    it('should have AC 14 WHEN wearing magical (+2) armor', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
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
        expect(c.store.getters.getArmorClass).toBe(14)
    })
})

describe('getAttackBonus', function () {
    it('should have a higher attack bonus WHEN gaining a level and/or adding a bonus effect on primary stat', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
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
        expect(c.store.getters.isProficientSelectedWeapon).toBeTruthy()
        expect(c.store.getters.getAttackBonus).toBe(2)
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 12 })
        expect(c.store.getters.getAttackBonus).toBe(3)
        c.store.mutations.addClass({ ref: 'tourist', levels: 4 })
        expect(c.store.getters.getAttackBonus).toBe(4)
    })
    it ('should update attack bonus WHEN switching from weapon melee to ranged', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
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
        expect(c.store.getters.getAttackBonus).toBe(2)
        c.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        expect(c.store.getters.getAttackBonus).toBe(4)
        c.store.mutations.equipItem({ item: oDagger, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        expect(c.store.getters.getAttackBonus).toBe(4)
    })
    it ('should update attack bonus WHEN switching from magical weapon melee to ranged', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
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
        expect(c.store.getters.isProficientSelectedWeapon).toBeTruthy()
        expect(c.store.getters.getProficiencyBonus).toBe(2)
        // +2 prof, +1 weapon +2 ability
        expect(c.store.getters.getOffensiveEquipmentList.length).toBe(1)
        expect(c.store.getters.getAttackBonus).toBe(5)
        c.store.mutations.equipItem({ item: oDagger, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        // +2 prof, +2 weapon +4 ability
        expect(c.store.getters.getAttackBonus).toBe(8)
        c.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        // +2 prof, +3 weapon +2 ammo +4 ability
        expect(c.store.getters.getOffensiveEquipmentList.length).toBe(2)
        expect(c.store.getters.getSelectedWeaponProperties.length).toBe(2)
        expect(c.store.getters.getAttackBonus).toBe(11)
    })
})

describe('getTarget', function () {
    it('should not be null WHEN setting a target', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        expect(c1.store.getters.getTarget).toBeNull()
        c1.setTarget(c2)
        expect(c1.store.getters.getTarget).not.toBeNull()
    })
    it('should see the target WHEN selecting a visible target', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        c1.setTarget(c2)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
    })
    it('la target est initialement invisible', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY);
        c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        c1.setTarget(c2)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalsy()
    })
    it('should not see the target WHEN selecting an invisible target', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const ep = new EffectProcessor()
        c1.setTarget(c2)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), c2, 10)
        expect(c1.store.state.target.id).toBe(c2.id)
        expect([...c2.store.getters.getConditionSet]).toEqual(['CONDITION_INVISIBLE'])
        expect([...c1.getTarget().store.getters.getConditionSet]).toEqual(['CONDITION_INVISIBLE'])
        expect([...c1.store.getters.getTargetConditionSet]).toEqual(['CONDITION_INVISIBLE'])
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalsy()
    })
    it('should update canSeeTarget WHEN invisible effect is added/remove on target', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        c1.setTarget(c2)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
        const eInvis = c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        expect(eInvis.type).toBe(CONSTS.EFFECT_INVISIBILITY)
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalsy()
    })
})

describe('getEffects', function () {
    it('should have no effect WHEN creature is fresh new', function() {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        expect(c1.store.getters.getEffects).toEqual([])
    })
    it('should have an effect WHEN adding an invisible effect', function() {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        expect(c1.store.getters.getEffects[0]).toBeDefined()
    })
})

describe('dis and adv', function () {
    it('should not return anything when creature has no effect', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        expect(getDisAndAdvEffectRegistry(c1.store.getters.getEffects, [])).toEqual({})
    })
    it('should return ADV1 when creature has one advantage effect with ADV1 tag', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
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
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
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
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        c1.setTarget(c2)
        const ep = new EffectProcessor()
        ep.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), c2, 10, c1)
        expect(c2.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTruthy()
        expect(c1.store.getters.getTargetConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTruthy()
        expect(c2.store.getters.getConditionSources[CONSTS.CONDITION_INVISIBLE]).toEqual(new Set([c1.id]))
    })
    it ('should have no advantage/disadvantage WHEN  creature is fresh new', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        expect(c.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalsy()
    })
    describe('WHEN me is invisible', function () {
        it('should be an advantage on attack rolls when target cannot see attacker', function () {
            const r = new Manager()
            r.init()
            const c1 = r.entityFactory.createCreature()
            const c2 = r.entityFactory.createCreature()
            c1.setTarget(c2)
            c2.setTarget(c1)
            // pas d'avantage sur les jets d'attaque en force
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalsy()
            // cible visible
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
            // cible peut me voir
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeTruthy()
            // ajout d'effet invisible sur c1
            c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            // c1 vois toujours c2
            expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
            // c1 n'est pas visible par c2
            expect(c1.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTruthy()
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeFalsy()
            // c1 a donc bien un avantage d'attaque en force sur c2
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeTruthy()
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('UNDETECTED')).toBeTruthy()
        })
        it('should not be an advantage on attack rolls when target has true sight', function () {
            const r = new Manager()
            r.init()
            const c1 = r.entityFactory.createCreature()
            const c2 = r.entityFactory.createCreature()
            c1.setTarget(c2)
            c2.setTarget(c1)
            // pas d'avantage sur les jets d'attaque en force
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalsy()
            // cible visible
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
            // cible peut me voir
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeTruthy()
            // ajout d'effet invisible sur c1
            c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_TRUE_SIGHT), 10)
            // c1 vois toujours c2
            expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
            // c1 n'est pas visible par c2
            expect(c1.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTruthy()
            expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeTruthy()
            // c1 et c2 se voient
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalsy()
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('UNDETECTED')).toBeFalsy()
        })
        it('should not be an advantage on attack rolls when target also invisible', function () {
            const r = new Manager()
            r.init()
            const c1 = r.entityFactory.createCreature()
            const c2 = r.entityFactory.createCreature()
            c1.setTarget(c2)
            c2.setTarget(c1)
            // pas d'avantage sur les jets d'attaque en force
            c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
            // c1 vois toujours c2
            expect(c1.store.getters.getEntityVisibility.detectable.target).toBeFalsy()
            expect(c2.store.getters.getEntityVisibility.detectable.target).toBeFalsy()
            // c1 n'est pas visible par c2
            // c1 et c2 ne se voient pas
            expect(c1.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalsy()
            expect(c2.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalsy()
        })
    })
    it ('should have disadvantage on attack when target is invisible and target can see me', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        c1.setTarget(c2)
        c2.setTarget(c1)

        // ajout d'effet invisible sur c1
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_INVISIBILITY), 10)
        // c1 vois toujours c2
        expect(c1.store.getters.getEntityVisibility.detectable.target).toBeTruthy()
        // c1 n'est pas visible par c2
        expect(c1.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTruthy()
        // c2 ne vois plus c1
        expect(c1.store.getters.getEntityVisibility.detectedBy.target).toBeFalsy()
        expect(c2.store.getters.getEntityVisibility.detectable.target).toBeFalsy()
        // c2 a donc bien un désavantage d'attaque en tout
        expect(c2.store.getters.getDisadvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeTruthy()
        expect(c2.store.getters.getDisadvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('TARGET_UNSEEN')).toBeTruthy()
    })
})

describe('getDamageBonus', function () {
    it('should have damage bonus +1 slashing when equiping sword +1', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_WISDOM, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CHARISMA, value: 10 })
        r.init()
        const oSword = r.createEntity('wpn-shortsword')
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_ENHANCEMENT]({ amp: 1 }))
        c.store.mutations.equipItem({ item: oSword })
        const db = c.getDamageBonus()
        expect(db).toEqual({ DAMAGE_TYPE_SLASHING: 1 })
    })
    it('should have damage bonus +1 slashing +1 fire when equiping sword +1 of flame', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_WISDOM, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CHARISMA, value: 10 })
        r.init()
        const oSword = r.createEntity('wpn-shortsword')
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_ENHANCEMENT]({ amp: 1 }))
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_DAMAGE_BONUS]({ amp: 1, type: CONSTS.DAMAGE_TYPE_FIRE }))
        c.store.mutations.equipItem({ item: oSword })
        const db = c.getDamageBonus()
        expect(db).toEqual({ DAMAGE_TYPE_SLASHING: 1, DAMAGE_TYPE_FIRE: 1 })
    })
    it('blade of angurvadal', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_WISDOM, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CHARISMA, value: 10 })
        r.init()
        c.dice.cheat(0.99999)
        const oSword = r.createEntity('wpn-shortsword')
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_ENHANCEMENT]({ amp: 1 }))
        oSword.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_DAMAGE_BONUS]({ amp: '1d4', type: CONSTS.DAMAGE_TYPE_FIRE }))
        c.store.mutations.equipItem({ item: oSword })
        const db = c.getDamageBonus()
        expect(db).toEqual({ DAMAGE_TYPE_SLASHING: 1, DAMAGE_TYPE_FIRE: 4 })
    })
})

describe('aggregateModifier with randomn amp', function () {
    it('should return amp 1 when applying effect with amplitude 1d6 and random fixed to 0', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.dice.cheat(0.000001) // almost 0
        c.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_BONUS, '1d6'), 10)
        const am = c.aggregateModifiers([CONSTS.EFFECT_DAMAGE_BONUS], {
            effectAmpMapper: eff => c.roll(eff.amp)
        })
        expect(am).toEqual({ sum: 1, max: 1, min: Infinity, sorter: {}, count: 1, effects: 1, ip: 0 })
    })
    it('should return amp 6 when applying effect with amplitude 1d6 and random fixed to 1', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.dice.cheat(0.999999) // almost 1
        c.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_BONUS, '1d6'), 10)
        const am = c.aggregateModifiers([CONSTS.EFFECT_DAMAGE_BONUS], {
            effectAmpMapper: eff => c.roll(eff.amp)
        })
        expect(am).toEqual({ sum: 6, max: 6, min: Infinity, sorter: {}, count: 1, effects: 6, ip: 0 })
    })
})

describe('damage mitigation', function () {
    it ('should not have damage mitigation when not effect is applied', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        expect(c.store.getters.getDamageMitigation).toEqual({})
    })
    it ('should have fire damage reduction 1 when one effect of DAMAGE_REDUCTION fire 1 is applied', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_REDUCTION, 1, CONSTS.DAMAGE_TYPE_FIRE),
            10
        )
        expect(c.store.getters.getDamageMitigation)
            .toEqual({ DAMAGE_TYPE_FIRE: { immunity: false, reduction: 1, factor: 1, vulnerability: false, resistance: false }})
    })
    it ('should have fire damage resistance when one effect of DAMAGE_RESIST fire is applied', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_RESISTANCE, CONSTS.DAMAGE_TYPE_FIRE),
            10
        )
        expect(c.store.getters.getDamageMitigation)
            .toEqual({ DAMAGE_TYPE_FIRE: { immunity: false, reduction: 0, factor: 0.5, vulnerability: false, resistance: true }})
    })
    it ('should have fire damage vulnerability when one effect of DAMAGE_VULNERABILITY fire is applied', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_VULNERABILITY, CONSTS.DAMAGE_TYPE_FIRE),
            10
        )
        expect(c.store.getters.getDamageMitigation)
            .toEqual({ DAMAGE_TYPE_FIRE: { immunity: false, reduction: 0, factor: 2, vulnerability: true, resistance: false }})
    })
    it ('should have fire damage mitig. factor 1 when both DAMAGE_VULNERABILITY fire  DAMAGE_RESISTANCE fire are applied', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_VULNERABILITY, CONSTS.DAMAGE_TYPE_FIRE),
            10
        )
        c.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_RESISTANCE, CONSTS.DAMAGE_TYPE_FIRE),
            10
        )
        expect(c.store.getters.getDamageMitigation)
            .toEqual({ DAMAGE_TYPE_FIRE: { immunity: false, reduction: 0, factor: 1, vulnerability: true, resistance: true }})
    })
    it ('should have fire and cold damage mitig. factor 0.5 for fire, factor 2 for fire', function () {
        const r = new Manager()
        r.init()
        const c = r.entityFactory.createCreature()
        c.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_VULNERABILITY, CONSTS.DAMAGE_TYPE_COLD),
            10
        )
        c.applyEffect(
            EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE_RESISTANCE, CONSTS.DAMAGE_TYPE_FIRE),
            10
        )
        expect(c.store.getters.getDamageMitigation)
            .toEqual({
                DAMAGE_TYPE_FIRE: { immunity: false, reduction: 0, factor: 0.5, vulnerability: false, resistance: true },
                DAMAGE_TYPE_COLD: { immunity: false, reduction: 0, factor: 2, vulnerability: true, resistance: false }
            })
    })
})

describe('attack logs', function () {
    it('should do at least 1 dmg when doing attack with a shortsword and a strength of 0', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const oSword1 = r.createEntity('wpn-shortsword')
        const oSword2 = r.createEntity('wpn-shortsword')
        const oArmor1 = r.createEntity('arm-leather')
        const oArmor2 = r.createEntity('arm-leather')
        c1.equipItem(oSword1)
        c1.equipItem(oArmor1)
        c2.equipItem(oSword2)
        c2.equipItem(oArmor2)
        c1.store.mutations.addClass({ ref: 'fighter', levels: 5 })
        c2.store.mutations.addClass({ ref: 'fighter', levels: 5 })
        c1.setTarget(c2)
        c2.setTarget(c1)
        let oLastAttack
        c1.events.on('attack', ({ outcome }) => {
            oLastAttack = outcome
        })
        c1.dice.cheat(0.75)
        c1.setDistanceToTarget(DISTANCE_MELEE)
        c1.attack()
        expect(oLastAttack).toEqual( {
            ac: 6,
            distance: 5,
            range: 5,
            bonus: -2,
            roll: 14,
            critical: false,
            hit: true,
            dice: 16,
            deflector: '',
            target: c2,
            advantages: {
                rules: [],
                value: false
            },
            disadvantages: {
                rules: [],
                value: false
            },
            weapon: c1.store.getters.getSelectedWeapon,
            ammo: null,
            sneakable: false,
            perception: {
                roll: null,
                stealth: null,
                result: false
            },
            damages: {
                amount: 1,
                types: { DAMAGE_TYPE_SLASHING: 1 },
                resisted: { DAMAGE_TYPE_SLASHING: 0 }
            }
        })
    })
    it('should do 12 dmg when doing attack with a blade of angurvadal and a strength of 10', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const oSword1 = r.createEntity('wpn-longsword')
        const oSword2 = r.createEntity('wpn-longsword')
        const oArmor1 = r.createEntity('arm-leather')
        const oArmor2 = r.createEntity('arm-leather')
        c1.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        oSword1.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_ENHANCEMENT]({ amp: 1 }))
        oSword1.properties.push(ItemProperties[CONSTS.ITEM_PROPERTY_DAMAGE_BONUS]({ amp: '1d4', type: CONSTS.DAMAGE_TYPE_FIRE }))
        c1.equipItem(oSword1)
        c1.equipItem(oArmor1)
        c2.equipItem(oSword2)
        c2.equipItem(oArmor2)
        c1.store.mutations.addClass({ ref: 'fighter', levels: 5 })
        c2.store.mutations.addClass({ ref: 'fighter', levels: 5 })
        c1.setTarget(c2)
        c2.setTarget(c1)
        let oLastAttack
        c1.events.on('attack', ({ outcome }) => {
            oLastAttack = outcome
        })
        c1.dice.cheat(0.75)
        c1.setDistanceToTarget(DISTANCE_MELEE)
        c1.attack()
        expect(oLastAttack).toEqual( {
            ac: 6,
            distance: 5,
            range: 5,
            bonus: 4,
            roll: 20,
            critical: false,
            hit: true,
            dice: 16,
            deflector: '',
            target: c2,
            perception: { roll: null, stealth: null, result: false },
            advantages: {
                rules: [],
                value: false
            },
            disadvantages: {
                rules: [],
                value: false
            },
            weapon: c1.store.getters.getSelectedWeapon,
            ammo: null,
            sneakable: false,
            damages: {
                amount: 12,
                types: { DAMAGE_TYPE_SLASHING: 8, DAMAGE_TYPE_FIRE: 4 },
                resisted: { DAMAGE_TYPE_SLASHING: 0, DAMAGE_TYPE_FIRE: 0 } }
        })
    })
})

describe('weapon ranges and target distance', function () {
    it('should have melee range when no weapon is equipped', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        expect(c1.store.getters.getSelectedWeaponRange).toBe(5) // melee
    })
    it('should have melee range when a long sword is equipped', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const oSword1 = r.createEntity('wpn-longsword')
        c1.store.mutations.equipItem({ item: oSword1 })
        expect(c1.store.getters.getSelectedWeaponRange).toBe(5) // melee
    })
    it('should have long range when a bow is equipped', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const oBow1 = r.createEntity('wpn-longbow')
        c1.store.mutations.equipItem({ item: oBow1 })
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        expect(oBow1.equipmentSlots).toEqual([CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED])
        expect(c1.store.state.offensiveSlot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
        expect(c1.store.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]).not.toBeNull()
        expect(c1.store.getters.getSelectedWeapon).toEqual(oBow1)
        expect(c1.store.getters.getSelectedWeaponRange).toBe(100) // ranged
    })
    it('should have reach range when a halberd is equipped', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const oHalberd1 = r.createEntity('wpn-halberd')
        c1.store.mutations.equipItem({ item: oHalberd1 })
        expect(c1.store.getters.getSelectedWeaponRange).toBe(10) // reach
    })
    it('should return a valid range variation when target is moving', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const oBow1 = r.createEntity('wpn-longbow')
        const oSword1 = r.createEntity('wpn-longsword')
        const oHalberd1 = r.createEntity('wpn-halberd')
        c1.store.mutations.equipItem({ item: oSword1 })
        c1.store.mutations.equipItem({ item: oBow1 })
        c1.setTarget(c2)
        c1.setDistanceToTarget(DISTANCE_MELEE)
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        expect(c1.store.getters.isTargetInWeaponRange).toBeTruthy()
        c1.setDistanceToTarget(DISTANCE_REACH)
        expect(c1.store.getters.isTargetInWeaponRange).toBeFalsy()
        c1.store.mutations.equipItem({ item: oHalberd1 })
        expect(c1.store.getters.isTargetInWeaponRange).toBeTruthy()
        c1.setDistanceToTarget(DISTANCE_RANGED)
        expect(c1.store.getters.isTargetInWeaponRange).toBeFalsy()
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        expect(c1.store.getters.isTargetInWeaponRange).toBeTruthy()
    })
})

describe('multiple targets and distances', function () {
    it('should have a target-distance of NaN when no target is selected', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        expect(c1.store.getters.getTargetDistance).toBeNaN()
        expect(c2.store.getters.getTargetDistance).toBeNaN()
    })
    it('should have a target-distance of not NaN when target is selected', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        c1.setTarget(c2)
        expect(c2.store.getters.getTargetDistance).toBeNaN()
        expect(c1.store.getters.getTargetDistance).not.toBeNaN()
    })
    it('should have same distance when targetting a creature that target me', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        c1.setTarget(c2)
        expect(c1.store.getters.getTarget).toBeDefined()
        expect(c1.store.getters.getTarget).not.toBeNull()
        expect(c1.store.getters.getTarget.id).not.toBe('')
        expect(c1.store.getters.getTargetDistance).not.toBeNaN()
        c2.setTarget(c1)
        expect(c1.store.getters.getTarget).toBeDefined()
        expect(c1.store.getters.getTargetDistance).toBe(c2.store.getters.getTargetDistance)
    })
})

describe('getMaterial armor and weapon and shield', function () {
    it('should return only material_metal when testing sword material', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        c1.assetManager = r.assetManager
        const oSword = r.createEntity('wpn-shortsword')
        oSword.material = CONSTS.MATERIAL_METAL
        c1.store.mutations.equipItem({ item: oSword })
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_METAL)).toBeTruthy()
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_SILVER)).toBeFalsy()
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_WOOD)).toBeFalsy()
    })
    it('should return material_silver and material_metal when setting material to silver on sword', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()

        c1.assetManager = r.assetManager
        const oSword = r.createEntity('wpn-shortsword')
        oSword.material = CONSTS.MATERIAL_SILVER
        c1.store.mutations.equipItem({ item: oSword })
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_METAL)).toBeTruthy()
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_SILVER)).toBeTruthy()
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_WOOD)).toBeFalsy()
    })
    it('should return material_wood and not metal when setting material to wood on sword', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()

        c1.assetManager = r.assetManager
        const oSword = r.createEntity('wpn-shortsword')
        oSword.material = CONSTS.MATERIAL_WOOD
        c1.store.mutations.equipItem({ item: oSword })
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_METAL)).toBeFalsy()
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_SILVER)).toBeFalsy()
        expect(c1.store.getters.getSelectedWeaponMaterialSet.has(CONSTS.MATERIAL_WOOD)).toBeTruthy()
    })
})

describe('prone condition test', function () {
    it('should be disadvantaged when targetting a prone and far target with ranged weapon', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const oBow1 = r.createEntity('wpn-longbow')
        r.createEntity('wpn-longsword');
        r.createEntity('wpn-halberd');
        c1.store.mutations.equipItem({ item: oBow1 })
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        c1.setTarget(c2)
        c1.setDistanceToTarget(DISTANCE_RANGED)
        c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_PRONE), 10)
        expect(c2.store.getters.getConditionSet.has(CONSTS.CONDITION_PRONE)).toBeTruthy()
        const circ1 = c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_DEXTERITY])
        const circ2 = c2.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_DEXTERITY])
        expect(circ1.disadvantage).toBe(true)
        expect(circ1.details.disadvantages).toEqual(['TARGET_PRONE_AND_FAR'])
        expect(circ2.disadvantage).toBe(true)
        expect(circ2.details.disadvantages).toEqual(['PRONE'])
    })
    it('should not be disadvantaged when targetting a prone and close target with melee weapon', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const oBow1 = r.createEntity('wpn-longbow')
        const oSword1 = r.createEntity('wpn-longsword')
        const oHalberd1 = r.createEntity('wpn-halberd')
        c1.store.mutations.equipItem({ item: oSword1 })
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        c1.setTarget(c2)
        c1.setDistanceToTarget(DISTANCE_MELEE)
        c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_PRONE), 10)
        expect(c2.store.getters.getConditionSet.has(CONSTS.CONDITION_PRONE)).toBeTruthy()
        const circ1 = c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_DEXTERITY])
        expect(circ1.disadvantage).toBe(false)
        c1.setDistanceToTarget(DISTANCE_REACH)
        expect(c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_DEXTERITY]).disadvantage).toBeTruthy()
        c1.store.mutations.equipItem({ item: oHalberd1 })
        expect(c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_DEXTERITY]).disadvantage).toBeFalsy()
        c1.store.mutations.equipItem({ item: oBow1 })
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
    })
    it('should be advantaged when targetting a prone and close target with any weapon', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const oBow1 = r.createEntity('wpn-longbow')
        const oSword1 = r.createEntity('wpn-longsword')
        const oHalberd1 = r.createEntity('wpn-halberd')
        c1.store.mutations.equipItem({ item: oSword1 })
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        c1.setTarget(c2)
        c1.setDistanceToTarget(DISTANCE_MELEE)
        c2.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_PRONE), 10)
        expect(c2.store.getters.getConditionSet.has(CONSTS.CONDITION_PRONE)).toBeTruthy()
        // proche d'une cible prone avec une arme de mélée
        expect(c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_STRENGTH]).advantage).toBeTruthy()
        c1.setDistanceToTarget(DISTANCE_REACH)
        // pas si proche d'une cible prone avec une arme de mélée
        expect(c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_STRENGTH]).advantage).toBeFalsy()
        c1.store.mutations.equipItem({ item: oHalberd1 })
        // pas si proche d'une cible prone avec une arme de mélée possédant une bonne allonge
        expect(c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_STRENGTH]).advantage).toBeTruthy()
        c1.store.mutations.equipItem({ item: oBow1 })
        c1.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        // pas si proche d'une cible prone avec une arme à distance
        expect(c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_STRENGTH]).advantage).toBeFalsy()
        c1.setDistanceToTarget(DISTANCE_MELEE)
        // proche d'une cible prone avec une arme à distance
        expect(c1.getCircumstances(CONSTS.ROLL_TYPE_ATTACK, [CONSTS.ABILITY_STRENGTH]).advantage).toBeTruthy()
    })
})

describe('getActions', function () {
    it('should list all action when creating a soldier', function () {
        const r = new Manager()
        r.init()
        const oSoldier = r.createEntity('c-soldier')
        expect(oSoldier.store.getters.getActions).toEqual([
            {
                action: 'feat-second-wind',
                script: 'fa-second-wind',
                uses: { value: 1, max: 1 },
                innate: false
            }
        ])
    })
})

describe('canSee', function () {
    it('should see target when having normal conditions', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        expect(oSeer.getCreatureVisibility(oTarget)).toBe('VISIBILITY_VISIBLE')
    })
    it('should not see target when target is invisible and we dont have see_invis', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oTarget.applyEffect(oTarget.EffectProcessor.createEffect('EFFECT_INVISIBILITY'), 10)
        expect(oSeer.getCreatureVisibility(oTarget)).toBe('VISIBILITY_INVISIBLE')
    })
    it('should see target when target is invisible and we have see_invis', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oTarget.applyEffect(oTarget.EffectProcessor.createEffect('EFFECT_INVISIBILITY'), 10)
        oSeer.applyEffect(oSeer.EffectProcessor.createEffect('EFFECT_SEE_INVISIBILITY'), 10)
        expect(oSeer.getCreatureVisibility(oTarget)).toBe('VISIBILITY_VISIBLE')
    })
    it('should not see target when blind', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oSeer.applyEffect(oSeer.EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_BLINDED), 10)
        expect(oSeer.store.getters.getConditionSet.has(CONSTS.CONDITION_BLINDED)).toBeTruthy()
        expect(oSeer.getCreatureVisibility(oTarget)).toBe(CONSTS.VISIBILITY_BLIND)
    })
    it('should not see target when blind and true sight and see_invis', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oSeer.applyEffect(oSeer.EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_BLINDED), 10)
        oSeer.applyEffect(oSeer.EffectProcessor.createEffect(CONSTS.EFFECT_SEE_INVISIBILITY), 10)
        oSeer.applyEffect(oSeer.EffectProcessor.createEffect(CONSTS.EFFECT_TRUE_SIGHT), 10)
        expect(oSeer.getCreatureVisibility(oTarget)).toBe(CONSTS.VISIBILITY_BLIND)
    })
    it('should not see target when in dark room', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oSeer.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        oTarget.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        expect(oSeer.getCreatureVisibility(oTarget)).toBe(CONSTS.VISIBILITY_DARKNESS)
    })
    it('should have disadvantage when attacking someone in darkroom', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oSeer.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        oTarget.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        oSeer.setTarget(oTarget)
        expect(oSeer.store.getters.getDisadvantages[CONSTS.ROLL_TYPE_ATTACK][CONSTS.ABILITY_STRENGTH].value).toBeTruthy()
    })
    it('should see target when in dark room with darkvision', function () {
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oSeer.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        oTarget.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        oSeer.applyEffect(oSeer.EffectProcessor.createEffect(CONSTS.EFFECT_DARKVISION), 10)
        expect(oSeer.getCreatureVisibility(oTarget)).toBe(CONSTS.VISIBILITY_VISIBLE)
    })
})

describe('torch-item', function () {
    it('should NOT see in darkroom when using a torch', function () {
        // Avoir une torche dans la mains ne suffit
        const r = new Manager().init()
        const oSeer = r.createEntity('c-soldier')
        const oTarget = r.createEntity('c-soldier')
        oSeer.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        oTarget.store.mutations.setAreaFlags({ flags: [
                CONSTS.AREA_FLAG_DARK
            ] })
        const oTorch = r.createEntity('torch')
        oSeer.store.mutations.equipItem({ item: oTorch })
        expect(oSeer.store.getters.getEquipmentItemPropertySet.has(CONSTS.ITEM_PROPERTY_LIGHT)).toBeTruthy()
        expect(oSeer.getCreatureVisibility(oTarget)).toBe(CONSTS.VISIBILITY_VISIBLE)
    })
})