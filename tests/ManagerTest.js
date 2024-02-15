const { CONFIG } = require('../src/config')
CONFIG.setModuleActive('classic', true)

const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')
const EffectProcessor = require('../src/EffectProcessor')

describe('instanciation', function () {
    it('should instanciate with no error', function () {
        expect(() => {
            const r = new Manager()
            r.init()
        }).not.toThrow()
    })
})

describe('createEntity', function () {
    it('should produce a weapon with a type of "weapon-type-dagger" when creating an entity using a weapon blueprint based on dagger', function () {
        const r = new Manager()
        r.init()
        const w = r.createEntity('wpn-dagger')
        expect(w.weaponType).toBe('weapon-type-dagger')
    })
    it('should produce an armor with a type of "armor-type-leather" when creating an entity using an armor blueprint based on leather armor', function () {
        const r = new Manager()
        r.init()
        const w = r.createEntity('arm-leather')
        expect(w.armorType).toBe('armor-type-leather')
    })
    it('item should have a ref when created by createItem', function () {
        const r = new Manager()
        r.init()
        const w = r.createEntity('arm-leather')
        expect(w.ref).toBe('arm-leather')
    })
})

describe('strike', function () {
    it ('should log an attack when using strike', function () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        c1.name = 'Burnasse'
        const c2 = new Creature()
        c2.assetManager = r.assetManager
        c2.name = 'Mr.X'
        r._defineCreatureEventHandlers(c1)
        const aLog = []
        r.events.on('attack', ({ creature }) => {
            const weapon = creature.store.getters.getSelectedWeapon
            aLog.push(`${creature.name} attacked ${creature.getTarget().name} with ${weapon.ref}`)
        })
        r.events.on('target-distance', ({ creature, value }) => {
            aLog.push(`the distance between ${creature.name} and ${creature.getTarget().name} is ${value}`)
        })
        r.events.on('target-out-of-range', ({ creature, distance, range }) => {
            aLog.push(`${creature.name} could not attack ${creature.getTarget().name} because the distance is too far (distance = ${distance} and range = ${range})`)
        })
        const w = r.createEntity('wpn-longsword')
        c1.equipItem(w)
        c1.setTarget(c2)
        c1.setDistanceToTarget(4)
        c1.attack()
        expect(aLog[aLog.length - 1]).toEqual('Burnasse attacked Mr.X with wpn-longsword')
    })
})

describe('create entity with blueprint', function () {
    it('should create a fully equipped street rogue when creating a c-rogue', function () {
        const r = new Manager()
        r.init()
        const c = r.createEntity('c-rogue')
        expect(c.store.getters.getAbilityValues).toEqual({
          ABILITY_STRENGTH: 11,
          ABILITY_DEXTERITY: 16,
          ABILITY_CONSTITUTION: 12,
          ABILITY_INTELLIGENCE: 10,
          ABILITY_WISDOM: 8,
          ABILITY_CHARISMA: 14
        })
        expect(c.store.getters.getSelectedWeapon.ref).toBe('wpn-shortsword')
        expect(c.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST].ref).toBe('arm-leather')
    })
})

describe('isWeaponProperlyLoaded', function () {
    it('should return true when shortbow and arrow are equipped', function () {
        const r = new Manager()
        r.init()
        const c = r.createEntity('c-rogue')
        const oBow = r.createEntity('wpn-shortbow')
        const oAmmo = r.createEntity('ammo-arrow')
        c.equipItem(oBow)
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeTrue()
    })
    it('should return false when shortbow and bolts are equipped', function () {
        const r = new Manager()
        r.init()
        const c = r.createEntity('c-rogue')
        const oBow = r.createEntity('wpn-shortbow')
        const oAmmo = r.createEntity('ammo-bolt')
        c.equipItem(oBow)
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeFalse()
    })
    it('should return false when short sword equipped with arrows', function () {
        const r = new Manager()
        r.init()
        const c = r.createEntity('c-rogue')
        const oAmmo = r.createEntity('ammo-arrow')
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeFalse()
    })
    it('should return false when shortbow equipped with no ammo', function () {
        const r = new Manager()
        r.init()
        const c = r.createEntity('c-rogue')
        const oBow = r.createEntity('wpn-shortbow')
        c.equipItem(oBow)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeFalse()
    })
})

