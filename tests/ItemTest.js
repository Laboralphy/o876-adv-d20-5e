const Creature = require('../src/Creature')
const Rules = require('../src/Rules')
const CONSTS = require('../src/consts')
const AssetManager = require("../src/AssetManager");

beforeAll(function () {
    Error.stackTraceLimit = Infinity
    const am = new AssetManager()
    am.init()
    Creature.AssetManager = am
})
describe('necklace of greater health', function () {
    it ('should have advantage on saving throw against disease when whearing this amulet', function () {
        const r = new Rules()
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