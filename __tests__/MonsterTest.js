const ManagerProto = require("../src/Manager");
const EffectProcessor = require("../src/EffectProcessor");
const CONSTS = require("../src/consts");

class Manager extends ManagerProto {
    constructor() {
        super()
        this.config.setModuleActive('classic', true)
    }
}

describe('Troll regeneration', function () {
    it('should regain 10 hp when wounded by non acid weapon', function () {
        const r = new Manager()
        r.init()
        const troll = r.createEntity('c-troll')
        expect(troll.store.getters.getHitPoints).toBe(92)
        troll.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(troll.store.getters.getHitPoints).toBe(72)
        troll.processEffects()
        expect(troll.store.getters.getHitPoints).toBe(82)

        troll.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_FIRE))
        expect(troll.store.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_MUMMY_ROT)).toBeDefined()
        expect(troll.store.getters.getHitPoints).toBe(62)
        troll.processEffects()
        expect(troll.store.getters.getHitPoints).toBe(62)

        troll.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(troll.store.getters.getHitPoints).toBe(42)
        troll.processEffects()
        expect(troll.store.getters.getHitPoints).toBe(52)
    })

    it('should have a max damage of 2d8 instead of 1d8 when having greatclub', function () {
        const r = new Manager()
        r.init()
        const ogre = r.createEntity('c-ogre')
        ogre.dice.cheat(0)
        const minDamages = ogre.rollWeaponDamage()
        ogre.dice.cheat(0.999999)
        const maxDamages = ogre.rollWeaponDamage()
        expect(maxDamages.DAMAGE_TYPE_CRUSHING).toBe(20)
        expect(minDamages.DAMAGE_TYPE_CRUSHING).toBe(6)
    })
})

describe('Ogre', function () {
    it('should have a max damage of 2d8+4 instead of 1d8+4 when having greatclub', function () {
        const r = new Manager()
        r.config.setModuleActive('classic', true)
        r.init()
        const ogre = r.createEntity('c-ogre')
        ogre.dice.cheat(0)
        const minDamages = ogre.rollWeaponDamage()
        ogre.dice.cheat(0.999999)
        const maxDamages = ogre.rollWeaponDamage()
        expect(maxDamages.DAMAGE_TYPE_CRUSHING).toBe(20)
        expect(minDamages.DAMAGE_TYPE_CRUSHING).toBe(6)
    })
})

describe('Ghast', function () {
    it('should apply paralyzed condition', function () {
        const r = new Manager()
        r.init()
        const ghast = r.createEntity('c-ghast')
        ghast.dice.cheat(0.75)
        const goblin = r.createEntity('c-goblin-bow')
        goblin.dice.cheat(0.0)
        ghast.setTarget(goblin)
        ghast.setDistanceToTarget(4.5)
        ghast.attack(goblin)
        expect(goblin.store.getters.getConditionSet.has(CONSTS.CONDITION_PARALYZED)).toBeTruthy()
        ghast.processEffects()
        goblin.processEffects()
        const atk2 = ghast.attack(goblin)
        expect(goblin.store.getters.getConditionSet.has(CONSTS.CONDITION_PARALYZED)).toBeTruthy()
        expect(atk2.dice).toBe(16)
        expect(ghast.store.getters.isTargetInMeleeWeaponRange).toBeTruthy()
        expect(goblin.store.getters.getConditionSet.has(CONSTS.CONDITION_PARALYZED)).toBeTruthy()
        expect(goblin.store.getters.getConditionSet.has(CONSTS.CONDITION_UNCONSCIOUS)).toBeFalsy()
        expect(ghast.store.getters.isTargetAutoCritical).toBeTruthy()
        expect(atk2.critical).toBeTruthy()
        ghast.processEffects()
        goblin.processEffects()
        expect(goblin.store.getters.getConditionSet.has(CONSTS.CONDITION_PARALYZED)).toBeFalsy()
    })
    it('should be poisonned when approachin ghast within 5 ft', function () {
        const r = new Manager()
        r.init()
        const ghast = r.createEntity('c-ghast')
        ghast.dice.cheat(0.75)
        const gobVeryFar = r.createEntity('c-goblin-bow')
        gobVeryFar.dice.cheat(0.0)
        const gobJinxed = r.createEntity('c-goblin-shield')
        gobJinxed.dice.cheat(0.0)
        const gobLucky = r.createEntity('c-goblin-shield')
        gobLucky.dice.cheat(0.999)
        gobVeryFar.setTarget(ghast)
        gobJinxed.setTarget(ghast)
        gobLucky.setTarget(ghast)
        gobVeryFar.setDistanceToTarget(60)
        gobJinxed.setDistanceToTarget(5)
        gobLucky.setDistanceToTarget(5)
        ghast.processEffects()
        gobVeryFar.processEffects()
        gobJinxed.processEffects()
        gobLucky.processEffects()
        expect(gobVeryFar.store.getters.getConditionSet.has(CONSTS.CONDITION_POISONED)).toBeFalsy()
        expect(ghast.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR]).toBeDefined()
        expect(ghast.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR].properties[0].property).toBe('ITEM_PROPERTY_AURA')
        expect(ghast.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR].properties.find(({ property }) => property === CONSTS.ITEM_PROPERTY_AURA)).toBeDefined()
        expect(ghast.store.getters.getEquipmentItemProperties.find(({ property }) => property === CONSTS.ITEM_PROPERTY_AURA)).toBeDefined()
        expect(gobJinxed.store.getters.getConditionSet.has(CONSTS.CONDITION_POISONED)).toBeTruthy()
        expect(gobLucky.store.getters.getConditionSet.has(CONSTS.CONDITION_POISONED)).toBeFalsy()
    })
})


