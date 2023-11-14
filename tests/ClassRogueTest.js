const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')
const { Config, CONFIG } = require('../src/config')
const CONSTS = require("../src/consts");

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
        oRogue.store.mutations.setAbility({
            ability: 'ABILITY_CONSTITUTION', value: 14
        })
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
        expect(oRogue.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_UNCANNY_DODGE)).toBeDefined()

        oRogue.store.mutations.heal()
        expect(oRogue.store.getters.getMaxHitPoints).toBe(38)
        expect(oRogue.store.getters.getHitPoints).toBe(38)

        expect(oRogue.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_UNCANNY_DODGE)).toBeDefined()
        const oSoldier = manager.createEntity('c-soldier')

        oSoldier.dice.cheat(0.5)
        oRogue.dice.cheat(0.5)

        const oAttack1 = oSoldier.attack(oRogue)
        expect(oAttack1.damages.resisted.DAMAGE_TYPE_PIERCING).toBe(0)
        oRogue.setTarget(oSoldier)
        const oAttack2 = oSoldier.attack(oRogue)
        expect(oAttack2.damages.resisted.DAMAGE_TYPE_PIERCING).toBe(3)
        const oAttack3 = oSoldier.attack(oRogue)
        expect(oAttack3.damages.resisted.DAMAGE_TYPE_PIERCING).toBe(0)

        oRogue.processEffects()
        oRogue.store.mutations.heal()
        const oAttack4 = oSoldier.attack(oRogue)
        expect(oAttack4.damages.resisted.DAMAGE_TYPE_PIERCING).toBe(3)
    })
})