const Rules = require('../src/Rules')
const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')
const EffectProcessor = require('../src/EffectProcessor')
const IP = require('../src/item-properties')

describe('instanciation', function () {
    it('should instanciate with no error', function () {
        expect(() => {
            const r = new Rules()
            r.init()
        }).not.toThrow()
    })
})

describe('createEntity', function () {
    it('should produce a weapon with a type of "weapon-type-dagger" when creating an entity using a weapon blueprint based on dagger', function () {
        const r = new Rules()
        r.init()
        const w = r.createEntity('wpn-dagger')
        expect(w.weaponType).toBe('weapon-type-dagger')
    })
    it('should produce an armor with a type of "armor-type-leather" when creating an entity using an armor blueprint based on leather armor', function () {
        const r = new Rules()
        r.init()
        const w = r.createEntity('arm-leather')
        expect(w.armorType).toBe('armor-type-leather')
    })
    it('item should have a ref when created by createItem', function () {
        const r = new Rules()
        r.init()
        const w = r.createEntity('arm-leather')
        expect(w.ref).toBe('arm-leather')
    })
})

describe('strike', function () {
    it ('should log an attack when using strike', function () {
        const r = new Rules()
        r.init()
        const c1 = new Creature()
        c1.name = 'Burnasse'
        const c2 = new Creature()
        c2.name = 'Mr.X'
        r._defineCreatureEventHandlers(c1)
        const aLog = []
        r.events.on('attack', ({ creature, attack }) => {
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
        r.attack(c1)
        expect(aLog[aLog.length - 1]).toEqual('Burnasse attacked Mr.X with wpn-longsword')
    })
})

describe('create entity with blueprint', function () {
    it('should create a fully equipped street rogue when creating a c-rogue', function () {
        const r = new Rules()
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
        const r = new Rules()
        r.init()
        const c = r.createEntity('c-rogue')
        const oBow = r.createEntity('wpn-shortbow')
        const oAmmo = r.createEntity('ammo-arrow')
        c.equipItem(oBow)
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeTrue()
    })
    it('should return false when shortbow and bolts are equipped', function () {
        const r = new Rules()
        r.init()
        const c = r.createEntity('c-rogue')
        const oBow = r.createEntity('wpn-shortbow')
        const oAmmo = r.createEntity('ammo-bolt')
        c.equipItem(oBow)
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeFalse()
    })
    it('should return false when short sword equipped with arrows', function () {
        const r = new Rules()
        r.init()
        const c = r.createEntity('c-rogue')
        const oAmmo = r.createEntity('ammo-arrow')
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeFalse()
    })
    it('should return false when shortbow equipped with no ammo', function () {
        const r = new Rules()
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
            const r = new Rules()
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
            const r = new Rules()
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
                const r = new Rules()
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
                const r = new Rules()
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
                const r = new Rules()
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
                const r = new Rules()
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
                const r = new Rules()
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
                const r = new Rules()
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
                const r = new Rules()
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
                const r = new Rules()
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
        const r = new Rules()
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
        const a = r.attack(c1)
        expect(a.disadvantages).toEqual({ rules: [ 'TARGET_TOO_CLOSE' ], value: true })
        c1.equipItem(ss)
        const a2 = r.attack(c1)
        expect(a2.disadvantages).toEqual({ rules: [], value: false })
    })
})


describe('saving throw bonus effects', function () {
    it('should have a ST bonus in constitution when being fighter', function () {
        const r = new Rules()
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
        const r = new Rules()
        r.init()
        const c1 = r.createEntity('c-soldier')
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_SAVING_THROW_BONUS, 3, CONSTS.THREAT_TYPE_SPELL), 10)
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_SAVING_THROW_BONUS, 3, CONSTS.THREAT_TYPE_MIND_SPELL), 10)
        c1.dice.debug(true, 0.000001)
        const roll = c1.rollSavingThrow(CONSTS.ABILITY_WISDOM, [CONSTS.THREAT_TYPE_SPELL, CONSTS.THREAT_TYPE_MIND_SPELL], 1).value
        // bonus : 1 (wis) + 3 (spell) +3 (mind spell) ; roll 1 ; TOTAL: 8
        expect(roll).toBe(8)
    })
})

