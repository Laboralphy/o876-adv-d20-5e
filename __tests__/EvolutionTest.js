const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')
const { Config } = require('../src/config')

function buildStuff () {
    const r = new Manager()
    r.config.setModuleActive('classic', true)
    r.init()
    const am = r.assetManager
    const ev = new Evolution()
    ev.data = am.data
    return {
        manager: r,
        evolution: ev
    }
}

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
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        const x = ev.getClassLevelData(c, 'fighter', 1)
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-archery')).toBeDefined()
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-defense')).toBeDefined()
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-dueling')).toBeDefined()
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-great-weapon')).toBeDefined()
    })
    it('should not show feat-fighting-style-defense when this feat is already on creature', function () {
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.addFeat({ feat: 'feat-fighting-style-defense' })
        const x = ev.getClassLevelData(c, 'fighter', 1)
        expect(x.feats.find(({ feat }) => feat === 'feat-fighting-style-defense')).toBeUndefined()
    })
})

describe('creatureLevelUp', function () {
    it('should throw no class selected when level up with no class specified', function () {
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        expect(() => ev.creatureLevelUp(c, {}))
            .toThrow(new Error('ERR_EVOL_NO_CLASS_SELECTED'))
    })
    it('should throw ERR_EVOL_UNKNOWN_CLASS when level up with invalid class', function () {
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })
        expect(() => ev.creatureLevelUp(c, { selectedClass: 'fighter' }))
            .toThrow(new Error('ERR_EVOL_GROUP_FEAT_NOT_SELECTED'))
    })
    it('should throw ERR_EVOL_CANT_MULTICLASS when level up as fighter without str10 & dex10', function () {
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        expect(() => ev.creatureLevelUp(c, { selectedClass: 'fighter' }))
            .toThrow(new Error('ERR_EVOL_CANT_MULTICLASS'))
    })
    it('should throw ERR_EVOL_GROUP_FEAT_NOT_SELECTED when level up with no feat selected', function () {
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })

        expect(() => ev.creatureLevelUp(c, { selectedClass: 'fighter' }))
            .toThrow(new Error('ERR_EVOL_GROUP_FEAT_NOT_SELECTED'))
    })
    it('should throw ERR_EVOL_FORBIDDEN_FEAT when level up with invalid feat', function () {
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })
        expect(() => ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: ['feat-fighting-style-defense', 'xxxxxx']
        }))
            .toThrow(new Error('ERR_EVOL_FORBIDDEN_FEAT: xxxxxx - ALLOWED VALUES: feat-fighting-style-archery, feat-fighting-style-defense, feat-fighting-style-dueling, feat-fighting-style-great-weapon'))
        expect(() => ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: ['feat-improved-critical']
        }))
            .toThrow(new Error('ERR_EVOL_FORBIDDEN_FEAT: feat-improved-critical - ALLOWED VALUES: feat-fighting-style-archery, feat-fighting-style-defense, feat-fighting-style-dueling, feat-fighting-style-great-weapon'))
    })
    it('should throw ERR_EVOL_GROUP_FEAT_OVER_SELECTED when level up with 2 feat of same group', function () {
        const { manager: r, evolution: ev } = buildStuff()
        const c = r.createEntity('c-pilgrim')
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 13 })
        expect(() => ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: ['feat-fighting-style-defense', 'feat-fighting-style-dueling']
        }))
            .toThrow(new Error('ERR_EVOL_GROUP_ALREADY_SELECTED: feat-group-fighting-style feat: feat-fighting-style-dueling'))
    })
    it('should successfully add a fighter level', function () {
        const { manager: r } = buildStuff()
        r.createEntity('c-pilgrim')
    })
})

describe('first level up - define character class', function () {
    it('should not crash when submitting a fresh new player', function () {
        const config = new Config()
        config.setModuleActive('classic', true)
        const am = new AssetManager({ config })
        am.init()
        const c = new Creature()
        c.assetManager = am
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
                    'skill-intimidation',
                    'skill-perception'
                ]
            })
        ).toThrow(new Error('ERR_EVOL_GROUP_FEAT_NOT_SELECTED'))
        expect(() =>
            ev.creatureLevelUp(c, {
                selectedClass: 'fighter',
                selectedSkills: [
                    'skill-intimidation',
                    'skill-perception'
                ],
                selectedFeats: [
                    'feat-fighting-style-archery'
                ]
            })
        ).not.toThrow()
    })
})

