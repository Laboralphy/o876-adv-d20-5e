const Rules = require('../src/Rules')
const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')
const EffectProcessor = require('../src/EffectProcessor')

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
        r.defineCreatureEventHandlers(c1)
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
    it('should create a fully equipped street rogue when creating a c-street-rogue', function () {
        const r = new Rules()
        r.init()
        const c = r.createEntity('c-street-rogue')
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
        const c = r.createEntity('c-street-rogue')
        const oBow = r.createEntity('wpn-shortbow')
        const oAmmo = r.createEntity('ammo-arrow')
        c.equipItem(oBow)
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeTrue()
    })
    it('should return false when shortbow and bolts are equipped', function () {
        const r = new Rules()
        r.init()
        const c = r.createEntity('c-street-rogue')
        const oBow = r.createEntity('wpn-shortbow')
        const oAmmo = r.createEntity('ammo-bolt')
        c.equipItem(oBow)
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeFalse()
    })
    it('should return false when short sword equipped with arrows', function () {
        const r = new Rules()
        r.init()
        const c = r.createEntity('c-street-rogue')
        const oAmmo = r.createEntity('ammo-arrow')
        c.equipItem(oAmmo)
        expect(c.store.getters.isRangedWeaponProperlyLoaded).toBeFalse()
    })
    it('should return false when shortbow equipped with no ammo', function () {
        const r = new Rules()
        r.init()
        const c = r.createEntity('c-street-rogue')
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
            const c = r.createEntity('c-street-rogue')
            const wm = r.createEntity('wpn-shortsword')
            c.equipItem(wm)
            const t = r.createEntity('c-street-rogue')
            c.setTarget(t)
            c.setDistanceToTarget(4)
            expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        })
        it('should return null when target is not at melee range', function () {
            const r = new Rules()
            r.init()
            const c = r.createEntity('c-street-rogue')
            const wm = r.createEntity('wpn-shortsword')
            c.equipItem(wm)
            const t = r.createEntity('c-street-rogue')
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
                const c = r.createEntity('c-street-rogue')
                const wm = r.createEntity('wpn-shortbow')
                const am = r.createEntity('ammo-arrow')
                c.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
                c.equipItem(wm)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(20)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
            })
            it('should return ranged weapon when target is at melee range', function () {
                const r = new Rules()
                r.init()
                const c = r.createEntity('c-street-rogue')
                const wm = r.createEntity('wpn-shortbow')
                const am = r.createEntity('ammo-arrow')
                c.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
                c.equipItem(wm)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(4)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
            })
            it('should return null when target is not at ranged range', function () {
                const r = new Rules()
                r.init()
                const c = r.createEntity('c-street-rogue')
                const wm = r.createEntity('wpn-shortbow')
                const am = r.createEntity('ammo-arrow')
                c.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
                c.equipItem(wm)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
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
                const c = r.createEntity('c-street-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(20)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
            })
            it('should return melee weapon when target is at melee range', function () {
                const r = new Rules()
                r.init()
                const c = r.createEntity('c-street-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(4)
                expect(c.store.getters.getSuitableOffensiveSlot).toEqual(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
            })
            it('should return null when target is not at ranged range', function () {
                const r = new Rules()
                r.init()
                const c = r.createEntity('c-street-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
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
                const c = r.createEntity('c-street-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const sh = r.createEntity('arm-shield')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(sh)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
                c.setTarget(t)
                c.setDistanceToTarget(20)
                expect(c.store.getters.getSuitableOffensiveSlot).toBe('')
            })
            it('should return melee weapon when target is at melee range', function () {
                const r = new Rules()
                r.init()
                const c = r.createEntity('c-street-rogue')
                const wr = r.createEntity('wpn-shortbow')
                const wm = r.createEntity('wpn-shortsword')
                const sh = r.createEntity('arm-shield')
                const am = r.createEntity('ammo-arrow')
                c.equipItem(wm)
                c.equipItem(wr)
                c.equipItem(sh)
                c.equipItem(am)
                const t = r.createEntity('c-street-rogue')
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
        const c1 = r.createEntity('c-street-rogue')
        const c2 = r.createEntity('c-street-rogue')
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
        const roll = c1.rollSavingThrow(CONSTS.ABILITY_WISDOM, [CONSTS.THREAT_TYPE_SPELL, CONSTS.THREAT_TYPE_MIND_SPELL])
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
        console.log(r.assetManager.data['skill-religion'])
    })
})