describe('getSuitableOffensiveSlot', function () {
    describe('when equipped with melee weapon only', function () {
        it('should return melee weapon when target is at melee range', function () {
            const r = new Manager()
            r.init()
            const c = r.createEntity('c-rogue')
            const wm = r.createEntity('wpn-shortsword')
            c.equipItem(wm)
            const t = r.createEntity('c-rogue')
            c.setTarget(t)
            c.setDistanceToTarget(4)
            expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        })
        it('should return null when target is not at melee range', function () {
            const r = new Manager()
            r.init()
            const c = r.createEntity('c-rogue')
            const wm = r.createEntity('wpn-shortsword')
            c.equipItem(wm)
            const t = r.createEntity('c-rogue')
            c.setTarget(t)
            c.setDistanceToTarget(20)
            expect(c.store.getters.getSuitableOffensiveSlot).toBe('')
        })
    })
    describe('when equipped with ranged weapon only', function () {
        describe('when correct ammunition is equipped', function () {
            it('should return ranged weapon when target is at ranged range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wm = r.createEntity('wpn-shortbow')
                const am = r.createEntity('ammo-arrow')
                c.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
                c.equipItem(wm)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(20)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
            })
            it('should return ranged weapon when target is at melee range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wm = r.createEntity('wpn-shortbow')
                const am = r.createEntity('ammo-arrow')
                c.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
                c.equipItem(wm)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(4)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
            })
            it('should return null when target is not at ranged range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wm = r.createEntity('wpn-shortbow')
                const am = r.createEntity('ammo-arrow')
                c.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
                c.equipItem(wm)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(200)
                expect(c.store.getters.getSuitableOffensiveSlot).toBe('')
            })
        })
    })
    describe('when equipped with ranged weapon and melee weapon', function () {
        describe('when correct ammunition is equipped', function () {
            it('should return ranged weapon when target is at ranged range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(20)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
            })
            it('should return melee weapon when target is at melee range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(4)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
            })
            it('should return null when target is not at ranged range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(200)
                expect(c.store.getters.getSuitableOffensiveSlot).toBe('')
            })
        })
    })
    describe('when equipped with ranged weapon, shield and melee weapon', function () {
        describe('when correct ammunition is equipped', function () {
            it('should return null when target is not at melee range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const sh = r.createEntity('arm-shield')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(sh)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(20)
                expect(c.store.getters.getSuitableOffensiveSlot).toBe('')
            })
            it('should return melee weapon when target is at melee range', function () {
                const r = new Manager()
                r.init()
                const c = r.createEntity('c-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const sh = r.createEntity('arm-shield')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(sh)
                c.equipItem(am)
                const t = r.createEntity('c-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(4)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
            })
        })
    })
})

describe('attack outcome disadvantage', function () {
    it('should return disadvantage in attack outcome when fighting at melee distance with ranged weapon', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-rogue')
        const c2 = r.createEntity('c-rogue')
        const wr = r.createEntity('wpn-shortbow')
        const am = r.createEntity('ammo-arrow')
        c1.equipItem(wr)
        c1.equipItem(am)
        const ss = c1.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        c1.setTarget(c2)
        c1.setDistanceToTarget(5)
        const a = c1.attack()
        expect(a.disadvantages).toEqual({ rules: [ 'TARGET_TOO_CLOSE' ], value: true })
        c1.equipItem(ss.previousItem)
        const a2 = c1.attack()
        expect(a2.disadvantages).toEqual({ rules: [], value: false })
    })
})


describe('saving throw bonus effects', function () {
    it('should have a ST bonus in constitution when being fighter', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        expect(c1.store.getters.getSavingThrowBonus).toEqual({
                ABILITY_STRENGTH: 6,
                ABILITY_DEXTERITY: 2,
                ABILITY_CONSTITUTION: 5,
                ABILITY_INTELLIGENCE: 0,
                ABILITY_WISDOM: 1,
                ABILITY_CHARISMA: -1
            }
        )
        // adding a bonus to constitution
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_SAVING_THROW_BONUS, 4, CONSTS.ABILITY_CONSTITUTION), 10)
        expect(c1.store.getters.getSavingThrowBonus).toEqual({
                ABILITY_STRENGTH: 6,
                ABILITY_DEXTERITY: 2,
                ABILITY_CONSTITUTION: 9,
                ABILITY_INTELLIGENCE: 0,
                ABILITY_WISDOM: 1,
                ABILITY_CHARISMA: -1
            }
        )
        // adding a bonus to THREAT_TYPE_POISON
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_SAVING_THROW_BONUS, 3, CONSTS.THREAT_TYPE_POISON), 10)
        expect(c1.store.getters.getSavingThrowBonus).toEqual({
                ABILITY_STRENGTH: 6,
                ABILITY_DEXTERITY: 2,
                ABILITY_CONSTITUTION: 9,
                ABILITY_INTELLIGENCE: 0,
                ABILITY_WISDOM: 1,
                ABILITY_CHARISMA: -1,
                THREAT_TYPE_POISON: 3
            }
        )
    })
    it ('should have +6 saving throw bonus agains mind spell when having +3 vs spell + +3 vs mind spell', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_SAVING_THROW_BONUS, 3, CONSTS.THREAT_TYPE_SPELL), 10)
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_SAVING_THROW_BONUS, 3, CONSTS.THREAT_TYPE_MIND_SPELL), 10)
        c1.dice.cheat(0.000001)
        const roll = c1.rollSavingThrow(CONSTS.ABILITY_WISDOM, [CONSTS.THREAT_TYPE_SPELL, CONSTS.THREAT_TYPE_MIND_SPELL], 1).value
        // bonus : 1 (wis) + 3 (spell) +3 (mind spell) ; roll 1 ; TOTAL: 8
        expect(roll).toBe(8)
    })
})