describe('Mummies', function () {
    it ('should resist to normal weapon', function () {
        const r = new Manager()
        r.init()
        const mummy = r.createEntity('c-mummy')
        const soldier = r.createEntity('c-soldier')
        soldier.dice.cheat(0.8)
        soldier.setTarget(mummy)
        soldier.setDistanceToTarget(5)
        const atk1 = soldier.attack(mummy)
        expect(atk1.damages).toEqual({
            amount: 5,
            resisted: { DAMAGE_TYPE_SLASHING: 5 },
            types: { DAMAGE_TYPE_SLASHING: 5 }
        })
    })
    it ('should not be damage by poison weapon', function () {
        const r = new Manager()
        r.init()
        const mummy = r.createEntity('c-mummy')
        const soldier = r.createEntity('c-soldier')
        const flamingPoisonedSword = r.createEntity('wpn-longsword')
        r.addItemProperty(flamingPoisonedSword, CONSTS.ITEM_PROPERTY_DAMAGE_BONUS, { type: CONSTS.DAMAGE_TYPE_POISON, amp: '1d6' })
        r.addItemProperty(flamingPoisonedSword, CONSTS.ITEM_PROPERTY_DAMAGE_BONUS, { type: CONSTS.DAMAGE_TYPE_FIRE, amp: '1d6' })
        soldier.equipItem(flamingPoisonedSword)
        soldier.dice.cheat(0.8)
        soldier.setTarget(mummy)
        soldier.setDistanceToTarget(5)
        const atk1 = soldier.attack(mummy)
        expect(atk1.damages).toEqual({
            amount: 15,
            resisted: {
                DAMAGE_TYPE_SLASHING: 5,
                DAMAGE_TYPE_POISON: 5,
                DAMAGE_TYPE_FIRE: -5
            },
            types: {
                DAMAGE_TYPE_SLASHING: 5,
                DAMAGE_TYPE_POISON: 0,
                DAMAGE_TYPE_FIRE: 10
            }
        })
    })
    it ('should not be damage by poison weapon', function () {
        const r = new Manager()
        r.init()
        const mummy = r.createEntity('c-mummy')
        const soldier = r.createEntity('c-soldier')
        const flamingPoisonedSilverSword = r.createEntity('wpn-longsword')
        r.addItemProperty(flamingPoisonedSilverSword, CONSTS.ITEM_PROPERTY_DAMAGE_BONUS, { type: CONSTS.DAMAGE_TYPE_POISON, amp: '1d6' })
        r.addItemProperty(flamingPoisonedSilverSword, CONSTS.ITEM_PROPERTY_DAMAGE_BONUS, { type: CONSTS.DAMAGE_TYPE_FIRE, amp: '1d6' })
        flamingPoisonedSilverSword.material = CONSTS.MATERIAL_SILVER
        soldier.equipItem(flamingPoisonedSilverSword)
        soldier.dice.cheat(0.8)
        soldier.setTarget(mummy)
        soldier.setDistanceToTarget(5)
        const atk1 = soldier.attack(mummy)
        expect(atk1.damages).toEqual({
            amount: 20,
            resisted: {
                DAMAGE_TYPE_SLASHING: 0,
                DAMAGE_TYPE_POISON: 5,
                DAMAGE_TYPE_FIRE: -5
            },
            types: {
                DAMAGE_TYPE_SLASHING: 10, // pas de resistance au slash
                DAMAGE_TYPE_POISON: 0, // toujour invulnerable au poison
                DAMAGE_TYPE_FIRE: 10 // vulnerabilité normale au feu de la momie (pas de double malus du au matériaux)
            }
        })
    })
    it ('mummy lord should not be damaged by normal weapon, but damaged by silver weapon', function () {
        const r = new Manager()
        r.init()
        const mummy = r.createEntity('c-mummy')
        const soldier = r.createEntity('c-soldier')
        const silverSword = r.createEntity('wpn-longsword')
        silverSword.material = CONSTS.MATERIAL_SILVER
        soldier.equipItem(silverSword)
        soldier.dice.cheat(0.8)
        soldier.setTarget(mummy)
        soldier.setDistanceToTarget(5)
        const atk1 = soldier.attack(mummy)
        expect(atk1.damages).toEqual({
            amount: 10,
            resisted: { DAMAGE_TYPE_SLASHING: 0 },
            types: { DAMAGE_TYPE_SLASHING: 10 }
        })
    })

    it('should be advantaged on spells', function () {
        const r = new Manager()
        r.init()
        const mummy = r.createEntity('c-mummy-lord') // J'avais créé un c-mummy, au lieu d'un c-mummy-lord
        expect(mummy.store.getters.getEquipmentItemProperties.find(eq => eq.property === CONSTS.ITEM_PROPERTY_ADVANTAGE)).toBeDefined()
        expect(mummy.aggregateModifiers([CONSTS.ITEM_PROPERTY_ADVANTAGE], {}).count).toBe(1)
        const st = mummy.rollSavingThrow(CONSTS.ABILITY_WISDOM, [CONSTS.THREAT_TYPE_SPELL], 20)
        expect(st.circumstance).toBe(1)
    })
})



