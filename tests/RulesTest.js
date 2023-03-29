const Rules = require('../src/Rules')
const Creature = require('../src/Creature')

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
        r.events.on('attack', ({ attacker, attacked, attack, weapon, ammo }) => {
            aLog.push(`${attacker.name} attacked ${attacked.name} with ${weapon.ref}`)
        })
        const w = r.createEntity('wpn-longsword')
        c1.equipItem(w)
        c1.setDistanceToTarget(4)
        r.strike(c1, c2)
        expect(aLog).toEqual(['Burnasse attacked Mr.X with wpn-longsword'])
    })
})