describe('saving throw advantage and disadvantage on specific threats', function () {
    it('should be advantaged against death on saving throw', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ADVANTAGE, [CONSTS.ROLL_TYPE_SAVE], [CONSTS.THREAT_TYPE_DEATH], 'MEME_PAS_MORT'), 10)
        const cc = c1.getCircumstances(CONSTS.ROLL_TYPE_SAVE, [CONSTS.ABILITY_CONSTITUTION, CONSTS.THREAT_TYPE_DEATH])
        expect(cc).toEqual({
            advantage: true,
            disadvantage: false,
            details: { advantages: [ 'MEME_PAS_MORT' ], disadvantages: [] }
        })
        const cc2 = c1.getCircumstances(CONSTS.ROLL_TYPE_SAVE, [CONSTS.ABILITY_WISDOM, CONSTS.THREAT_TYPE_FEAR])
        expect(cc2).toEqual({
            advantage: false,
            disadvantage: false,
            details: { advantages: [], disadvantages: [] }
        })
    })
})

describe('check skills on additionnal modules like "classic"', function () {
    it('should be advantaged in religion when having specific buff effect', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const circ1 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['skill-religion'])
        expect(circ1).toEqual({
            advantage: false,
            disadvantage: false,
            details: { advantages: [], disadvantages: [] }
        })
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ADVANTAGE, [CONSTS.ROLL_TYPE_CHECK], ['skill-religion'], 'ILLUMINE'), 10)
        const circ2 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['skill-religion'])
        expect(circ2).toEqual({
            advantage: true,
            disadvantage: false,
            details: { advantages: ['ILLUMINE'], disadvantages: [] }
        })
    })
    it('should be advantaged in any dexterity check when having dexterity advantage buff effect', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const circ10 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['skill-sleight-of-hand'])
        expect(circ10).toEqual({
            advantage: false,
            disadvantage: false,
            details: { advantages: [], disadvantages: [] }
        })
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ADVANTAGE, [CONSTS.ROLL_TYPE_CHECK], [CONSTS.ABILITY_DEXTERITY], 'REFLEX'), 10)
        const circ20 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['skill-sleight-of-hand'])
        expect(circ20).toEqual({
            advantage: true,
            disadvantage: false,
            details: { advantages: ['REFLEX'], disadvantages: [] }
        })
    })
})