describe('saving throw advantage and disadvantage on specific threats', function () {
    it('should be advantaged against death on saving throw', function () {
        const r = new Rules()
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
        const r = new Rules()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const circ1 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['SKILL_RELIGION'])
        expect(circ1).toEqual({
            advantage: false,
            disadvantage: false,
            details: { advantages: [], disadvantages: [] }
        })
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ADVANTAGE, [CONSTS.ROLL_TYPE_CHECK], ['SKILL_RELIGION'], 'ILLUMINE'), 10)
        const circ2 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['SKILL_RELIGION'])
        expect(circ2).toEqual({
            advantage: true,
            disadvantage: false,
            details: { advantages: ['ILLUMINE'], disadvantages: [] }
        })
    })
    it('should be advantaged in any dexterity check when having dexterity advantage buff effect', function () {
        const r = new Rules()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const circ10 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['SKILL_UNLOCK'])
        expect(circ10).toEqual({
            advantage: false,
            disadvantage: false,
            details: { advantages: [], disadvantages: [] }
        })
        c1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_ADVANTAGE, [CONSTS.ROLL_TYPE_CHECK], [CONSTS.ABILITY_DEXTERITY], 'REFLEX'), 10)
        const circ20 = c1.getCircumstances(CONSTS.ROLL_TYPE_CHECK, ['SKILL_UNLOCK'])
        expect(circ20).toEqual({
            advantage: true,
            disadvantage: false,
            details: { advantages: ['REFLEX'], disadvantages: [] }
        })
    })
})

describe('damage immunity', function () {
    it('should not be damage by fire when having fire immunity', function () {
        const r = new Rules()
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
            "size": "small",
            "specie": "elemental",
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
                            "skill": "SKILL_STEALTH"
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
        const eDamF = m1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 5, CONSTS.DAMAGE_TYPE_FIRE))
        expect(m1.store.getters.getHitPoints).toBe(27)
        const eDamC = m1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 5, CONSTS.DAMAGE_TYPE_ACID))
        expect(m1.store.getters.getHitPoints).toBe(22)
        m1.dice.debug(true, 0.000001)
        expect(m1.rollSkill('SKILL_STEALTH')).toEqual({
            bonus: 4,
            roll: 1,
            value: 5,
            ability: 'ABILITY_DEXTERITY',
            dc: undefined,
            success: undefined,
            circumstance: 0
        })
    })
})

describe('damage vulnerability', function () {
    it('should be resistant to slashing weapon damage when not having damage vulnerability', function () {
        const r = new Rules()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const w1 = r.createEntity('wpn-angurvadal')
        // c1.equipItem(w1)
        const c2 = r.createEntity('c-gargoyle')
        c1.dice.debug(true, 0.75)
        c1.setTarget(c2)
        c1.setDistanceToTarget(5)
        const atk = r.attack(c1)
        expect(atk.damages).toEqual({
            amount: 5,
            resisted: { DAMAGE_TYPE_SLASHING: 5 },
            types: { DAMAGE_TYPE_SLASHING: 5 }
        })
    })
    it('should not be resistant to slashing weapon damage when having damage vulnerability to silver', function () {
        const r = new Rules()
        r.init()
        const c1 = r.createEntity('c-soldier')
        const w1 = r.createEntity('wpn-silver-dagger')
        const c2 = r.createEntity('c-gargoyle')
        c1.dice.debug(true, 0.75)
        c1.setTarget(c2)
        c1.setDistanceToTarget(5)
        const atk = r.attack(c1)
        expect(atk.damages).toEqual({
            amount: 5,
            resisted: { DAMAGE_TYPE_SLASHING: 5 },
            types: { DAMAGE_TYPE_SLASHING: 5 }
        })
        c1.equipItem(w1)
        const atk2 = r.attack(c1)
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
        const c1 = new Creature()
        const c2 = new Creature()
        const c3 = new Creature()
        const c4 = new Creature()
        const c5 = new Creature()
        c1.id = 'c1'
        c2.id = 'c2'
        c3.id = 'c3'
        c4.id = 'c4'
        c5.id = 'c5'
        return { c1, c2, c3, c4, c5 }
    }

    it('should remove c2 from c1 sources when applied effects ends', function () {
        const { c1, c2, c3, c4, c5 } = createBatch()
        appEff(c1, c2)
        expect(Object.keys(c1.effectProcessor.creatures).length).toBe(2)
    })
})

describe('obtention d\'information', function () {
    it('should retrieve epee court data when asking for shortsword name in fr', function () {
        const r = new Rules()
        r.init()
        expect(r.assetManager.strings.weaponType['weapon-type-shortsword']).toBe('Epée courte')
    })
    it('should retrieve 1d4 data when asking for shortsword damage output', function () {
        const r = new Rules()
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
        const r = new Rules()
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
            factor: 1
        })
        soldier.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_PHARMA), 10)
        const m2 = soldier.store.getters.getHealMitigation
        expect(m2).toEqual({
            pharma: true,
            factor: 2
        })
        soldier.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_HEAL, 5))
        expect(soldier.store.getters.getHitPoints).toBe(36)
    })
})

