const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const AssetManager = require('../src/AssetManager')
const CONSTS = require("../src/consts");
const itemProperties = require('../src/item-properties')

function buildStuff () {
    const r = new Manager()
    r.config.setModuleActive('classic', true)
    r.config.setModuleActive('ddmagic', true)
    r.init()
    const ev = new Evolution()
    ev.data = r.assetManager.data
    return {
        manager: r,
        evolution: ev
    }
}

describe('acid-splash', function () {
    it('should run cast script', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.assetManager = oTarget.assetManager = manager.assetManager
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.1)
        oWizard.setTarget(oTarget)
        expect(typeof manager.assetManager.scripts['ddmagic-cast-spell']).toBe('function')
        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']
        expect(typeof pCast).toBe('function')
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({})
        pCast({
            caster: oWizard,
            spell: 'acid-splash',
            hostiles: [oTarget],
            friends: [oWizard],
            cheat: true
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_ACID: 4 })
    })
    it('should splash acid on two creatures when having several hostiles', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget1 = manager.createEntity('c-soldier')
        const oTarget2 = manager.createEntity('c-soldier')
        const oTarget3 = manager.createEntity('c-soldier')
        expect(manager.assetManager).toBeDefined()
        oWizard.dice.cheat(0.5)
        oTarget1.dice.cheat(0.1)
        oTarget2.dice.cheat(0.1)
        oTarget3.dice.cheat(0.1)
        oWizard.setTarget(oTarget1)
        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']
        expect(oTarget1.store.getters.getRecentDamageTypes).toEqual({})
        expect(oTarget2.store.getters.getRecentDamageTypes).toEqual({})
        const aHostiles = [oTarget1, oTarget2, oTarget3]
        pCast({
            caster: oWizard,
            spell: 'acid-splash',
            hostiles: aHostiles,
            friends: [oWizard],
            cheat: true
        })
        expect(oTarget1.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_ACID: 4 })
        expect(aHostiles.filter(h => h.store.getters.getRecentDamageTypes.DAMAGE_TYPE_ACID === 4).length)
            .toBe(2)
    })
})

describe('chill-touch', function () {
    it('should deal necrotic damage', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']
        const aHostiles = [oTarget]
        pCast({
            caster: oWizard,
            spell: 'chill-touch',
            hostiles: aHostiles,
            friends: [oWizard],
            cheat: true
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_NECROTIC: 5 })
    })
})
describe('fire-bolt', function () {
    it('should deal fire damage', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']
        const aHostiles = [oTarget]
        pCast({
            caster: oWizard,
            spell: 'fire-bolt',
            hostiles: aHostiles,
            friends: [oWizard],
            cheat: true
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_FIRE: 6 })
    })
})

describe('poison-spray', function () {
    it('should deal 0 poison damage when success saving throw', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        oTarget.dice.cheat(0.9999)
        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']
        const aHostiles = [oTarget]
        const nTargetHP = oTarget.store.getters.getHitPoints
        pCast({
            caster: oWizard,
            spell: 'poison-spray',
            hostiles: aHostiles,
            friends: [oWizard],
            cheat: true
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ })
        expect(oTarget.store.getters.getHitPoints).toBe(nTargetHP)
    })
    it('should deal full poison damage when failing saving throw', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        oTarget.dice.cheat(0.0)
        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']
        const aHostiles = [oTarget]
        const nTargetHP = oTarget.store.getters.getHitPoints
        pCast({
            caster: oWizard,
            spell: 'poison-spray',
            hostiles: aHostiles,
            friends: [oWizard],
            cheat: true
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_POISON: 7 })
        expect(oTarget.store.getters.getHitPoints).toBeLessThan(nTargetHP)
    })
})

describe('true-strike', function () {
    it('should change concentration when casting spell two times', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']

        const aAdvEffects0 = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_ADVANTAGE)
        expect(aAdvEffects0.length).toBe(0)

        pCast({
            caster: oWizard,
            spell: 'true-strike',
            cheat: true
        })

        const aAdvEffects = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_ADVANTAGE)
        const aEOAEffects = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_END_ON_ATTACK)
        const aConEffects = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_CONCENTRATION)
        expect(aAdvEffects.length).toBe(1)
        expect(aEOAEffects.length).toBe(1) // end on attack
        expect(aConEffects.length).toBe(1)
        const sEffectId = aAdvEffects[0].id
        const sEffectEOAId = aEOAEffects[0].id
        expect(aConEffects[0].data.spellmark.spell).toBe('true-strike')
        const sConspellId = aConEffects[0].data.spellmark.id

        pCast({
            caster: oWizard,
            spell: 'true-strike',
            cheat: true
        })

        const aAdvEffects2 = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_ADVANTAGE)
        const aEOAEffects2 = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_END_ON_ATTACK)
        const aConEffects2 = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_CONCENTRATION)
        expect(aAdvEffects2.length).toBe(1) // adv
        expect(aEOAEffects2.length).toBe(1) // end on attack
        expect(aConEffects2.length).toBe(1) // end on attack
        expect(aAdvEffects2[0].id).not.toBe(sEffectId)
        expect(aEOAEffects2[0].id).not.toBe(sEffectEOAId)
        expect(aConEffects2[0].data.spellmark.id).not.toBe(sConspellId)
    })
})