describe('damage immunity', function () {
    it('should not be damage by fire when having fire immunity', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const w = r.createEntity('wpn-angurvadal')
        c1.equipItem(w)
        const m1 = r.createEntity({
            "entityType": "ENTITY_TYPE_ACTOR",
            "class": "monster",
            "level": 5,
            "abilities": {
                "strength": 8,
                "dexterity": 12,
                "constitution": 12,
                "intelligence": 7,
                "wisdom": 10,
                "charisma": 10
            },
            "size": "CREATURE_SIZE_SMALL",
            "specie": "SPECIE_ELEMENTAL",
            "speed": 30,
            "equipment": [
                {
                    "entityType": "ENTITY_TYPE_ITEM",
                    "itemType": "ITEM_TYPE_NATURAL_WEAPON",
                    "weaponType": "weapon-type-unarmed",
                    "damage": "1d4+1",
                    "damageType": "DAMAGE_TYPE_SLASHING",
                    "attributes": [],
                    "properties": [
                        {
                            "property": "ITEM_PROPERTY_ATTACK_BONUS",
                            "amp": 3,
                        },
                        {
                            "property": "ITEM_PROPERTY_DAMAGE_BONUS",
                            "amp": "1d4",
                            "type": "DAMAGE_TYPE_FIRE"
                        }
                    ]
                },
                {
                    "entityType": "ENTITY_TYPE_ITEM",
                    "itemType": "ITEM_TYPE_ARMOR",
                    "armorType": "armor-type-natural",
                    "properties": [
                        {
                            "property": "ITEM_PROPERTY_DAMAGE_IMMUNITY",
                            "type": "DAMAGE_TYPE_FIRE"
                        },{
                            "property": "ITEM_PROPERTY_DAMAGE_IMMUNITY",
                            "type": "DAMAGE_TYPE_POISON"
                        },{
                            "property": "ITEM_PROPERTY_DAMAGE_VULNERABILITY",
                            "type": "DAMAGE_TYPE_COLD"
                        },{
                            "property": "ITEM_PROPERTY_CONDITION_IMMUNITY",
                            "condition": "CONDITION_POISONED"
                        }, {
                            "property": "ITEM_PROPERTY_SKILL_BONUS",
                            "amp": 3,
                            "skill": "skill-stealth"
                        }
                    ],
                    "material": "MATERIAL_UNKNOWN"
                }
            ]
        })
        expect(m1.store.getters.getDamageMitigation).toEqual({
            DAMAGE_TYPE_FIRE: {
                reduction: 0,
                resistance: false,
                vulnerability: false,
                immunity: true,
                factor: 0
            },
            DAMAGE_TYPE_COLD: { reduction: 0, resistance: false, vulnerability: true, immunity: false, factor: 2 },
            DAMAGE_TYPE_POISON: { reduction: 0, resistance: false, vulnerability: false, immunity: true, factor: 0 }
        })
        expect(m1.store.getters.getHitPoints).toBe(27)
        m1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 5, CONSTS.DAMAGE_TYPE_FIRE))
        expect(m1.store.getters.getHitPoints).toBe(27)
        m1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 5, CONSTS.DAMAGE_TYPE_ACID))
        expect(m1.store.getters.getHitPoints).toBe(22)
        m1.dice.cheat(0.000001)
        expect(m1.rollSkill('skill-stealth', 0)).toEqual({
            bonus: 4,
            roll: 1,
            value: 5,
            ability: 'ABILITY_DEXTERITY',
            dc: 0,
            success: true,
            circumstance: 0
        })
    })
})

describe('damage vulnerability', function () {
    it('should be resistant to slashing weapon damage when not having damage vulnerability', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        r.createEntity('wpn-angurvadal')
        // c1.equipItem(w1)
        const c2 = r.createEntity('c-gargoyle')
        c1.dice.cheat(0.75)
        c1.setTarget(c2)
        c1.setDistanceToTarget(5)
        const atk = c1.attack()
        expect(atk.damages).toEqual({
            amount: 5,
            resisted: { DAMAGE_TYPE_SLASHING: 5 },
            types: { DAMAGE_TYPE_SLASHING: 5 }
        })
    })
    it('should not be resistant to slashing weapon damage when having damage vulnerability to silver', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const w1 = r.createEntity('wpn-silver-dagger')
        const c2 = r.createEntity('c-gargoyle')
        c1.dice.cheat(0.75)
        c1.setTarget(c2)
        c1.setDistanceToTarget(5)
        const atk = c1.attack()
        expect(atk.damages).toEqual({
            amount: 5,
            resisted: { DAMAGE_TYPE_SLASHING: 5 },
            types: { DAMAGE_TYPE_SLASHING: 5 }
        })
        c1.equipItem(w1)
        const atk2 = c1.attack()
        expect(atk2.damages).toEqual({
            amount: 7,
            resisted: { DAMAGE_TYPE_PIERCING: 0 },
            types: { DAMAGE_TYPE_PIERCING: 7 }
        })
    })
})

describe('EffectProcessor Garbage collector', function () {

    function appEff (cTarget, cSource) {
        cTarget.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DUMMY), 10, cSource)
    }

    function createBatch () {
        const r = new Manager()
        r.init()
        const c1 = r.entityFactory.createCreature()
        const c2 = r.entityFactory.createCreature()
        const c3 = r.entityFactory.createCreature()
        const c4 = r.entityFactory.createCreature()
        const c5 = r.entityFactory.createCreature()
        c1.id = 'c1'
        c2.id = 'c2'
        c3.id = 'c3'
        c4.id = 'c4'
        c5.id = 'c5'
        return { c1, c2, c3, c4, c5 }
    }

    it('should remove c2 from c1 sources when applied effects ends', function () {
        const { c1, c2 } = createBatch()
        appEff(c1, c2)
        expect(Object.keys(c1.effectProcessor.creatures).length).toBe(2)
    })
})

