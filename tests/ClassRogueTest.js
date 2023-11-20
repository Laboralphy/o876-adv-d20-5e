const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const Creature = require('../src/Creature')
const AssetManager = require('../src/AssetManager')
const { Config, CONFIG } = require('../src/config')
const CONSTS = require("../src/consts");
const SpellHelper = require('../src/modules/classic/common/spell-helper')

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
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 1)
        expect(oRogue.store.getters.getLevel).toBe(1)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 1
        })
    })
    it ('should reach level 2 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 2)
        expect(oRogue.store.getters.getLevel).toBe(2)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 2
        })
    })
    it ('should reach level 3 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 3)
        expect(oRogue.store.getters.getLevel).toBe(3)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 3
        })
        expect(oRogue.store.getters.getAbilityBaseValues['ABILITY_DEXTERITY']).toBe(16)
    })
    it ('should reach level 4 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 4)
        expect(oRogue.store.getters.getLevel).toBe(4)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 4
        })
        expect(oRogue.store.getters.getAbilityBaseValues['ABILITY_DEXTERITY']).toBe(17)
    })
    it ('should reach level 5 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 5)
        expect(oRogue.store.getters.getLevel).toBe(5)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 5
        })
    })
    it ('should reach level 6 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 6)
        expect(oRogue.store.getters.getLevel).toBe(6)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 6
        })
    })
    it ('should reach level 7 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 7)
        expect(oRogue.store.getters.getLevel).toBe(7)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 7
        })
    })
    it ('should reach level 8 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 8)
        expect(oRogue.store.getters.getLevel).toBe(8)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 8
        })
        expect(oRogue.store.getters.getAbilityBaseValues['ABILITY_DEXTERITY']).toBe(18)
    })
    it ('should reach level 9 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 9)
        expect(oRogue.store.getters.getLevel).toBe(9)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 9
        })
    })
    it ('should reach level 10 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 10)
        expect(oRogue.store.getters.getLevel).toBe(10)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 10
        })
    })
    it ('should reach level 11 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
        expect(oRogue.store.getters.getLevel).toBe(11)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 11
        })
    })
    it ('should reach level 12 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 12)
        expect(oRogue.store.getters.getLevel).toBe(12)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 12
        })
    })
    it ('should reach level 13 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 13)
        expect(oRogue.store.getters.getLevel).toBe(13)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 13
        })
    })
    it ('should reach level 14 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 14)
        expect(oRogue.store.getters.getLevel).toBe(14)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 14
        })
    })
    it ('should reach level 15 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 15)
        expect(oRogue.store.getters.getLevel).toBe(15)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 15
        })
    })
    it ('should reach level 16 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 16)
        expect(oRogue.store.getters.getLevel).toBe(16)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 16
        })
    })
    it ('should reach level 17 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 17)
        expect(oRogue.store.getters.getLevel).toBe(17)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 17
        })
    })
    it ('should reach level 18 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 18)
        expect(oRogue.store.getters.getLevel).toBe(18)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 18
        })
    })
    it ('should reach level 19 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 19)
        expect(oRogue.store.getters.getLevel).toBe(19)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 19
        })
    })
    it ('should reach level 20 without problem', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 20)
        expect(oRogue.store.getters.getLevel).toBe(20)
        expect(oRogue.store.getters.getLevelByClass).toEqual({
            'rogue': 20
        })
    })
})

