const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')
const { CONFIG } = require('../src/config')
const jsonschema = require('jsonschema')
const {CONSTS} = require("../index");

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

describe('spell data base check', function () {
    it('verifier que la bd soit dans un format exact', function () {
        const db = require('../src/modules/ddmagic/data/data-ddmagic-spell-database.json')
        const jss = new jsonschema.Validator()
        const x = jss.validate(db, {
            "type": "object",
            "patternProperties": {
                "^[a-z][-0-9a-z]*$": {
                    "allowAdditionalProperties": false,
                    "required": [
                        "level",
                        "ritual",
                        "school",
                        "concentration",
                        "target"
                    ],
                    "type": "object",
                    "properties": {
                        "level": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9
                        },
                        "ritual": {
                            "type": "boolean"
                        },
                        "concentration": {
                            "type": "boolean"
                        },
                        "target": {
                            "enum": [
                                "TARGET_TYPE_HOSTILE",
                                "TARGET_TYPE_FRIEND",
                                "TARGET_TYPE_SPECIAL",
                                "TARGET_TYPE_SELF"
                            ]
                        },
                        "school": {
                            "enum": [
                                "SPELL_SCHOOL_ABJURATION",
                                "SPELL_SCHOOL_CONJURATION",
                                "SPELL_SCHOOL_DIVINATION",
                                "SPELL_SCHOOL_ENCHANTMENT",
                                "SPELL_SCHOOL_EVOCATION",
                                "SPELL_SCHOOL_ILLUSION",
                                "SPELL_SCHOOL_NECROMANCY",
                                "SPELL_SCHOOL_TRANSMUTATION"
                            ]
                        }
                    }
                }
            }
        })
        if (!x.valid) {
            console.error(x.errors.map(e => e.stack))
        }
        expect(x.valid).toBeTrue()
    })
})

describe('masteredSpells', function () {
    it('should not have mastered spell defined when creating creature', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 2)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.setTarget(oTarget)
        oWizard.store.mutations.learnSpell({ spell: 'burning-hands' })
        oWizard.store.mutations.prepareSpell({ spell: 'burning-hands' })
    })
})

describe('Spell names', function () {
    it('should be able to enumerate spell names', function () {
        const { manager } = buildStuff()
        expect(manager.assetManager.publicAssets.strings.spells['acid-splash']).toBeDefined()
    })
})



// ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ******
// ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ******
// ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ******
// ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ******
// ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ******
// ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ****** SPELLS ******

describe('acid-splash', function () {
    it('should do acid 4 damage when at level 2', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 2)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.setTarget(oTarget)
        oWizard.store.mutations.learnSpell({ spell: 'acid-splash' })
        oWizard.store.mutations.prepareSpell({ spell: 'acid-splash' })
        expect(typeof Creature.AssetManager.scripts['ddmagic-cast-spell']).toBe('function')
        expect(() => {
            Creature.AssetManager.scripts['ddmagic-cast-spell']({
                spell: 'acid-splash',
                caster: oWizard,
                hostiles: [oTarget]
            })
        }).not.toThrow()
    })
})

describe('Burning hands', function () {
    it('should change exported state when changing slot consumed', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 2)
        oWizard.store.mutations.learnSpell({ spell: 'burning-hands' })
        oWizard.store.mutations.prepareSpell({ spell: 'burning-hands' })
        const a1 = oWizard.state
        expect(a1.abilities['ABILITY_CHARISMA']).toBe(10)
        ++oWizard.store.state.abilities['ABILITY_CHARISMA']
        const a2 = oWizard.state
        expect(a1.abilities['ABILITY_CHARISMA']).toBe(10)
        expect(a2.abilities['ABILITY_CHARISMA']).toBe(11)
        oWizard.store.mutations.consumeSpellSlot({ level: 1 })
        const a3 = oWizard.state
        expect(a1).not.toEqual(a2)
        expect(a2).not.toEqual(a3)
    })
    it('should consume level 1 spell slot when casting spell', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 2)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.setTarget(oTarget)
        oWizard.store.mutations.learnSpell({ spell: 'burning-hands' })
        oWizard.store.mutations.prepareSpell({ spell: 'burning-hands' })
        expect(oWizard.store.getters.getSpellSlotStatus[0]).toEqual({ count: 3, used: 0 })
        expect(oWizard.store.state.data.spellbook.slots[0]).toBe(0)
        expect(Creature.AssetManager.scripts['ddmagic-cast-spell']({
                spell: 'burning-hands',
                caster: oWizard,
                hostiles: [oTarget]
            })
        ).toBeTrue()
        const nWL = oWizard.store.getters.getSpellCasterLevel
        expect(nWL).toBe(2)
        const ssc = Creature.AssetManager.data['data-ddmagic-spell-count'].find(dx => dx.wizardLevel === 2)
        expect(ssc.wizardLevel).toBe(2)
        expect(ssc.slotCountPerLevel).toEqual([3, 0, 0, 0, 0, 0, 0, 0, 0])
        expect(ssc.slotCountPerLevel.map((n, i) => oWizard.store.state.data.spellbook.slots[i]))
            .toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0])
        expect(oWizard.store.state.data.spellbook.slots[0]).toBe(1)
        expect(oWizard.store.getters.getSpellSlotStatus[0]).toEqual({ count: 3, used: 1 })
    })
})
