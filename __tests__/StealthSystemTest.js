const Creature = require('../src/Creature')
const ManagerProto = require('../src/Manager')
const EffectProcessor = require('../src/EffectProcessor')
const ItemProperties = require('../src/item-properties')
const CONSTS = require('../src/consts')
const Manager = require("../src/Manager");
const Evolution = require("../src/Evolution");

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

describe('entering/exiting stealth mode', function () {
    it('should have a stealth effect when entoring stealth mode', function () {
        const { manager } = buildStuff()
        const oRogue = manager.entityFactory.createCreature()
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)).toBeTruthy()
    })
    it('should remove stealth effect when exiting stealth mode', function () {
        const { manager } = buildStuff()
        const oRogue = manager.entityFactory.createCreature()
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)).toBeTruthy()
        oRogue.exitStealthMode()
        expect(oRogue.store.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)).toBeFalsy()
    })
})

describe('getEntityVisib with stealth creatures', function () {
    it('should return undetected when try to see stealth creature', function () {
        const { manager} = buildStuff()
        const oRogue = manager.entityFactory.createCreature()
        const oWatcher = manager.entityFactory.createCreature()
        oRogue.enterStealthMode()
        expect(oWatcher.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_UNDETECTED)
    })
    it('should return visible when try to see stealth creature than has been previously target', function () {
        const { manager } = buildStuff()
        const oRogue = manager.entityFactory.createCreature()
        const oWatcher = manager.entityFactory.createCreature()
        const oWatcher2 = manager.entityFactory.createCreature()
        oWatcher.setTarget(oRogue)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getStealthDetectionSet.has(oWatcher.id)).toBeTruthy()
        expect(oWatcher.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_VISIBLE)
        expect(oWatcher2.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_UNDETECTED)
    })
})

describe('attacking while sneaking', function () {
    it('attack should NOT be sneakable when NOT in stealth mode', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-rogue-generic', 4)
        const oTarget = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-tourist-generic', 4)
        const oDagger = manager.createEntity('wpn-dagger')
        oRogue.store.mutations.equipItem({ item: oDagger })
        oRogue.setTarget(oTarget)
        oRogue.setDistanceToTarget(5)
        const outcome = oRogue.attack(oTarget)
        expect(outcome.sneakable).toBeFalsy()
    })
    it('attack should be sneakable when enter stealth mode', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-rogue-generic', 4)
        const oTarget = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-tourist-generic', 4)
        const oDagger = manager.createEntity('wpn-dagger')
        oRogue.store.mutations.equipItem({ item: oDagger })
        oRogue.name = 'Rogue'
        oTarget.name = 'Target'
        oRogue.setTarget(oTarget)
        oRogue.setDistanceToTarget(5)
        oRogue.enterStealthMode()
        oRogue.dice.cheat(0.5)
        oTarget.dice.cheat(0.5)
        expect(oTarget.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_UNDETECTED)
        const outcome = oRogue.attack(oTarget)
        expect(oTarget.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_VISIBLE)
        expect(outcome.sneakable).toBeTruthy()
    })
    it('perception against stealth should be disadvantaged when in dark room', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-rogue-generic', 4)
        const oTarget = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-tourist-generic', 4)
        const oDagger = manager.createEntity('wpn-dagger')
        oRogue.store.mutations.equipItem({ item: oDagger })
        oRogue.name = 'Rogue'
        oTarget.name = 'Target'
        oRogue.store.mutations.setAreaFlags({ flags: [CONSTS.AREA_FLAG_DARK] })
        oTarget.store.mutations.setAreaFlags({ flags: [CONSTS.AREA_FLAG_DARK] })
        oRogue.setTarget(oTarget)
        oRogue.enterStealthMode()
        oRogue.setDistanceToTarget(5)
        oRogue.dice.cheat(0.5)
        oTarget.dice.cheat(0.5)
        expect(oTarget.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_UNDETECTED)
    })
    it('should not stack effect_stealth when entering stealth mode several times', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-rogue-generic', 4)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(1)
        oRogue.exitStealthMode()
        expect(oRogue.store.getters.getEffects.filter(effect => effect.type === CONSTS.EFFECT_STEALTH).length).toBe(0)
    })
})