describe('use sleight of hand and thieves tool', function () {
    it ('should have a bonus of zero when creature is a fighter with dex 10', function () {
        const { manager, evolution } = buildStuff()
        const oFighter = evolution.setupCreatureFromTemplate(new Creature(), 'template-fighter-generic', 5)
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 5)
        oRogue.processEffects()
        oFighter.processEffects()
        oFighter.dice.cheat(0.5)
        oRogue.dice.cheat(0.5)
        const s1 = oFighter.rollSkill('skill-sleight-of-hand', 0)
        expect(s1).toEqual({
            bonus: 2,
            roll: 11,
            value: 13,
            dc: 0,
            success: true,
            ability: 'ABILITY_DEXTERITY',
            circumstance: 0
        })
        const s2 = oRogue.rollSkill('skill-sleight-of-hand', 0)
        expect(oRogue.store.getters.getProficiencyBonus).toBe(3)
        expect(s2).toEqual({
            bonus: 6, // dex 3 + prof 3
            roll: 11,
            value: 17, // 11 + dex + prof
            dc: 0,
            success: true,
            ability: 'ABILITY_DEXTERITY',
            circumstance: 0
        })
        const s3 = oFighter.rollSkill('skill-sleight-of-hand', 0, 'PROFICIENCY_TOOL_THIEVES_TOOLS')
        expect(s3).toEqual({
            bonus: 2,
            roll: 11,
            value: 13,
            dc: 0,
            success: true,
            ability: 'ABILITY_DEXTERITY',
            circumstance: 0
        })
        const s4 = oRogue.rollSkill('skill-sleight-of-hand', 0, 'PROFICIENCY_TOOL_THIEVES_TOOLS')
        expect(s4).toEqual({
            bonus: 9, // dex 3 + prof 3 + prof-tools 3
            roll: 11,
            value: 20, // 11 + dex + prof + prof-tools 3
            dc: 0,
            success: true,
            ability: 'ABILITY_DEXTERITY',
            circumstance: 0
        })
    })
})

describe('rogue reliable talent', function () {
    it('should roll 10 when dice is cheated at 0.1', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
        oRogue.dice.cheat(0.1)
        oRogue.processEffects()
        const s2 = oRogue.rollSkill('skill-sleight-of-hand', 0)
        expect(oRogue.store.getters.getProficiencyBonus).toBe(4)
        expect(oRogue.store.getters.getEffectList.has('EFFECT_SKILL_EXPERTISE_MINIMUM_ROLL')).toBeTrue()
        expect(s2).toEqual({
            bonus: 8, // dex 4 + prof 4
            roll: 10,
            value: 18, // 11 + dex + prof
            dc: 0,
            success: true,
            ability: 'ABILITY_DEXTERITY',
            circumstance: 0
        })
        const s3 = oRogue.rollSkill('skill-arcana', 0)
        expect(oRogue.store.getters.getProficiencyBonus).toBe(4)
        expect(oRogue.store.getters.getEffectList.has('EFFECT_SKILL_EXPERTISE_MINIMUM_ROLL')).toBeTrue()
        expect(s3).toEqual({
            bonus: 2,
            roll: 3,
            value: 5,
            dc: 0,
            success: true,
            ability: 'ABILITY_INTELLIGENCE',
            circumstance: 0
        })
    })
})

describe('supreme sneak', function () {
    it('should have advantage on sneak when reachin level 9', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
        oRogue.processEffects()
        oRogue.dice.cheat(0.5)
        expect(oRogue.store.getters.getEffectList.has('EFFECT_ADVANTAGE')).toBeTrue()
        expect(oRogue.getCircumstances('ROLL_TYPE_CHECK', ['skill-stealth'])).toEqual({
          advantage: true,
          disadvantage: false,
          details: { advantages: [ 'feat-supreme-sneak' ], disadvantages: [] }
        })
        expect(oRogue.rollSkill('skill-stealth', 0)).toEqual({
            bonus: 8,
            roll: 11,
            value: 19,
            dc: 0,
            success: true,
            ability: 'ABILITY_DEXTERITY',
            circumstance: 1
        })
    })
})

