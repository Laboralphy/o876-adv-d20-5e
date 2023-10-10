const Manager = require('../src/Manager')
const { CONFIG } = require('../src/config')
const CONSTS = require('../src/consts')

CONFIG.setModuleActive('classic', true)

describe('resetCharacter', function () {
    it('should reset character', function () {
        const r = new Manager()
        r.init()
        const t = r.createEntity('c-soldier')
        expect(t.store.getters.getLevel).toBe(5)
        t.store.mutations.resetCharacter()
        expect(t.store.getters.getLevel).toBe(0)
    })
})