describe('obtention d\'information', function () {
    it('should retrieve epee court data when asking for shortsword name in fr', function () {
        const r = new Manager()
        r.init()
        expect(r.assetManager.strings.weaponType['weapon-type-shortsword']).toBe('Epée courte')
    })
    it('should retrieve 1d4 data when asking for shortsword damage output', function () {
        const r = new Manager()
        r.init()
        expect(r.assetManager.data['weapon-type-shortsword'].damage).toBe('1d4')
        r.assetManager.lang = 'en'
        expect(r.assetManager.publicAssets.strings.weaponType['weapon-type-dagger']).toBe('Dagger')
        r.assetManager.lang = 'fr'
        expect(r.assetManager.publicAssets.strings.weaponType['weapon-type-dagger']).toBe('Dague')
    })
})

describe('effect pharma', function () {
    it('should heal 100% more when having pharma effect', function () {
        const r = new Manager()
        r.init()
        const soldier = r.createEntity('c-soldier')
        expect(soldier.store.getters.getHitPoints).toBe(44)
        soldier.store.mutations.damage({ amount: 20 })
        expect(soldier.store.getters.getHitPoints).toBe(24)
        soldier.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_HEAL, 2))
        expect(soldier.store.getters.getHitPoints).toBe(26)
        const m1 = soldier.store.getters.getHealMitigation
        expect(m1).toEqual({
            pharma: false,
            negateheal: false,
            factor: 1
        })
        soldier.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_PHARMA), 10)
        const m2 = soldier.store.getters.getHealMitigation
        expect(m2).toEqual({
            pharma: true,
            negateheal: false,
            factor: 2
        })
        soldier.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_HEAL, 5))
        expect(soldier.store.getters.getHitPoints).toBe(36)
    })
})

describe('Effet de terreur', function () {
    it('should not be able to approach target when frightened by id', function () {
        const r = new Manager()
        r.init()
        const gob1 = r.createEntity('c-goblin-shield')
        const gob2 = r.createEntity('c-goblin-shield')
        r.createEntity('c-goblin-shield')
        gob1.setTarget(gob2)
        gob2.setTarget(gob1)
        gob1.setDistanceToTarget(50)
        expect(gob1.store.getters.canApproachTarget).toBeTrue()
        gob1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_FRIGHTENED), 10, gob2)
        expect(gob1.store.getters.canApproachTarget).toBeFalse()
    })
})

describe('Supprimer une creature', function () {
    it('should remove effects provided by evil creature when evil creature is deleted', function () {
        const r = new Manager()
        r.init()
        const gob1 = r.createEntity('c-goblin-shield')
        gob1.id = 'gob1'
        const gob2 = r.createEntity('c-goblin-shield')
        gob2.id = 'gob2'
        const evilCreature = r.createEntity('c-goblin-shield')
        evilCreature.id = 'evilCreature'
        gob1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_PHARMA), 10, evilCreature)
        gob1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_AC_BONUS, 1), 10, gob2)
        gob1.processEffects()
        gob2.processEffects()
        expect(gob1
            .store
            .getters
            .getEffects
            .map(eff => eff.type)
            .sort((a, b) => a.localeCompare(b))
            .reduce((prev, curr) => [...prev, curr], [])
            .join(' ')
        ).toBe('EFFECT_AC_BONUS EFFECT_PHARMA')
        expect(gob1
            .store
            .getters
            .getEffects
            .filter(eff => eff.source === evilCreature.id)
            .map(eff => eff.type)
            .sort((a, b) => a.localeCompare(b))
            .reduce((prev, curr) => [...prev, curr], [])
            .join(' ')
        ).toBe('EFFECT_PHARMA')
        expect(Object
            .keys(gob1
                .effectProcessor
                .creatures
            )
            .slice(0)
            .sort((a, b) => a.localeCompare(b))
            .join(' ')
        ).toEqual('evilCreature gob1 gob2')
        gob1.effectProcessor.removeCreatureFromRegistry(gob1, evilCreature)
        gob2.effectProcessor.removeCreatureFromRegistry(gob2, evilCreature)
        gob1.processEffects()
        gob2.processEffects()
        expect(gob1
            .store
            .getters
            .getEffects
            .map(eff => eff.type)
            .sort((a, b) => a.localeCompare(b))
            .reduce((prev, curr) => [...prev, curr], [])
            .join(' ')
        ).toBe('EFFECT_AC_BONUS')
        expect(Object
            .keys(gob1
                .effectProcessor
                .creatures
            )
            .slice(0)
            .sort((a, b) => a.localeCompare(b))
            .join(' ')
        ).toEqual('gob1 gob2')
    })
    it('should remove evil creature from registry when no more effect is active', function () {
        const r = new Manager()
        r.init()
        const gob1 = r.createEntity('c-goblin-shield')
        gob1.id = 'gob1'
        const gob2 = r.createEntity('c-goblin-shield')
        gob2.id = 'gob2'
        const evilCreature = r.createEntity('c-goblin-shield')
        evilCreature.id = 'evilCreature'
        gob1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_PHARMA), 2, evilCreature)
        gob1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_AC_BONUS, 1), 10, gob2)
        gob1.processEffects()
        gob2.processEffects()
        expect(Object
            .keys(gob1
                .effectProcessor
                .creatures
            )
            .slice(0)
            .sort((a, b) => a.localeCompare(b))
            .join(' ')
        ).toEqual('evilCreature gob1 gob2')
        gob1.processEffects()
        gob2.processEffects()
        expect(Object
            .keys(gob1
                .effectProcessor
                .creatures
            )
            .slice(0)
            .sort((a, b) => a.localeCompare(b))
            .join(' ')
        ).toEqual('gob1 gob2')
    })
})

