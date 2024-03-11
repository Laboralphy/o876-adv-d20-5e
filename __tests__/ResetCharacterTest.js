const ManagerProto = require("../src/Manager");
class Manager extends ManagerProto {
    constructor() {
        super()
        this.config.setModuleActive('classic', true)
    }
}

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