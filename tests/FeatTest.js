const Creature = require('../src/Creature')
const Rules = require('../src/Rules')
const EffectProcessor = require('../src/EffectProcessor')
const CONSTS = require('../src/consts')
const { warmup } = require('../src/assets')

beforeEach(function () {
    warmup()
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
        expect(c.getAC()).toBe(-5)
    })
    it ('should have +1 AC when having feat and wearing armor', function () {
        const c = new Creature()
        const r = new Rules()
        r.init()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-defense'})
        c.store.mutations.updateFeatEffects()
        const oArmor = r.createEntity('arm-leather')
        expect(c.getAC()).toBe(-5) // 0 (no armor) -5 (dex 0)
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
        expect(c.getAC()).toBe(7) // 11 (armor) +1 (feat) -5 (dex 0)
    })
})

describe('feat-fighting-style-dueling', function () {
    it('should have a bonus damage +2 when wield one longsword and no shield', function () {
        const c = new Creature()
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: 10 })
        c.store.mutations.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: 10 })
        const r = new Rules()
        r.init()
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-dueling'})
        const oSword = r.createEntity('wpn-shortsword')
        const oDagger = r.createEntity('wpn-dagger')
        const oStaff = r.createEntity('wpn-quaterstaff')
        const oShield = r.createEntity('arm-shield')
        const oArmor = r.createEntity('arm-leather')
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