describe('import/export creature', function () {
    it('should preserve id in exported state when equipped an item with id', function () {
        const r = new Manager()
        r.init()
        const gob1 = r.createEntity('c-goblin-shield')
        const daggerx = r.createEntity('wpn-dagger')
        daggerx.id = 'daggerx'
        r.addItemProperty(daggerx, CONSTS.ITEM_PROPERTY_ENHANCEMENT, { amp: 1 })
        gob1.equipItem(daggerx)
        gob1.id = 'gob1'
        const s1 = gob1.state
        expect(s1.equipment.EQUIPMENT_SLOT_WEAPON_MELEE.id).toBe('daggerx')
    })
    it('should create a goblin when importing data', function () {
        const r = new Manager()
        r.init()
        const data = {
            id: "gob1",
            name: "gob1",
            ref: "c-goblin-shield",
            abilities: {
                ABILITY_STRENGTH: 15,
                ABILITY_DEXTERITY: 14,
                ABILITY_CONSTITUTION: 14,
                ABILITY_INTELLIGENCE: 12,
                ABILITY_WISDOM: 10,
                ABILITY_CHARISMA: 9
            },
            alignment: {
                entropy: 0,
                morality: 0
            },
            specie: "SPECIE_HUMANOID",
            size: "CREATURE_SIZE_SMALL",
            offensiveSlot: "EQUIPMENT_SLOT_WEAPON_MELEE",
            proficiencies: [],
            speed: 30,
            effects: [],
            classes: [
                {
                    ref: "monster",
                    levels: 2
                }
            ],
            gauges: {
                damage: 0
            },
            recentDamageTypes: {},
            feats: [],
            skills: [],
            equipment: {
                EQUIPMENT_SLOT_HEAD: null,
                EQUIPMENT_SLOT_NECK: null,
                EQUIPMENT_SLOT_CHEST: {
                    properties: [],
                    proficiency: "PROFICIENCY_ARMOR_LIGHT",
                    ac: 11,
                    maxDexterityModifier: false,
                    minStrengthRequired: 0,
                    disadvantageStealth: false,
                    weight: 10,
                    entityType: "ENTITY_TYPE_ITEM",
                    itemType: "ITEM_TYPE_ARMOR",
                    armorType: "armor-type-leather",
                    material: "MATERIAL_LEATHER",
                    ref: "arm-leather",
                    equipmentSlots: [
                        "EQUIPMENT_SLOT_CHEST"
                    ]
                },
                EQUIPMENT_SLOT_BACK: null,
                EQUIPMENT_SLOT_ARMS: null,
                EQUIPMENT_SLOT_WEAPON_MELEE: {
                    properties: [
                        {
                            property: "ITEM_PROPERTY_ENHANCEMENT",
                            amp: 1,
                            data: {}
                        }
                    ],
                    proficiency: "PROFICIENCY_WEAPON_SIMPLE",
                    damage: "1d4",
                    versatileDamage: "",
                    damageType: "DAMAGE_TYPE_PIERCING",
                    weight: 1,
                    attributes: [
                        "WEAPON_ATTRIBUTE_FINESSE",
                        "WEAPON_ATTRIBUTE_LIGHT",
                        "WEAPON_ATTRIBUTE_THROWN"
                    ],
                    entityType: "ENTITY_TYPE_ITEM",
                    itemType: "ITEM_TYPE_WEAPON",
                    weaponType: "weapon-type-dagger",
                    material: "MATERIAL_STEEL",
                    ref: "wpn-dagger",
                    equipmentSlots: [
                        "EQUIPMENT_SLOT_WEAPON_MELEE"
                    ],
                    id: "daggerx"
                },
                EQUIPMENT_SLOT_WEAPON_RANGED: null,
                EQUIPMENT_SLOT_SHIELD: {
                    properties: [],
                    proficiency: "PROFICIENCY_SHIELD",
                    ac: 2,
                    weight: 6,
                    entityType: "ENTITY_TYPE_ITEM",
                    itemType: "ITEM_TYPE_SHIELD",
                    shieldType: "shield-type-heavy",
                    material: "MATERIAL_WOOD",
                    ref: "arm-shield",
                    equipmentSlots: [
                        "EQUIPMENT_SLOT_SHIELD"
                    ]
                },
                EQUIPMENT_SLOT_LEFT_FINGER: null,
                EQUIPMENT_SLOT_RIGHT_FINGER: null,
                EQUIPMENT_SLOT_AMMO: null,
                EQUIPMENT_SLOT_WAIST: null,
                EQUIPMENT_SLOT_FEET: null,
                EQUIPMENT_SLOT_NATURAL_ARMOR: {
                    properties: [
                        {
                            property: "ITEM_PROPERTY_SKILL_BONUS",
                            amp: 2,
                            data: {
                                skill: "skill-stealth"
                            }
                        }
                    ],
                    proficiency: "",
                    ac: 10,
                    maxDexterityModifier: false,
                    minStrengthRequired: 0,
                    disadvantageStealth: false,
                    weight: 0,
                    entityType: "ENTITY_TYPE_ITEM",
                    itemType: "ITEM_TYPE_NATURAL_ARMOR",
                    armorType: "armor-type-natural",
                    material: "MATERIAL_UNKNOWN",
                    ref: "narm-c-goblin-shield",
                    equipmentSlots: [
                        "EQUIPMENT_SLOT_NATURAL_ARMOR"
                    ]
                },
                EQUIPMENT_SLOT_NATURAL_WEAPON: {
                    properties: [],
                    proficiency: "PROFICIENCY_WEAPON_UNARMED",
                    damage: "1",
                    versatileDamage: "",
                    damageType: "DAMAGE_TYPE_CRUSHING",
                    weight: 0,
                    attributes: [],
                    entityType: "ENTITY_TYPE_ITEM",
                    itemType: "ITEM_TYPE_NATURAL_WEAPON",
                    weaponType: "weapon-type-unarmed",
                    material: "",
                    ref: "nwpn-unarmed-strike",
                    equipmentSlots: [
                        "EQUIPMENT_SLOT_NATURAL_WEAPON"
                    ]
                }
            },
            counters: {},
            encumbrance: 0
        }
        const gob = r.importCreature(data)
        expect(gob.name).toBe('gob1')
        expect(gob.id).toBe('gob1')
        expect(gob.store.getters.getLevel).toBe(2)
    })
})

