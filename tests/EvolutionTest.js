const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const AssetManager = require('../src/AssetManager')
const { Config, CONFIG } = require('../src/config')

CONFIG.setModuleActive('classic', true)

describe('basic test', function () {
    it ('should load properly when doing nothing', function () {
        expect(() => {
            const config = new Config()
            const am = new AssetManager({ config })
            am.init()
        }).not.toThrow()
    })
})

describe('getClassNextLevel', function () {
    it('should give me first level data of fighter when submittin fresh new craeature', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        const x = ev.getClassLevelData(c, 'fighter', 1)
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-archery')).toBeDefined()
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-defense')).toBeDefined()
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-dueling')).toBeDefined()
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-great-weapon')).toBeDefined()
    })
    it('should not show feat-fighting-style-defense when this feat is already on creature', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-defense' })
        const x = ev.getClassLevelData(c, 'fighter', 1)
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-defense')).toBeUndefined()
    })
})