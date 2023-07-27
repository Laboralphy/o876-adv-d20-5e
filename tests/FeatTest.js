const Creature = require('../src/Creature')
const Manager = require('../src/Manager')
const CONSTS = require('../src/consts')
const AssetManager = require("../src/AssetManager");

beforeAll(function () {
    Error.stackTraceLimit = Infinity
    const am = new AssetManager()
    am.init()
    Creature.AssetManager = am
})

describe('feat-fighting-style-archery', function () {
    it ('should be declared in external data when instantiating new creature', function () {
        const c = new Creature()
        expect('feat-fighting-style-archery' in c.store.externals.data).toBeTrue()
    })
    it ('should give a report that shows a +2 attack bonus to be activated when having this feat', function () {
        const c = new Creature()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-archery'})
        const aFeatReport = c.store.getters.getFeatReport
        expect(aFeatReport).toEqual([{
            feat: 'feat-fighting-style-archery',
            active: false,
            shouldBeActive: true
        }])
    })
    it ('should activate a +2 ranged attack bonus when applying feat', function () {
        const c = new Creature()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-archery'})
        c.store.mutations.updateFeatEffects()
        const aFeatReport = c.store.getters.getFeatReport
        expect(aFeatReport).toEqual([{
            feat: 'feat-fighting-style-archery',
            active: true,
            shouldBeActive: true
        }])
    })
})

describe('feat-fighting-style-defense', function () {
    it ('should not have +1 AC when having feat and not wearing armor', function () {
        const c = new Creature()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-defense'})
        c.store.mutations.updateFeatEffects()
        expect(c.store.getters.getFeatReport).toEqual([{
            feat: 'feat-fighting-style-defense',
            active: false,
            shouldBeActive: false
        }])
        expect(c.store.getters.getArmorClass).toBe(-5)
    })
    it ('should have +1 AC when having feat and wearing armor', function () {
        const c = new Creature()
        const r = new Manager()
        r.init()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-defense'})
        c.store.mutations.updateFeatEffects()
        const oArmor = r.createEntity('arm-leather')
        expect(c.store.getters.getArmorClass).toBe(-5) // 0 (no armor) -5 (dex 0)
        c.store.mutations.equipItem({ item: oArmor, slot: CONSTS.EQUIPMENT_SLOT_CHEST })
        expect(c.store.getters.getFeatReport).toEqual([{
            feat: 'feat-fighting-style-defense',
            active: false,
            shouldBeActive: true
        }])
        c.store.mutations.updateFeatEffects()
        expect(c.store.getters.getFeatReport).toEqual([{
            feat: 'feat-fighting-style-defense',
            active: true,
            shouldBeActive: true
        }])
        expect(c.store.getters.getArmorClass).toBe(7) // 11 (armor) +1 (feat) -5 (dex 0)
    })
})

describe('feat-fighting-style-dueling', function () {
    it('should have a bonus damage +2 when wield one longsword and no shield', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        const r = new Manager()
        r.init()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-dueling'})
        const oSword = r.createEntity('wpn-shortsword')
        const oDagger = r.createEntity('wpn-dagger')
        const oStaff = r.createEntity('wpn-quaterstaff')
        r.createEntity('arm-shield');
        r.createEntity('arm-leather');
        c.store.mutations.equipItem({ item: oSword })
        c.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        expect(c.store.getters.has1HWeaponNoShield).toBeTrue()
        expect(c.store.getters.getSelectedWeapon).toBeDefined()
        c.store.mutations.updateFeatEffects()
        expect(c.getDamageBonus()).toEqual({ DAMAGE_TYPE_SLASHING: 2 })
        c.store.mutations.equipItem({ item: oDagger })
        c.store.mutations.updateFeatEffects()
        expect(c.getDamageBonus()).toEqual({ DAMAGE_TYPE_PIERCING: 2 })
        c.store.mutations.equipItem({ item: oStaff })
        c.store.mutations.updateFeatEffects()
        expect(c.store.getters.has1HWeaponNoShield).toBeFalse()
        expect(c.getDamageBonus()).toEqual({ DAMAGE_TYPE_CRUSHING: 0 })
    })
})

describe('feat-fighting-style-great-weapon', function() {
    it('should have 5 attack bonus instead of 3 only when using great or versatile weapon', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 16 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        const r = new Manager()
        r.init()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-great-weapon'})
        const oStaff = r.createEntity('wpn-quaterstaff')
        const oDagger = r.createEntity('wpn-dagger')
        c.store.mutations.equipItem({ item: oDagger })
        c.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
        c.store.mutations.updateFeatEffects()
        expect(c.getDamageBonus()).toEqual({ DAMAGE_TYPE_PIERCING: 3 })
        c.store.mutations.equipItem({ item: oStaff })
        c.store.mutations.updateFeatEffects()
        // Pour calculer les bonus de dégât on liste les effets de bonus
        // certains effets ont des getters en amp
        // ces getters ont besoin d'obtenir la liste des effets
        // ces effets ont des getters...
        expect(c.getDamageBonus()).toEqual({ DAMAGE_TYPE_CRUSHING: 3 })
        expect(c.aggregateModifiers([CONSTS.EFFECT_REROLL]).sum).toEqual(2)
    })
})

describe('feat-second-wind', function () {
    it('should heal hp when used', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        const r = new Manager()
        r.init()
        c.store.mutations.addFeat({ feat: 'feat-second-wind'})
        c.store.mutations.addClass({ ref: 'fighter', levels: 5 })
        c.store.mutations.updateFeatEffects()
        // 10 + 6 * 4 // 34
        expect(c.store.getters.getMaxHitPoints).toBe(34)
        expect(c.store.getters.getHitPoints).toBe(34)
        c.store.mutations.setHitPoints({ value: 34 - 1 })
        expect(c.store.getters.getHitPoints).toBe(1)
        c.dice.cheat(0.999999)
        c.featAction('feat-second-wind')
        expect(c.store.getters.getHitPoints).toBe(1 + 10 + 5)
    })
})
