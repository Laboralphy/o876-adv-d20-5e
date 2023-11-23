const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')
const { Config, CONFIG } = require('../src/config')
const CONSTS = require("../src/consts");
const SpellHelper = require('../src/modules/classic/common/spell-helper')

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

describe('basic', function () {
    it('should create a level 2 wizard', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 2)
        expect(oWizard.store.getters.getLevelByClass).toEqual({
            wizard: 2
        })
    })
    it('should have the correct number of slot', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 1)
        const aSlots = oWizard.store.getters.getSpellSlotStatus
        expect(oWizard.store.getters.getWizardLevel).toBe(1)
        expect(aSlots).toEqual([
            { count: 2, used: 0 },
            { count: 0, used: 0 },
            { count: 0, used: 0 },
            { count: 0, used: 0 },
            { count: 0, used: 0 },
            { count: 0, used: 0 },
            { count: 0, used: 0 },
            { count: 0, used: 0 },
            { count: 0, used: 0 }
        ])
    })
    it('should initialize spellbook', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 2)
        expect(oWizard.store.getters.getSpellSlotStatus).toEqual([
                { count: 3, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 }
            ]
        )
        expect(oWizard.store.getters.getMaxPreparableCantrips).toBe(3)
        const oWizard2 = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        expect(oWizard2.store.getters.getSpellSlotStatus).toEqual([
                { count: 4, used: 0 },
                { count: 2, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 },
                { count: 0, used: 0 }
            ]
        )
    })
})

describe('spell preparing', function () {
    it('should memorize no more than 4 spell when at level 1', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 1)
        expect(oWizard.store.getters.getMaxPreparableCantrips).toBe(3)
        expect(oWizard.store.getters.getMaxPreparableSpells).toBe(4)
    })
    it('should memorize no more than 8 spell when at level 4', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 4)
        expect(oWizard.store.getters.getMaxPreparableCantrips).toBe(4)
        expect(oWizard.store.getters.getMaxPreparableSpells).toBe(8)
    })
    it('should not be able to memorize twice the same spell', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        expect(oWizard.store.getters.getMaxPreparableCantrips).toBe(3)
        expect(oWizard.store.getters.getMaxPreparableSpells).toBe(6)
        expect(oWizard.store.getters.getPreparedSpells.cantrips.length).toBe(0)
        expect(oWizard.store.getters.getPreparedSpells.spells.length).toBe(0)
        oWizard.store.mutations.learnSpell({ spell: 'acid-arrow' })
        oWizard.store.mutations.learnSpell({ spell: 'magic-missile' })
        oWizard.store.mutations.prepareSpell({ spell: 'acid-arrow' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual(['acid-arrow'])
        oWizard.store.mutations.prepareSpell({ spell: 'magic-missile' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual(['acid-arrow', 'magic-missile'])
        oWizard.store.mutations.prepareSpell({ spell: 'magic-missile' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual(['acid-arrow', 'magic-missile'])
        oWizard.store.mutations.prepareSpell({ spell: 'acid-arrow' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual(['magic-missile', 'acid-arrow'])
        expect(() => oWizard.store.mutations.prepareSpell({ spell: 'invisibility' }))
            .toThrow(new Error('This character does not know the spell "invisibility"'))
    })
    it('should not be able to memorize more spell than allowed', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        expect(oWizard.store.getters.getMaxPreparableCantrips).toBe(3)
        expect(oWizard.store.getters.getMaxPreparableSpells).toBe(6)
        expect(oWizard.store.getters.getPreparedSpells.cantrips.length).toBe(0)
        expect(oWizard.store.getters.getPreparedSpells.spells.length).toBe(0)

        oWizard.store.mutations.learnSpell({ spell: 'acid-splash' })
        oWizard.store.mutations.learnSpell({ spell: 'true-strike' })
        oWizard.store.mutations.learnSpell({ spell: 'poison-spray' })
        oWizard.store.mutations.learnSpell({ spell: 'ray-of-frost' })
        oWizard.store.mutations.learnSpell({ spell: 'mending' })
        oWizard.store.mutations.learnSpell({ spell: 'light' })

        oWizard.store.mutations.learnSpell({ spell: 'magic-missile' })
        oWizard.store.mutations.learnSpell({ spell: 'charm-person' })
        oWizard.store.mutations.learnSpell({ spell: 'color-spray' })
        oWizard.store.mutations.learnSpell({ spell: 'false-life' })
        oWizard.store.mutations.learnSpell({ spell: 'mage-armor' })
        oWizard.store.mutations.learnSpell({ spell: 'acid-arrow' })
        oWizard.store.mutations.learnSpell({ spell: 'invisibility' })
        oWizard.store.mutations.learnSpell({ spell: 'hold-person' })
        oWizard.store.mutations.learnSpell({ spell: 'ray-of-enfeeblement' })

        oWizard.store.mutations.prepareSpell({ spell: 'magic-missile' })
        oWizard.store.mutations.prepareSpell({ spell: 'charm-person' })
        oWizard.store.mutations.prepareSpell({ spell: 'color-spray' })
        oWizard.store.mutations.prepareSpell({ spell: 'acid-arrow' })
        oWizard.store.mutations.prepareSpell({ spell: 'hold-person' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'magic-missile',
            'charm-person',
            'color-spray',
            'acid-arrow',
            'hold-person'
        ])
        oWizard.store.mutations.prepareSpell({ spell: 'invisibility' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'magic-missile',
            'charm-person',
            'color-spray',
            'acid-arrow',
            'hold-person',
            'invisibility'
        ])
        oWizard.store.mutations.prepareSpell({ spell: 'ray-of-enfeeblement' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'charm-person',
            'color-spray',
            'acid-arrow',
            'hold-person',
            'invisibility',
            'ray-of-enfeeblement'
        ])
        oWizard.store.mutations.prepareSpell({ spell: 'charm-person' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'color-spray',
            'acid-arrow',
            'hold-person',
            'invisibility',
            'ray-of-enfeeblement',
            'charm-person'
        ])
        oWizard.store.mutations.prepareSpell({ spell: 'magic-missile' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'acid-arrow',
            'hold-person',
            'invisibility',
            'ray-of-enfeeblement',
            'charm-person',
            'magic-missile'
        ])

        oWizard.store.mutations.prepareSpell({ spell: 'light' })
        oWizard.store.mutations.prepareSpell({ spell: 'mending' })
        oWizard.store.mutations.prepareSpell({ spell: 'ray-of-frost' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'acid-arrow',
            'hold-person',
            'invisibility',
            'ray-of-enfeeblement',
            'charm-person',
            'magic-missile'
        ])
        expect(oWizard.store.getters.getPreparedSpells.cantrips).toEqual([
            'light',
            'mending',
            'ray-of-frost'
        ])
        oWizard.store.mutations.prepareSpell({ spell: 'poison-spray' })
        expect(oWizard.store.getters.getPreparedSpells.cantrips).toEqual([
            'mending',
            'ray-of-frost',
            'poison-spray'
        ])
        oWizard.store.mutations.forgetSpell({ spell: 'invisibility' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'acid-arrow',
            'hold-person',
            'ray-of-enfeeblement',
            'charm-person',
            'magic-missile'
        ])
        oWizard.store.mutations.prepareSpell({ spell: 'invisibility' })
        expect(oWizard.store.getters.getPreparedSpells.spells).toEqual([
            'acid-arrow',
            'hold-person',
            'ray-of-enfeeblement',
            'charm-person',
            'magic-missile',
            'invisibility'
        ])
    })
})

describe()