describe('zap', function () {
    it('should zap and stun target when fail saving throw', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.1)
        oWizard.setTarget(oTarget)

        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']

        pCast({
            caster: oWizard,
            spell: 'zap',
            cheat: true,
            hostiles: [oTarget]
        })

        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_STUNNED)).toBeTrue()
        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_INCAPACITATED)).toBeTrue()

        oTarget.processEffects()
        oWizard.processEffects()

        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_STUNNED)).toBeTrue()
        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_INCAPACITATED)).toBeTrue()

        oTarget.processEffects()
        oWizard.processEffects()

        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_STUNNED)).toBeFalse()
        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_INCAPACITATED)).toBeFalse()
    })
    it('should not stun target when success saving throw', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.999)
        oWizard.setTarget(oTarget)

        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']

        pCast({
            caster: oWizard,
            spell: 'zap',
            cheat: true,
            hostiles: [oTarget]
        })

        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_STUNNED)).toBeFalse()
        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_INCAPACITATED)).toBeFalse()
    })
    it('should not stun target when fail saving throw but have condition immunity', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.1)
        oWizard.setTarget(oTarget)

        oTarget.applyEffect(oTarget.EffectProcessor.createEffect(
            CONSTS.EFFECT_CONDITION_IMMUNITY,
            CONSTS.CONDITION_STUNNED
        ), 10, oTarget)

        const pCast = oWizard.assetManager.scripts['ddmagic-cast-spell']

        pCast({
            caster: oWizard,
            spell: 'zap',
            cheat: true,
            hostiles: [oTarget]
        })

        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_STUNNED)).toBeFalse()
        expect(oTarget.store.getters.getConditionSet.has(CONSTS.CONDITION_INCAPACITATED)).toBeFalse()
    })
})