describe('evasion', function () {
    describe('when having evasion', function () {
        it('should reduce damage when failing saving throw', function () {
            const { manager, evolution } = buildStuff()
            const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
            oRogue.processEffects()
            oRogue.dice.cheat(0.1)
            const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
            oWizard.processEffects()
            const nHP1 = oRogue.store.getters.getHitPoints
            SpellHelper.evocationAttack({
                caster: oWizard,
                target: oRogue,
                damage: 10,
                dc: 50,
                type: 'DAMAGE_TYPE_FIRE'
            })
            const nHP2 = oRogue.store.getters.getHitPoints
            expect(nHP1 - nHP2).toBe(5)
        })
        it('should nullify damage when succeeding saving throw', function () {
            const { manager, evolution } = buildStuff()
            const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
            oRogue.processEffects()
            oRogue.dice.cheat(0.9)
            const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
            oWizard.processEffects()
            const nHP1 = oRogue.store.getters.getHitPoints
            SpellHelper.evocationAttack({
                caster: oWizard,
                target: oRogue,
                damage: 10,
                dc: 1,
                type: 'DAMAGE_TYPE_FIRE'
            })
            const nHP2 = oRogue.store.getters.getHitPoints
            expect(nHP1 - nHP2).toBe(0)
        })
    })
})

describe('use magic device', function () {
    it('should have feat use magic device when reaching level 13', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 13)
        oRogue.processEffects()
        expect(oRogue.store.getters.getFeats.has('feat-use-magic-device')).toBeTrue()
    })
    it('should not have feat use magic device when not reaching level 13', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 11)
        oRogue.processEffects()
        expect(oRogue.store.getters.getFeats.has('feat-use-magic-device')).toBeFalse()
    })
})

describe('blindsight', function () {
    it('should not see target', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 14)
        oRogue.processEffects()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 5)
        const eInvis = oWizard.EffectProcessor.createEffect('EFFECT_INVISIBILITY')
        oWizard.applyEffect(eInvis, 10, oWizard)
        oWizard.processEffects()
        oRogue.processEffects()
        oRogue.setTarget(oWizard)
        oWizard.processEffects()
        oRogue.processEffects()
        expect(oWizard.store.getters.getEffectList.has('EFFECT_INVISIBILITY')).toBeTrue()
        expect(oWizard.store.getters.getConditions.has('CONDITION_INVISIBLE')).toBeTrue()
        expect(oRogue.store.getters.getEntityVisibility).toEqual({
            detectable: { target: false, aggressor: false },
            detectedBy: { target: true, aggressor: true }
        })
    })
})

describe('elusive', function () {
    it('should be advantaged when invisible and attacking non-elusive target', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 14)
        oRogue.processEffects()
        const oFighter = evolution.setupCreatureFromTemplate(new Creature(), 'template-fighter-generic', 14)
        oFighter.processEffects()
        const eInvis = oFighter.EffectProcessor.createEffect('EFFECT_INVISIBILITY')
        oFighter.applyEffect(eInvis, 100)
        oRogue.processEffects()
        oFighter.processEffects()
        oFighter.setTarget(oRogue)
        expect(oRogue.store.getters.getEffectList.has('EFFECT_ELUSIVE')).toBeFalse()
        expect(oFighter.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeTrue()
        expect(oFighter.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('UNDETECTED'))
            .toBeTrue()
    })
    it('should not be advantaged when invisible and attacking elusive target', function () {
        const { manager, evolution } = buildStuff()
        const oRogue = evolution.setupCreatureFromTemplate(new Creature(), 'template-rogue-generic', 18)
        oRogue.processEffects()
        const oFighter = evolution.setupCreatureFromTemplate(new Creature(), 'template-fighter-generic', 18)
        oFighter.processEffects()
        const eInvis = oFighter.EffectProcessor.createEffect('EFFECT_INVISIBILITY')
        oFighter.applyEffect(eInvis, 100)
        oRogue.processEffects()
        oFighter.processEffects()
        oFighter.setTarget(oRogue)
        expect(oRogue.store.getters.getEffectList.has('EFFECT_ELUSIVE')).toBeTrue()
        expect(oFighter.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.value).toBeFalse()
        expect(oFighter.store.getters.getAdvantages.ROLL_TYPE_ATTACK.ABILITY_STRENGTH.rules.includes('UNDETECTED'))
            .toBeFalse()
    })
})