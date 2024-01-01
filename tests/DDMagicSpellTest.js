const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')
const { CONFIG } = require('../src/config')
const jsonschema = require('jsonschema')

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

describe('Spell names', function () {
    it('should be able to enumerate spell names', function () {
        const { manager } = buildStuff()
        expect(manager.assetManager.publicAssets.strings.spells['acid-splash']).toBeDefined()
    })
})

