const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')

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

describe('build a fighter to levels with manager and templates', function () {
    it ('should reach level 1 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 1)
        expect(oFighter.store.getters.getLevel).toBe(1)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 1
        })
    })
    it ('should reach level 2 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 2)
        expect(oFighter.store.getters.getLevel).toBe(2)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 2
        })
    })
    it ('should reach level 3 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 3)
        expect(oFighter.store.getters.getLevel).toBe(3)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 3
        })
        expect(oFighter.store.getters.getAbilityBaseValues['ABILITY_STRENGTH']).toBe(16)
    })
    it ('should reach level 4 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 4)
        expect(oFighter.store.getters.getLevel).toBe(4)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 4
        })
        expect(oFighter.store.getters.getAbilityBaseValues['ABILITY_STRENGTH']).toBe(17)
    })
    it ('should reach level 5 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 5)
        expect(oFighter.store.getters.getLevel).toBe(5)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 5
        })
    })
    it ('should reach level 6 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 6)
        expect(oFighter.store.getters.getLevel).toBe(6)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 6
        })
    })
    it ('should reach level 7 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 7)
        expect(oFighter.store.getters.getLevel).toBe(7)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 7
        })
    })
    it ('should reach level 8 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 8)
        expect(oFighter.store.getters.getLevel).toBe(8)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 8
        })
        expect(oFighter.store.getters.getAbilityBaseValues['ABILITY_STRENGTH']).toBe(19)
    })
    it ('should reach level 9 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 9)
        expect(oFighter.store.getters.getLevel).toBe(9)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 9
        })
    })
    it ('should reach level 10 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 10)
        expect(oFighter.store.getters.getLevel).toBe(10)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 10
        })
    })
    it ('should reach level 11 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 11)
        expect(oFighter.store.getters.getLevel).toBe(11)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 11
        })
    })
    it ('should reach level 12 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 12)
        expect(oFighter.store.getters.getLevel).toBe(12)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 12
        })
    })
    it ('should reach level 13 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 13)
        expect(oFighter.store.getters.getLevel).toBe(13)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 13
        })
    })
    it ('should reach level 14 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 14)
        expect(oFighter.store.getters.getLevel).toBe(14)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 14
        })
    })
    it ('should reach level 15 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 15)
        expect(oFighter.store.getters.getLevel).toBe(15)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 15
        })
    })
    it ('should reach level 16 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 16)
        expect(oFighter.store.getters.getLevel).toBe(16)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 16
        })
    })
    it ('should reach level 17 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 17)
        expect(oFighter.store.getters.getLevel).toBe(17)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 17
        })
    })
    it ('should reach level 18 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 18)
        expect(oFighter.store.getters.getLevel).toBe(18)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 18
        })
    })
    it ('should reach level 19 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 19)
        expect(oFighter.store.getters.getLevel).toBe(19)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 19
        })
    })
    it ('should reach level 20 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-fighter-generic', 20)
        expect(oFighter.store.getters.getLevel).toBe(20)
        expect(oFighter.store.getters.getLevelByClass).toEqual({
            'fighter': 20
        })
    })
})
