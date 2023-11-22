const Magic = require('../src/magic/Magic')
const Spell = require('../src/magic/Spell')



describe('addSpell', function () {
    it('should have one spell stored when adding one spell', function () {
        const m = new Magic()
        const s1 = new Spell({
            id: 's1',
            name: 'The Heavenly Screen',
            level: 1
        })
        expect(m.spells.size).toBe(0)
        m.addSpell(s1)
        expect(m.spells.size).toBe(1)
    })

    it('should have one spell stored when adding one spell', function () {
        const m = new Magic()
        const s1 = new Spell({
            id: 's1',
            name: 'The Heavenly Screen',
            level: 1
        })
        expect(m.spells.size).toBe(0)
        m.addSpell(s1)
        expect(m.spells.size).toBe(1)
    })
})