describe('checkLevelUp', function () {
    const { manager } = buildStuff()
    const am = manager.assetManager
    const ev = new Evolution()
    ev.data = am.data
    it('should show leveling requirement when submitting any creature', function () {
        const c = new Creature()
        c.assetManager = am
        c.store.mutations.setAbility({ ability: 'ABILITY_STRENGTH', value: 10})
        const clur1 = ev.checkLevelUpRequirements(c, 'fighter')
        expect(clur1).toEqual({
            class: 'fighter',
            canDo: true,
            feats: {
                'feat-group-fighting-style': [
                'feat-fighting-style-archery',
                'feat-fighting-style-defense',
                'feat-fighting-style-dueling',
                'feat-fighting-style-great-weapon'
                ]
            },
            skills: [
                'skill-acrobatics',
                'skill-athletics',
                'skill-history',
                'skill-insight',
                'skill-intimidation',
                'skill-perception',
                'skill-survival'
            ],
            skillCount: 2,
            ability: false
        })
        const lup1 = ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: [clur1.feats['feat-group-fighting-style'][0]],
            selectedSkills: [clur1.skills[0], clur1.skills[1]]
        })
        expect(c.store.getters.getLevel).toBe(1)
        expect(lup1).toEqual({
            class: 'fighter',
            feats: { newFeats: [ 'feat-fighting-style-archery' ] },
            skills: ['skill-acrobatics', 'skill-athletics']
        })

        const clur2 = ev.checkLevelUpRequirements(c, 'fighter')
        expect(clur2).toEqual({
            class: 'fighter',
            canDo: true,
            feats: {},
            skills: [],
            skillCount: 0,
            ability: false
        })
        const lup2 = ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: [],
            selectedSkills: []
        })
        expect(c.store.getters.getLevel).toBe(2)
        expect(lup2).toEqual({
            class: 'fighter',
            feats: {
                newFeats: ['feat-second-wind', 'feat-martial-archetype-champion'],
                newFeatUses: [{ feat: 'feat-second-wind', uses: 1 }]
            }
        })

        const clur3 = ev.checkLevelUpRequirements(c, 'fighter')
        expect(clur3).toEqual({
            class: 'fighter',
            canDo: true,
            feats: {},
            skills: [],
            skillCount: 0,
            ability: false
        })
        const lup3 = ev.creatureLevelUp(c, { selectedClass: 'fighter' })
        expect(lup3).toEqual({ class: 'fighter', feats: { newFeats: [ 'feat-improve-critical' ] } })

        const clur4 = ev.checkLevelUpRequirements(c, 'fighter')
        expect(clur4).toEqual({
            class: 'fighter',
            canDo: true,
            feats: {},
            skills: [],
            skillCount: 0,
            ability: true
        })
        expect(c.store.getters.getAbilityBaseValues.ABILITY_STRENGTH).toBe(10)
        const lup4 = ev.creatureLevelUp(c, { selectedClass: 'fighter', selectedAbility: 'ABILITY_STRENGTH' })
        expect(c.store.getters.getAbilityBaseValues.ABILITY_STRENGTH).toBe(11)
        expect(lup4).toEqual({
            class: 'fighter',
            augmentedAbility: 'ABILITY_STRENGTH'
        })

        const clur5 = ev.checkLevelUpRequirements(c, 'fighter')
        expect(clur5).toEqual({
            class: 'fighter',
            canDo: true,
            feats: {},
            skills: [],
            skillCount: 0,
            ability: false
        })
        const lup5 = ev.creatureLevelUp(c, { selectedClass: 'fighter' })
        expect(lup5).toEqual({ class: 'fighter', extraAttacks: true })

        // 6
        ev.creatureLevelUp(c, { selectedClass: 'fighter', selectedAbility: 'ABILITY_STRENGTH' })
        expect(c.store.getters.getAbilityBaseValues.ABILITY_STRENGTH).toBe(12)

        // 7
        ev.creatureLevelUp(c, { selectedClass: 'fighter' })

        // 8
        ev.creatureLevelUp(c, { selectedClass: 'fighter', selectedAbility: 'ABILITY_STRENGTH' })
        expect(c.store.getters.getAbilityBaseValues.ABILITY_STRENGTH).toBe(13)

        // 9
        ev.creatureLevelUp(c, { selectedClass: 'fighter' })
        expect(c.store.getters.getLevel).toBe(9)

        // 10
        const clur10 = ev.checkLevelUpRequirements(c, 'fighter')
        expect(clur10).toEqual({
                class: 'fighter',
                canDo: true,
                feats: {
                    'feat-group-fighting-style': [
                        'feat-fighting-style-defense',
                        'feat-fighting-style-dueling',
                        'feat-fighting-style-great-weapon'
                    ]
                },
                skills: [],
                skillCount: 0,
                ability: false
            }
        )
    })
})