describe('bug anneau perspicacité not affecting intelligence', function () {
    it('should add +1 int when equipping ring of clear thought', function () {
        const PLAYER_BASE_BLUEPRINT = {
            "entityType": "ENTITY_TYPE_ACTOR",
            "class": "tourist",
            "level": 1,
            "abilities": {
                "strength": 10,
                "dexterity": 10,
                "constitution": 10,
                "intelligence": 10,
                "wisdom": 10,
                "charisma": 10
            },
            "size": "CREATURE_SIZE_MEDIUM",
            "specie": "SPECIE_HUMANOID",
            "speed": 30,
            "equipment": []
        }
        const r = new Manager()
        r.init()
        const tourist = r.createEntity(PLAYER_BASE_BLUEPRINT)
        const ring = r.createEntity('ring-clear-thought')
        expect(tourist.store.getters.getAbilityValues[CONSTS.ABILITY_INTELLIGENCE]).toBe(10)
        tourist.equipItem(ring)
        expect(tourist.store.getters.getAbilityBonus[CONSTS.ABILITY_INTELLIGENCE]).toBe(1)
        expect(tourist.store.getters.getAbilityValues[CONSTS.ABILITY_INTELLIGENCE]).toBe(11)
    })
})

describe('Bug: les évènements fonctionnent ils ?', function () {
    it('should fire attack event when 2 melee creatures fight from afar', function () {
        const r = new Manager()
        r.init()
        const aEvents = []
        const aCreatureEvents = []
        r.events.on('attack', ({ creature, outcome }) => {
            aEvents.push({ type: 'attack', creature, outcome })
        })
        const g1 = r.createEntity('c-goblin-shield')
        const g2 = r.createEntity('c-goblin-shield')
        g1.events.on('attack', ({ creature, outcome }) => {
            aCreatureEvents.push({ type: 'attack', creature, outcome })
        })

        g1.attack(g2)

        expect(aCreatureEvents).toHaveSize(1)
        expect(aEvents).toHaveSize(1)
    })
    it('should fire event when custom blueprint creature attacks', function () {
        const PLAYER_BASE_BLUEPRINT = {
            "entityType": "ENTITY_TYPE_ACTOR",
            "class": "tourist",
            "level": 1,
            "abilities": {
                "strength": 10,
                "dexterity": 10,
                "constitution": 10,
                "intelligence": 10,
                "wisdom": 10,
                "charisma": 10
            },
            "size": "CREATURE_SIZE_MEDIUM",
            "specie": "SPECIE_HUMANOID",
            "speed": 30,
            "equipment": []
        }
        const r = new Manager()
        r.init()
        const aEvents = []
        const aCreatureEvents = []
        r.events.on('attack', ({ creature, outcome }) => {
            aEvents.push({ type: 'attack', creature, outcome })
        })
        const g1 = r.createEntity('c-goblin-shield')
        const p1 = r.createEntity(PLAYER_BASE_BLUEPRINT)
        p1.name = 'p1'

        p1.events.on('attack', ({ creature, outcome }) => {
            aCreatureEvents.push({ type: 'attack', creature, outcome })
        })

        p1.attack(g1)

        expect(aCreatureEvents).toHaveSize(1)
        expect(aEvents).toHaveSize(1)

    })
})


