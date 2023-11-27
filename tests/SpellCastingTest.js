const Creature = require("../src/Creature");
const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const AssetManager = require('../src/AssetManager')
const { Config, CONFIG } = require('../src/config')
const CONSTS = require("../src/consts");

CONFIG.setModuleActive('classic', true)
CONFIG.setModuleActive('ddmagic', true)

function buildStuff () {
    const r = new Manager()
    r.init()
    const am = new AssetManager()
    am.init()
    const ev = new Evolution()
    ev.data = am.data
    return {
        manager: r,
        evolution: ev
    }
}

describe('acid-splash', function () {
    it('should run cast script', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        expect(Creature.AssetManager).toBeDefined()
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.1)
        oWizard.setTarget(oTarget)
        expect(typeof Creature.AssetManager.scripts['ddmagic-cast-spell']).toBe('function')
        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']
        expect(typeof pCast).toBe('function')
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({})
        pCast({
            caster: oWizard,
            spell: 'acid-splash',
            hostiles: [oTarget],
            friends: [oWizard]
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_ACID: 4 })
    })
    it('should splash acid on two creatures when having several hostiles', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget1 = manager.createEntity('c-soldier')
        const oTarget2 = manager.createEntity('c-soldier')
        const oTarget3 = manager.createEntity('c-soldier')
        expect(Creature.AssetManager).toBeDefined()
        oWizard.dice.cheat(0.5)
        oTarget1.dice.cheat(0.1)
        oTarget2.dice.cheat(0.1)
        oTarget3.dice.cheat(0.1)
        oWizard.setTarget(oTarget1)
        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']
        expect(oTarget1.store.getters.getRecentDamageTypes).toEqual({})
        expect(oTarget2.store.getters.getRecentDamageTypes).toEqual({})
        const aHostiles = [oTarget1, oTarget2, oTarget3]
        pCast({
            caster: oWizard,
            spell: 'acid-splash',
            hostiles: aHostiles,
            friends: [oWizard]
        })
        expect(oTarget1.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_ACID: 4 })
        expect(aHostiles.filter(h => h.store.getters.getRecentDamageTypes.DAMAGE_TYPE_ACID === 4).length)
            .toBe(2)
    })
})

describe('chill-touch', function () {
    it('should deal necrotic damage', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']
        const aHostiles = [oTarget]
        pCast({
            caster: oWizard,
            spell: 'chill-touch',
            hostiles: aHostiles,
            friends: [oWizard]
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_NECROTIC: 5 })
    })
})
describe('fire-bolt', function () {
    it('should deal fire damage', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']
        const aHostiles = [oTarget]
        pCast({
            caster: oWizard,
            spell: 'fire-bolt',
            hostiles: aHostiles,
            friends: [oWizard]
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_FIRE: 6 })
    })
})