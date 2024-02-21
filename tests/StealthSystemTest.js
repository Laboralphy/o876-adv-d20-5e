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
        expect(oRogue.store.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)).toBeTrue()
    })
    it('should remove stealth effect when exiting stealth mode', function () {
        const { manager } = buildStuff()
        const oRogue = manager.entityFactory.createCreature()
        oRogue.enterStealthMode()
        expect(oRogue.store.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)).toBeTrue()
        oRogue.exitStealthMode()
        expect(oRogue.store.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)).toBeFalse()
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
        expect(oRogue.store.getters.getStealthDetectionSet.has(oWatcher.id)).toBeTrue()
        expect(oWatcher.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_VISIBLE)
        expect(oWatcher2.getCreatureVisibility(oRogue)).toBe(CONSTS.VISIBILITY_UNDETECTED)
    })
})

describe('attacking while sneaking', function () {
    it('should dispell stealth when attacking', function () {

    })
})