describe('Troll regeneration', function () {
    it('should regain 10 hp when wounded by non acid weapon', function () {
        const r = new Rules()
        r.init()
        const troll = r.createEntity('c-troll')
        expect(troll.store.getters.getHitPoints).toBe(92)
        troll.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(troll.store.getters.getHitPoints).toBe(72)
        troll.processEffects()
        expect(troll.store.getters.getHitPoints).toBe(82)

        troll.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_FIRE))
        expect(troll.store.getters.getHitPoints).toBe(62)
        troll.processEffects()
        expect(troll.store.getters.getHitPoints).toBe(62)

        troll.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(troll.store.getters.getHitPoints).toBe(42)
        troll.processEffects()
        expect(troll.store.getters.getHitPoints).toBe(52)
    })

    it('should have a max damage of 2d8 instead of 1d8 when having greatclub', function () {
        const r = new Rules()
        r.init()
        const ogre = r.createEntity('c-ogre')
        ogre.dice.debug(true, 0)
        const minDamages = ogre.rollWeaponDamage()
        ogre.dice.debug(true, 0.999999)
        const maxDamages = ogre.rollWeaponDamage()
        expect(maxDamages.DAMAGE_TYPE_CRUSHING).toBe(20)
        expect(minDamages.DAMAGE_TYPE_CRUSHING).toBe(6)
    })
})

describe('Ogre', function () {
    it('should have a max damage of 2d8+4 instead of 1d8+4 when having greatclub', function () {
        const r = new Rules()
        r.init()
        const ogre = r.createEntity('c-ogre')
        ogre.dice.debug(true, 0)
        const minDamages = ogre.rollWeaponDamage()
        ogre.dice.debug(true, 0.999999)
        const maxDamages = ogre.rollWeaponDamage()
        expect(maxDamages.DAMAGE_TYPE_CRUSHING).toBe(20)
        expect(minDamages.DAMAGE_TYPE_CRUSHING).toBe(6)
    })
})

describe('Ghast', function () {
    it('should apply paralyzed condition', function () {
        const r = new Rules()
        r.init()
        const ghast = r.createEntity('c-ghast')
        ghast.dice.debug(true, 0.75)
        const goblin = r.createEntity('c-goblin-bow')
        goblin.dice.debug(true, 0.0)
        ghast.setTarget(goblin)
        ghast.setDistanceToTarget(4.5)
        const atk1 = r.attack(ghast, goblin)
        expect(goblin.store.getters.getConditions.has(CONSTS.CONDITION_PARALYZED)).toBeTrue()
        ghast.processEffects()
        goblin.processEffects()
        const atk2 = r.attack(ghast, goblin)
        expect(goblin.store.getters.getConditions.has(CONSTS.CONDITION_PARALYZED)).toBeTrue()
        expect(atk2.dice).toBe(16)
        expect(ghast.store.getters.isTargetInMeleeWeaponRange).toBeTrue()
        expect(goblin.store.getters.getConditions.has(CONSTS.CONDITION_PARALYZED)).toBeTrue()
        expect(goblin.store.getters.getConditions.has(CONSTS.CONDITION_UNCONSCIOUS)).toBeFalse()
        expect(ghast.store.getters.isTargetAutoCritical).toBeTrue()
        expect(atk2.critical).toBeTrue()
        ghast.processEffects()
        goblin.processEffects()
        expect(goblin.store.getters.getConditions.has(CONSTS.CONDITION_PARALYZED)).toBeFalse()
    })
    it('should be poisonned when approachin ghast within 5 ft', function () {
        const r = new Rules()
        r.init()
        const ghast = r.createEntity('c-ghast')
        ghast.dice.debug(true, 0.75)
        const gobVeryFar = r.createEntity('c-goblin-bow')
        gobVeryFar.dice.debug(true, 0.0)
        const gobJinxed = r.createEntity('c-goblin-shield')
        gobJinxed.dice.debug(true, 0.0)
        const gobLucky = r.createEntity('c-goblin-shield')
        gobLucky.dice.debug(true, 0.999)
        gobVeryFar.setTarget(ghast)
        gobJinxed.setTarget(ghast)
        gobLucky.setTarget(ghast)
        gobVeryFar.setDistanceToTarget(60)
        gobJinxed.setDistanceToTarget(5)
        gobLucky.setDistanceToTarget(5)
        ghast.processEffects()
        gobVeryFar.processEffects()
        gobJinxed.processEffects()
        gobLucky.processEffects()
        expect(gobVeryFar.store.getters.getConditions.has(CONSTS.CONDITION_POISONED)).toBeFalse()
        expect(gobJinxed.store.getters.getConditions.has(CONSTS.CONDITION_POISONED)).toBeTrue()
        expect(gobLucky.store.getters.getConditions.has(CONSTS.CONDITION_POISONED)).toBeFalse()
    })
})

describe('Effet de terreur', function () {
    it('should not be able to approach target when frightened by id', function () {
        const r = new Rules()
        r.init()
        const gob1 = r.createEntity('c-goblin-shield')
        const gob2 = r.createEntity('c-goblin-shield')
        const gob3 = r.createEntity('c-goblin-shield')
        gob1.setTarget(gob2)
        gob2.setTarget(gob1)
        gob1.setDistanceToTarget(50)
        expect(gob1.store.getters.canApproachTarget).toBeTrue()
        gob1.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_FRIGHTENED), 10, gob2)
        expect(gob1.store.getters.canApproachTarget).toBeFalse()
    })
})