describe('getClassLevelData with tourist evolution', function () {
    it('should not crash when asking for tourist', function () {
        const { evolution: ev, manager } = buildStuff()
        const c = manager.entityFactory.createCreature()
        ev.getClassLevelData(c, 'tourist', 1)
    })
})

describe('retrieve available actions for player and creatures', function () {
    it('should return [second wind] when leveling fighter to level 2', function () {
        const { evolution: ev, manager } = buildStuff()
        const c = manager.entityFactory.createCreature()
        c.store.mutations.resetCharacter()
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedSkills: [
                'skill-acrobatics',
                'skill-athletics',
            ],
            selectedFeats: ['feat-fighting-style-defense']
        })
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(2)
        expect(c.store.getters.getCounters['feat-second-wind'].max).toBe(1)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(3)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedAbility: 'ABILITY_STRENGTH'
        })
        expect(c.store.getters.getLevel).toBe(4)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(5)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedAbility: 'ABILITY_STRENGTH'
        })
        expect(c.store.getters.getLevel).toBe(6)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(7)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedAbility: 'ABILITY_STRENGTH'
        })
        expect(c.store.getters.getLevel).toBe(8)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(9)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedFeats: ['feat-fighting-style-archery']
        })
        expect(c.store.getters.getLevel).toBe(10)
        expect(c.store.getters.getActions).toEqual([{
            action: 'feat-second-wind',
            script: 'fa-second-wind',
            uses: {
                value: 1,
                max: 1
            },
            innate: false
        }])
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(11)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedAbility: 'ABILITY_STRENGTH'
        })
        expect(c.store.getters.getLevel).toBe(12)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(13)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedAbility: 'ABILITY_STRENGTH'
        })
        expect(c.store.getters.getLevel).toBe(14)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(15)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter',
            selectedAbility: 'ABILITY_STRENGTH'
        })
        expect(c.store.getters.getLevel).toBe(16)
        ev.creatureLevelUp(c, {
            selectedClass: 'fighter'
        })
        expect(c.store.getters.getLevel).toBe(17)
        expect(c.store.getters.getCounters['feat-second-wind'].max).toBe(2)

        expect(c.store.getters.getActions).toEqual([{
            action: 'feat-second-wind',
            script: 'fa-second-wind',
            uses: {
                value: 2,
                max: 2
            },
            innate: false
        }])
    })
    it('should return innate actions when asking actions of a creature (magma mephit)', function () {
        const r = new Manager()
        r.config.setModuleActive('classic', true)
        r.init()
        const am = r.assetManager
        am.init()
        const c = r.createEntity('c-mephit-magma')
        expect(c.store.getters.getActions).toEqual([
            {
                action: 'sla-fire-breath',
                script: 'sla-fire-breath',
                uses: { value: 0, max: Infinity },
                innate: true
            }
        ])
    })
})


describe('initial autoleveling of creature blueprint', function () {
    it('c-soldier should have acrobatics when creating creature', function () {
        const { manager } = buildStuff()
        const c = manager.createEntity('c-soldier')
        expect(c.store.getters.getActions).toEqual([
          {
            action: 'feat-second-wind',
            script: 'fa-second-wind',
            uses: { value: 1, max: 1 },
            innate: false
          }
        ])
    })
})

describe('testing if a rogue has good skill throw in sleaith of hand', function () {
    it('should', function () {
        const { manager } = buildStuff()
        manager.createEntity('c-soldier')
    })
})