describe('remove-curse', function () {
    it ('should not be able to remove cursed item', function () {
        const {manager, evolution} = buildStuff()
        const oWizard = evolution
            .setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 6)

        const oCursedDagger = manager.createEntity('wpn-dagger')
        oCursedDagger.properties.push(itemProperties[CONSTS.ITEM_PROPERTY_CURSED]())
        const oNormalDagger = manager.createEntity('wpn-dagger')

        oWizard.equipItem(oCursedDagger)
        oWizard.equipItem(oNormalDagger)
        expect(oWizard.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toEqual(oCursedDagger)
        const {cursed: c1} = oWizard.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        expect(oWizard.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toEqual(oCursedDagger)
        expect(c1).toBeTrue()
    })

    it('should be able to remove cursed item when remove curse is cast', function () {
        const {manager, evolution} = buildStuff()
        const oWizard = evolution
            .setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 6)

        const oCursedDagger = manager.createEntity('wpn-dagger')
        oCursedDagger.properties.push(itemProperties[CONSTS.ITEM_PROPERTY_CURSED]())
        const oNormalDagger = manager.createEntity('wpn-dagger')

        oWizard.equipItem(oCursedDagger)
        oWizard.equipItem(oNormalDagger)
        expect(oWizard.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toEqual(oCursedDagger)
        const {cursed: c1} = oWizard.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        expect(oWizard.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toEqual(oCursedDagger)
        expect(c1).toBeTrue()

        const pCast = manager.assetManager.scripts['ddmagic-cast-spell']

        oWizard.setTarget(oWizard)

        pCast({
            caster: oWizard,
            spell: 'remove-curse',
            cheat: true,
            hostiles: [],
            friends: [oWizard]
        })

        expect(oWizard.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toBeNull()
    })
})


describe('invisibility', function () {
    it ('target should not be visible when casting invisibility', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oHiddenOne = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oAggressiveOne = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        oAggressiveOne.setTarget(oHiddenOne)
        const v1 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v1.detectable.target).toBeTrue()
        expect(v1.detectedBy.target).toBeTrue()

        manager.assetManager.scripts['ddmagic-cast-spell']({
            spell: 'invisibility',
            caster: oWizard,
            friends: [oHiddenOne],
            target: oHiddenOne,
            cheat: true
        })

        expect(oHiddenOne.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()

        const v2 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v2.detectable.target).toBeFalse()
        expect(v2.detectedBy.target).toBeTrue()
    })

    it('hiddenOne should become visible again when concentration is broken or changed', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oHidden1 = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oHidden2 = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        const oAggressiveOne = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 3)
        oAggressiveOne.setTarget(oHidden1)
        oWizard.name = 'wizard'
        oHidden1.name = 'hidden 1'
        oHidden2.name = 'hidden 2'
        oAggressiveOne.name = 'Aggressor'
        const v0 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v0.detectable.target).toBeTrue()
        expect(v0.detectedBy.target).toBeTrue()

        oWizard.assetManager.scripts['ddmagic-cast-spell']({
            spell: 'invisibility',
            caster: oWizard,
            friends: [oHidden1, oHidden2],
            target: oHidden1,
            cheat: true
        })
        const eInvis0 = oHidden1
            .store
            .getters
            .getEffects
            .find(eff =>eff.type === CONSTS.EFFECT_INVISIBILITY)
        // On retrouve l'effet qui a été pushé dans le registre d'effet du SpellCast
        expect(eInvis0).toBeDefined()
        expect(eInvis0.duration).toBe(600)

        expect(oHidden1.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        const v1 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v1.detectable.target).toBeFalse()
        expect(v1.detectedBy.target).toBeTrue()

        manager.assetManager.scripts['ddmagic-cast-spell']({
            spell: 'invisibility',
            caster: oWizard,
            friends: [oHidden1, oHidden2],
            target: oHidden2,
            cheat: true
        })

        oWizard.processEffects()
        oHidden1.processEffects()
        oHidden2.processEffects()
        oAggressiveOne.processEffects()

        // j'ai beau faire, avec mon effet concentration, je ne pourrai jamais éteindre les
        // effets stockés chez d'autres créatures.

        expect(oHidden2.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(eInvis0).toBeDefined()
        expect(eInvis0.duration).toBe(0)
        expect(oHidden1.store.getters.getConditionSet.has(CONSTS.CONDITION_INVISIBLE)).toBeFalse()
        const v2 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v2.detectable.target).toBeTrue()
        expect(v2.detectedBy.target).toBeTrue()
    })
})

fdescribe('animated dead', function () {
    it('should trigger summon-creature when summoning creature', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 8)
        const aLog = []
        oWizard.events.on('summon-creature', function (ev) {
            aLog.push({ ref: ev.ref, level: ev.level })
        })
        oWizard.assetManager.scripts['ddmagic-cast-spell']({
            spell: 'animated-dead',
            caster: oWizard,
            friends: [],
            target: null,
            cheat: true
        })
        expect(aLog).toEqual([ { ref: 'c-skeleton', level: 8 } ])
    })
    it('should setup summoned creature as undead when casting spell', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 9)
        /**
         *
         * @type {Creature}
         */
        let oSummonedCreature = null
        oWizard.events.on('summon-creature', function (ev) {
            oSummonedCreature = ev.creature = manager.createEntity(ev.ref)
        })
        oWizard.assetManager.scripts['ddmagic-cast-spell']({
            spell: 'animated-dead',
            caster: oWizard,
            friends: [],
            target: null,
            cheat: true
        })
        expect(oSummonedCreature.store.getters.getSpecie).toBe(CONSTS.SPECIE_UNDEAD)
    })
    it('should create time limited creature', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(manager.entityFactory.createCreature(), 'template-wizard-generic', 9)
        /**
         *
         * @type {Creature}
         */
        let oSummonedCreature = null
        oWizard.events.on('summon-creature', function (ev) {
            oSummonedCreature = ev.creature = manager.createEntity(ev.ref)
        })
        oWizard.assetManager.scripts['ddmagic-cast-spell']({
            spell: 'animated-dead',
            caster: oWizard,
            friends: [],
            target: null,
            cheat: true
        })
        const aLogDS = []
        oSummonedCreature.events.on('despawn', ev => {
            aLogDS.push(ev)
        })
        const eTTL = oSummonedCreature.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_TIME_TO_LIVE)
        expect(eTTL.duration).toBe(24 * 60 * 10)
        eTTL.duration = 1
        const eTTL2 = oSummonedCreature.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_TIME_TO_LIVE)
        expect(eTTL2.duration).toBe(1)
        oSummonedCreature.processEffects()
        expect(aLogDS).toEqual([{ reason: 'DESPAWN_REASON_TTL_EXPIRATION' }])
    })
})