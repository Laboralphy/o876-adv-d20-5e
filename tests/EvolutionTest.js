const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
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

describe('creatureLevelUp', function () {
    it('should throw no class selected when level up with no class specified', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        expect(() => ev.creatureLevelUp(c, {}))
            .toThrow(new Error('ERR_EVOL_NO_CLASS_SELECTED'))
    })
    it('should throw ERR_EVOL_UNKNOWN_CLASS when level up with invalid class', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })
        expect(() => ev.creatureLevelUp(c, { selectedClass: 'fighter' }))
            .toThrow(new Error('ERR_EVOL_GROUP_FEAT_NOT_SELECTED'))
    })
    it('should throw ERR_EVOL_CANT_MULTICLASS when level up as fighter without str10 & dex10', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        expect(() => ev.creatureLevelUp(c, { selectedClass: 'fighter' }))
            .toThrow(new Error('ERR_EVOL_CANT_MULTICLASS'))
    })
    it('should throw ERR_EVOL_GROUP_FEAT_NOT_SELECTED when level up with no feat selected', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })

        expect(() => ev.creatureLevelUp(c, { selectedClass: 'fighter' }))
            .toThrow(new Error('ERR_EVOL_GROUP_FEAT_NOT_SELECTED'))
    })
    it('should throw ERR_EVOL_FORBIDDEN_FEAT when level up with invalid feat', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })
        expect(() => ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: ['feat-fighting-style-defense', 'xxxxxx']
        }))
            .toThrow(new Error('ERR_EVOL_FORBIDDEN_FEAT'))
        expect(() => ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: ['feat-improved-critical']
        }))
            .toThrow(new Error('ERR_EVOL_FORBIDDEN_FEAT'))
    })
    it('should throw ERR_EVOL_GROUP_FEAT_OVER_SELECTED when level up with 2 feat of same group', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })
        expect(() => ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: ['feat-fighting-style-defense', 'feat-fighting-style-dueling']
        }))
            .toThrow(new Error('ERR_EVOL_GROUP_FEAT_OVER_SELECTED'))
    })
    it('should successfully add a fighter level', function () {
        const r = new Manager()
        r.init()
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        const ev = new Evolution()
        ev.data = am.data
        const c = r.createEntity('c-pilgrim')
    })
})

describe('first level up - define character class', function () {
    it('should not crash when submitting a fresh new player', function () {
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager()
        am.init()
        Creature.AssetManager = am
        const c = new Creature()
        const ev = new Evolution()
        ev.data = am.data
        expect(() =>
            ev.creatureLevelUp(c, {
                selectedClass: 'fighter'
            })
        ).toThrow(new Error('ERR_EVOL_INVALID_SKILL_COUNT'))
        expect(() =>
            ev.creatureLevelUp(c, {
                selectedClass: 'fighter',
                selectedSkills: [
                    'SKILL_INTIMIDATION',
                    'SKILL_PERCEPTION'
                ]
            })
        ).toThrow(new Error('ERR_EVOL_GROUP_FEAT_NOT_SELECTED'))
        expect(() =>
            ev.creatureLevelUp(c, {
                selectedClass: 'fighter',
                selectedSkills: [
                    'SKILL_INTIMIDATION',
                    'SKILL_PERCEPTION'
                ],
                selectedFeats: [
                    'feat-fighting-style-archery'
                ]
            })
        ).not.toThrow()
    })
})

describe('checkLevelUp', function () {
    const config = new Config()
    config.setModuleActive('classic', true)
    const am = new AssetManager()
    am.init()
    Creature.AssetManager = am
    const ev = new Evolution()
    ev.data = am.data
    it('should show leveling requirement when submitting any creature', function () {
        const c = new Creature()
        const clur1 = ev.checkLevelUpRequirements(c, 'fighter')
        console.log(clur1)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: [clur1.feats['feat-group-fighting-style'][0]],
            selectedSkills: [clur1.skills[0], clur1.skills[1]]
        })
        expect(c.store.getters.getLevel).toBe(1)
    })
})