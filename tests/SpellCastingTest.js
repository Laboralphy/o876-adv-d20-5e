const Creature = require("../src/Creature");
const Evolution = require('../src/Evolution')
const Manager = require('../src/Manager')
const AssetManager = require('../src/AssetManager')
const { Config, CONFIG } = require('../src/config')
const CONSTS = require("../src/consts");
const itemProperties = require('../src/item-properties')

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
            friends: [oWizard],
            cheat: true
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
            friends: [oWizard],
            cheat: true
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
            friends: [oWizard],
            cheat: true
        })
        expect(oTarget.store.getters.getRecentDamageTypes).toEqual({ DAMAGE_TYPE_FIRE: 6 })
    })
})

describe('poison-spray', function () {
    it('should deal 0 poison damage when success saving throw', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        oTarget.dice.cheat(0.9999)
        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']
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
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oWizard.setTarget(oTarget)
        oTarget.dice.cheat(0.0)
        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']
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
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']

        const aAdvEffects0 = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_ADVANTAGE)
        expect(aAdvEffects0.length).toBe(0)

        pCast({
            caster: oWizard,
            spell: 'true-strike',
            cheat: true
        })

        const aAdvEffects = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_ADVANTAGE)
        const aConEffects = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_CONCENTRATION)
        expect(aAdvEffects.length).toBe(1)
        expect(aConEffects.length).toBe(1)

        pCast({
            caster: oWizard,
            spell: 'true-strike',
            cheat: true
        })

        const aAdvEffects2 = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_ADVANTAGE)
        const aConEffects2 = oWizard.store.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_CONCENTRATION)
        expect(aAdvEffects2.length).toBe(2) // adv + eoa
        expect(aConEffects2.length).toBe(1)
    })
})

describe('zap', function () {
    it('should zap and stun target when fail saving throw', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.1)
        oWizard.setTarget(oTarget)

        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']

        pCast({
            caster: oWizard,
            spell: 'zap',
            cheat: true,
            hostiles: [oTarget]
        })

        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_STUNNED)).toBeTrue()
        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_INCAPACITATED)).toBeTrue()

        oTarget.processEffects()
        oWizard.processEffects()

        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_STUNNED)).toBeTrue()
        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_INCAPACITATED)).toBeTrue()

        oTarget.processEffects()
        oWizard.processEffects()

        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_STUNNED)).toBeFalse()
        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_INCAPACITATED)).toBeFalse()
    })
    it('should not stun target when success saving throw', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.999)
        oWizard.setTarget(oTarget)

        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']

        pCast({
            caster: oWizard,
            spell: 'zap',
            cheat: true,
            hostiles: [oTarget]
        })

        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_STUNNED)).toBeFalse()
        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_INCAPACITATED)).toBeFalse()
    })
    it('should not stun target when fail saving throw but have condition immunity', function () {
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oTarget = manager.createEntity('c-soldier')
        oWizard.dice.cheat(0.5)
        oTarget.dice.cheat(0.1)
        oWizard.setTarget(oTarget)

        oTarget.applyEffect(oTarget.EffectProcessor.createEffect(
            CONSTS.EFFECT_CONDITION_IMMUNITY,
            CONSTS.CONDITION_STUNNED
        ), 10, oTarget)

        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']

        pCast({
            caster: oWizard,
            spell: 'zap',
            cheat: true,
            hostiles: [oTarget]
        })

        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_STUNNED)).toBeFalse()
        expect(oTarget.store.getters.getConditions.has(CONSTS.CONDITION_INCAPACITATED)).toBeFalse()
    })
})

describe('remove-curse', function () {
    it ('should not be able to remove cursed item', function () {
        const {manager, evolution} = buildStuff()
        const oWizard = evolution
            .setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 6)

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
            .setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 6)

        const oCursedDagger = manager.createEntity('wpn-dagger')
        oCursedDagger.properties.push(itemProperties[CONSTS.ITEM_PROPERTY_CURSED]())
        const oNormalDagger = manager.createEntity('wpn-dagger')

        oWizard.equipItem(oCursedDagger)
        oWizard.equipItem(oNormalDagger)
        expect(oWizard.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toEqual(oCursedDagger)
        const {cursed: c1} = oWizard.unequipItem(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        expect(oWizard.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toEqual(oCursedDagger)
        expect(c1).toBeTrue()

        const pCast = Creature.AssetManager.scripts['ddmagic-cast-spell']

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
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oHiddenOne = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oAggressiveOne = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        oAggressiveOne.setTarget(oHiddenOne)
        const v1 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v1.detectable.target).toBeTrue()
        expect(v1.detectedBy.target).toBeTrue()

        Creature.AssetManager.scripts['ddmagic-cast-spell']({
            spell: 'invisibility',
            caster: oWizard,
            friends: [oHiddenOne],
            target: oHiddenOne,
            cheat: true
        })

        expect(oHiddenOne.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()

        const v2 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v2.detectable.target).toBeFalse()
        expect(v2.detectedBy.target).toBeTrue()
    })

    it ('hidden1 should become visible again when casting invisibility to another creature', function () {
        const printEffect = (eff, s = '') => {
            console.log(eff.id, eff.type, eff.duration, s, eff._debug || '*')
        }
        const { manager, evolution } = buildStuff()
        const oWizard = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const aEvents = []
        oWizard.events.on('spellcast-concentration-end', ev => {
            aEvents.push({ type: 'spellcast-concentration-end', ...ev })
        })
        oWizard.events.on('spellcast-concentration', ev => {
            aEvents.push({ type: 'spellcast-concentration', ...ev })
        })
        const oHidden1 = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oHidden2 = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        const oAggressiveOne = evolution.setupCreatureFromTemplate(new Creature(), 'template-wizard-generic', 3)
        oAggressiveOne.setTarget(oHidden1)
        Creature.AssetManager.scripts['ddmagic-cast-spell']({
            spell: 'invisibility',
            caster: oWizard,
            friends: [oHidden1, oHidden2],
            target: oHidden1,
            cheat: true
        })
        printEffect(oHidden1.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_INVISIBILITY), 'vient de caster invisibility pour la premier fois')
        expect(oHidden1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        expect(oHidden2.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeFalse()
        const v2 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v2.detectable.target).toBeFalse()
        expect(v2.detectedBy.target).toBeTrue()

        const eInvis1 = oHidden1.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_INVISIBILITY)
        expect(eInvis1.duration).toBe(600)

        Creature.AssetManager.scripts['ddmagic-cast-spell']({
            spell: 'invisibility',
            caster: oWizard,
            friends: [oHidden1, oHidden2],
            target: oHidden2,
            cheat: true
        })

        oWizard.processEffects()
        expect(aEvents.length).toBe(3)
        expect(aEvents[1].reason).toBe('CONCENTRATION_CHANGE')
        expect(oHidden1.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_INVISIBILITY)).toBeUndefined()
        expect(oHidden1.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeFalse()
        expect(oHidden2.store.getters.getConditions.has(CONSTS.CONDITION_INVISIBLE)).toBeTrue()
        const v3 = oAggressiveOne.store.getters.getEntityVisibility
        expect(v3.detectable.target).toBeTrue()
        expect(v3.detectedBy.target).toBeTrue()


    })

})