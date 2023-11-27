const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
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
    it('should do acid 4 damage when at level 2', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 2)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.setTarget(oTarget)
        oWizard.store.mutations.learnSpell({ spell: 'acid-splash' })
        oWizard.store.mutations.prepareSpell({ spell: 'acid-splash' })
        expect(typeof Creature.AssetManager.scripts['ddmagic-cast-spell']).toBe('function')
        Creature.AssetManager.scripts['ddmagic-cast-spell']({
            spell: 'acid-splash',
            caster: oWizard,
            hostiles: [oTarget]
        })
    })
})