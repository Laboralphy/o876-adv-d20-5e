const Rules = require('../src/Rules')
const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')

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
