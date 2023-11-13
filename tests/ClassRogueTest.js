const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')
const { Config, CONFIG } = require('../src/config')

CONFIG.setModuleActive('classic', true)

function buildStuff () {
    const r = new Manager()
    r.init()
    const config = new Config()
    config.setModuleActive('classic', true)
    const am = new AssetManager()
    am.init()
    const ev = new Evolution()
    ev.data = am.data
    return {
        manager: r,
        evolution: ev
    }
}

describe('uncanny dodge', function () {
    it('should halves damage when reaching level 5', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = new Creature()
        evolution.creatureLevelUp(oRogue, {
            selectedClass: 'rogue',
            selectedAbility: 'ABILITY_DEXTERITY',
            selectedSkills: [
                'skill-acrobatics',
                'skill-athletics',
                'skill-deception',
                'skill-insight'
            ],
            selectedFeats: [
                'feat-expertise-thieves-tools',
                'feat-expertise-sleight-of-hand'
            ]
        })
        evolution.creatureLevelUp(oRogue, {
            selectedClass: 'rogue',
            selectedAbility: 'ABILITY_DEXTERITY'
        })
        evolution.creatureLevelUp(oRogue, {
            selectedClass: 'rogue',
            selectedAbility: 'ABILITY_DEXTERITY'
        })
        evolution.creatureLevelUp(oRogue, {
            selectedClass: 'rogue',
            selectedAbility: 'ABILITY_DEXTERITY'
        })
        evolution.creatureLevelUp(oRogue, {
            selectedClass: 'rogue',
            selectedAbility: 'ABILITY_DEXTERITY'
        })
        oRogue.processEffects()
        expect(oRogue.store.getters.getLevel).toBe(5)
        expect(oRogue.store.getters.hasUncannyDodge).toBeTrue()
    })
})