describe('zombie', function () {
    it('should not kill zombie when using non radiant damage', function () {
        const r = new Manager()
        r.init()
        const zombie = r.createEntity('c-zombie')
        expect(zombie.store.getters.getHitPoints).toBe(27)
        zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 25, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(zombie.store.getters.getHitPoints).toBe(2)
        zombie.dice.cheat(0.8)
        const eDam1 = zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 3, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(zombie.store.getters.getHitPoints).toBe(1)
        expect(eDam1.amp).toBe(1)
        expect(eDam1.data.resistedAmount).toBe(2)
    })
    it('should kill zombie when using non radiant damage but fail save', function () {
        const r = new Manager()
        r.init()
        const zombie = r.createEntity('c-zombie')
        expect(zombie.store.getters.getHitPoints).toBe(27)
        zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 25, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(zombie.store.getters.getHitPoints).toBe(2)
        zombie.dice.cheat(0.2)
        const eDam1 = zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 30, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(zombie.store.getters.getHitPoints).toBe(-28)
        expect(eDam1.amp).toBe(30)
        expect(eDam1.data.resistedAmount).toBe(0)
    })
    it('should kill zombie when using radiant damage', function () {
        const r = new Manager()
        r.init()
        const zombie = r.createEntity('c-zombie')
        expect(zombie.store.getters.getHitPoints).toBe(27)
        zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(zombie.store.getters.getHitPoints).toBe(7)
        zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_RADIANT));
        expect(zombie.store.getters.getHitPoints).toBeLessThanOrEqual(0)
    })
    it('should kill zombie when delivering critical', function () {
        const r = new Manager()
        r.init()
        const zombie = r.createEntity('c-zombie')
        expect(zombie.store.getters.getHitPoints).toBe(27)
        zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_SLASHING))
        expect(zombie.store.getters.getHitPoints).toBe(7)
        const eDam1 = zombie.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, 20, CONSTS.DAMAGE_TYPE_SLASHING, CONSTS.MATERIAL_STEEL, true))
        expect(eDam1.data.critical).toBeTruthy()
        expect(zombie.store.getters.getHitPoints).toBeLessThanOrEqual(0)
    })
})

describe('wight', function () {
    it('should apply life drain', function () {
        const r = new Manager()
        r.init()
        const wight = r.createEntity('c-wight')
        const soldier = r.createEntity('c-soldier')
        wight.dice.cheat(0.8)
        soldier.dice.cheat(0.01)
        wight.setTarget(soldier)
        wight.setDistanceToTarget(0)
        expect(soldier.store.getters.getMaxHitPoints).toBe(44)
        const oAtk = wight.attack()
        expect(oAtk.damages.amount).toBe(9)
        expect(soldier.store.getters.getMaxHitPoints).toBe(35)
        expect(soldier.store.getters.getHitPoints).toBe(35)
        wight.attack()
        wight.attack()
        wight.attack()
        expect(soldier.store.getters.getMaxHitPoints).toBe(8)
        expect(soldier.store.getters.getHitPoints).toBe(8)
        wight.attack()
        expect(soldier.store.getters.getMaxHitPoints).toBe(-1)
        expect(soldier.store.getters.getHitPoints).toBe(-1)
    })
})

describe('vampire', function () {
    it('should not be attacked by charmed targets', function () {
        const r = new Manager()
        r.init()
        const vampire = r.createEntity('c-vampire')
        const soldier = r.createEntity('c-soldier')
        vampire.setTarget(soldier)
        soldier.setTarget(vampire)
        vampire.setDistanceToTarget(5)
        soldier.dice.cheat(0.01)
        vampire.dice.cheat(0.9)
        vampire.action('sla-vampire-charm')
        expect(soldier.store.getters.getConditionSet.has(CONSTS.CONDITION_CHARMED)).toBeTruthy()
        const a = soldier.attack()
        expect(a.failed).toBeTruthy()
        expect(a.failure).toBe('ATTACK_OUTCOME_CONDITION')
        expect(soldier.store.getters.getConditionSet.has(CONSTS.CONDITION_CHARMED)).toBeTruthy()
        vampire.attack()
        expect(soldier.store.getters.getConditionSet.has(CONSTS.CONDITION_CHARMED)).toBeFalsy()
    })
})
