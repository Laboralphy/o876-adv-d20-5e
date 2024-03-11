const ManagerProto = require('../src/Manager')

class Manager extends ManagerProto {
    constructor() {
        super()
        this.config.setModuleActive('classic', true)
    }
}

beforeAll(function () {
    Error.stackTraceLimit = Infinity
})
describe('necklace of greater health', function () {
    it ('should have advantage on saving throw against disease when whearing this amulet', function () {
        const r = new Manager()
        r.init()
        const s = r.createEntity('c-soldier')
        const nl = r.createEntity('necklace-health-greater')
        s.equipItem(nl)
        expect(s.store.getters.getAdvantages.ROLL_TYPE_SAVE.THREAT_TYPE_DISEASE).toEqual({
            rules: ['ITEM_TYPE_NECKLACE'],
            value: true
        })
    })
})