describe('getArmorClassDetail', function () {
    it('should show armor class detail', function () {
        const r = new Manager()
        r.init()
        const g = r.createEntity('c-goblin-shield')
        expect(g.store.getters.getArmorClassDetails).toEqual({
            [CONSTS.ARMOR_DEFLECTOR_ARMOR]: 11,
            [CONSTS.ARMOR_DEFLECTOR_SHIELD]: 2,
            [CONSTS.ARMOR_DEFLECTOR_DEXTERITY]: 2,
            [CONSTS.ARMOR_DEFLECTOR_PROPERTIES]: 0,
            [CONSTS.ARMOR_DEFLECTOR_EFFECTS]: 0
        })
        expect(g.store.getters.getArmorClassRanges).toEqual([
            { type: CONSTS.ARMOR_DEFLECTOR_MISS, min: -Infinity, max: 10, value: 0 },
            { type: CONSTS.ARMOR_DEFLECTOR_DEXTERITY, min: 11, max: 12, value: 2 },
            { type: CONSTS.ARMOR_DEFLECTOR_SHIELD, min: 13, max: 14, value: 2 },
            { type: CONSTS.ARMOR_DEFLECTOR_ARMOR, min: 15, max: 15, value: 1 }
        ])
        expect(g.getDeflectingArmorPart(-10).type).toBe(CONSTS.ARMOR_DEFLECTOR_MISS)
        expect(g.getDeflectingArmorPart(10).type).toBe(CONSTS.ARMOR_DEFLECTOR_MISS)
        expect(g.getDeflectingArmorPart(11).type).toBe(CONSTS.ARMOR_DEFLECTOR_DEXTERITY)
        expect(g.getDeflectingArmorPart(12).type).toBe(CONSTS.ARMOR_DEFLECTOR_DEXTERITY)
        expect(g.getDeflectingArmorPart(13).type).toBe(CONSTS.ARMOR_DEFLECTOR_SHIELD)
        expect(g.getDeflectingArmorPart(14).type).toBe(CONSTS.ARMOR_DEFLECTOR_SHIELD)
        expect(g.getDeflectingArmorPart(15).type).toBe(CONSTS.ARMOR_DEFLECTOR_ARMOR)
        expect(g.getDeflectingArmorPart(16).type).toBe(CONSTS.ARMOR_DEFLECTOR_HIT)
    })
})

