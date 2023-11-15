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

describe('build a rogue to levels with manager and templates', function () {
    it ('should reach level 1 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 1)
        expect(oRogue.store.getters.getLevel).toBe(1)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 1
        })
    })
    it ('should reach level 2 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 2)
        expect(oRogue.store.getters.getLevel).toBe(2)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 2
        })
    })
    it ('should reach level 3 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 3)
        expect(oRogue.store.getters.getLevel).toBe(3)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 3
        })
        expect(oRogue.store.getters.getAbilityBaseValues['ABILITY_DEXTERITY']).toBe(16)
    })
    it ('should reach level 4 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 4)
        expect(oRogue.store.getters.getLevel).toBe(4)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 4
        })
        expect(oRogue.store.getters.getAbilityBaseValues['ABILITY_DEXTERITY']).toBe(17)
    })
    it ('should reach level 5 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 5)
        expect(oRogue.store.getters.getLevel).toBe(5)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 5
        })
    })
    it ('should reach level 6 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 6)
        expect(oRogue.store.getters.getLevel).toBe(6)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 6
        })
    })
    it ('should reach level 7 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 7)
        expect(oRogue.store.getters.getLevel).toBe(7)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 7
        })
    })
    it ('should reach level 8 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 8)
        expect(oRogue.store.getters.getLevel).toBe(8)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 8
        })
        expect(oRogue.store.getters.getAbilityBaseValues['ABILITY_DEXTERITY']).toBe(18)
    })
    it ('should reach level 9 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 9)
        expect(oRogue.store.getters.getLevel).toBe(9)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 9
        })
    })
    it ('should reach level 10 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 10)
        expect(oRogue.store.getters.getLevel).toBe(10)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 10
        })
    })
    it ('should reach level 11 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 11)
        expect(oRogue.store.getters.getLevel).toBe(11)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 11
        })
    })
    it ('should reach level 12 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 12)
        expect(oRogue.store.getters.getLevel).toBe(12)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 12
        })
    })
    it ('should reach level 13 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 13)
        expect(oRogue.store.getters.getLevel).toBe(13)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 13
        })
    })
    it ('should reach level 14 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 14)
        expect(oRogue.store.getters.getLevel).toBe(14)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 14
        })
    })
    it ('should reach level 15 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 15)
        expect(oRogue.store.getters.getLevel).toBe(15)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 15
        })
    })
    it ('should reach level 16 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 16)
        expect(oRogue.store.getters.getLevel).toBe(16)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 16
        })
    })
    it ('should reach level 17 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 17)
        expect(oRogue.store.getters.getLevel).toBe(17)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 17
        })
    })
    it ('should reach level 18 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 18)
        expect(oRogue.store.getters.getLevel).toBe(18)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 18
        })
    })
    it ('should reach level 19 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 19)
        expect(oRogue.store.getters.getLevel).toBe(19)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 19
        })
    })
    it ('should reach level 20 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.creatureTemplateBuildUp(new Creature(), 'template-rogue-generic', 20)
        expect(oRogue.store.getters.getLevel).toBe(20)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 20
        })
    })
})

describe('use sleight of hand and thieves tool', function () {
    it ('should have a bonus of zero when creature is a fighter with dex 10', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = new Creature()
        const oFighterAbilities = {
            ABILITY_STRENGTH: 10,
            ABILITY_DEXTERITY: 10,
            ABILITY_CONSTITUTION: 10,
            ABILITY_INTELLIGENCE: 10,
            ABILITY_WISDOM: 10,
            ABILITY_CHARISMA: 10
        }
        for (const [ability, value] of Object.entries(oFighterAbilities)) {
            oFighter.store.mutations.setAbility({ ability, value })
        }
    })
})