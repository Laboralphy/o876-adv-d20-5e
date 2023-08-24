const Comparator = require('../src/Comparator')
const Manager = require('../src/Manager')
const CONFIG = require('../src/config')
const CONSTS = require('../src/consts')

CONFIG.setModuleActive('classic', true)
describe('Chances to hit', function () {
    it ('shoud compute chances to hit', function () {
        expect(Comparator.computeHitProbability(10, 9)).toBe(0.95)
        expect(Comparator.computeHitProbability(10, 10)).toBe(0.95)
        expect(Comparator.computeHitProbability(10, 11)).toBe(0.95)
        expect(Comparator.computeHitProbability(10, 12)).toBe(0.90)
        expect(Comparator.computeHitProbability(10, 13)).toBe(0.85)
        expect(Comparator.computeHitProbability(10, 14)).toBe(0.80)
        expect(Comparator.computeHitProbability(10, 15)).toBe(0.75)
        expect(Comparator.computeHitProbability(10, 16)).toBe(0.70)
        expect(Comparator.computeHitProbability(10, 17)).toBe(0.65)
        expect(Comparator.computeHitProbability(10, 18)).toBe(0.60)
        expect(Comparator.computeHitProbability(10, 19)).toBe(0.55)
        expect(Comparator.computeHitProbability(10, 20)).toBe(0.50)
        expect(Comparator.computeHitProbability(10, 21)).toBe(0.45)
        expect(Comparator.computeHitProbability(10, 22)).toBe(0.40)
        expect(Comparator.computeHitProbability(10, 23)).toBe(0.35)
        expect(Comparator.computeHitProbability(10, 24)).toBe(0.30)
        expect(Comparator.computeHitProbability(10, 25)).toBe(0.25)
        expect(Comparator.computeHitProbability(10, 26)).toBe(0.20)
        expect(Comparator.computeHitProbability(10, 27)).toBe(0.15)
        expect(Comparator.computeHitProbability(10, 28)).toBe(0.10)
        expect(Comparator.computeHitProbability(10, 29)).toBe(0.05)
        expect(Comparator.computeHitProbability(10, 30)).toBe(0.05)
    })

    it ('should not change damage when no mitigation', function () {
        expect(Comparator.computeMitigatedDamage({ slashing: 5 }, {})).toEqual(5)
        expect(Comparator.computeMitigatedDamage({ slashing: 5, fire: 2 }, {})).toEqual(7)
    })

    it ('should change damage when mitigation is set', function () {
        expect(Comparator.computeMitigatedDamage({ slashing: 5, fire: 2 }, { fire: { factor: 0.5 }})).toEqual(6)
        expect(Comparator.computeMitigatedDamage({ slashing: 5, cold: 2 }, { fire: { factor: 0.5 }})).toEqual(7)
        expect(Comparator.computeMitigatedDamage({ slashing: 5, fire: 2 }, { fire: { factor: 0 }})).toEqual(5)
        expect(Comparator.computeMitigatedDamage({ slashing: 10, fire: 2 }, { slashing: { factor: 0.5, reduction: 2 }})).toEqual(5 /* 10/2 - 2 + 2 */)
        expect(Comparator.computeMitigatedDamage({ slashing: 10, fire: 2 }, { slashing: { factor: 1, reduction: 2 }, fire: { factor: 0 }})).toEqual(8)
    })

    it ('should compute TTk', function () {
        expect(Comparator.computeTurnsToKill({
            adv: {
                hp: 30,
                ac: 14,
                damageMitigation: {}
            },
            you: {
                weapon: 'dirk',
                atk: 5,
                atkCount: 1,
                damages: {
                    slashing: 4
                }
            }
        })).toEqual({
            hasWeapon: true,
            tohit: 0.55,
            dpa: 4,
            apt: 1,
            hp: 30,
            dpt: 2.2,
            attacks: 14,
            turns: 14
        })
        expect(Comparator.computeTurnsToKill({
            adv: {
                hp: 30,
                ac: 14,
                damageMitigation: {
                    slashing: {
                        factor: 0.5,
                        reduction: 0
                    }
                }
            },
            you: {
                weapon: 'dirk',
                atk: 5,
                atkCount: 1,
                damages: {
                    slashing: 4
                }
            }
        })).toEqual({
            hasWeapon: true,
            tohit: 0.55,
            apt: 1,
            hp: 30,
            dpa: 2,
            dpt: 1.1,
            attacks: 28,
            turns: 28
        })
    })
})

describe('real combat', function () {
    it ('mephit should win', function () {
        const r = new Manager()
        r.init()
        const c1 = r.createEntity('c-goblin-bow')
        const c2 = r.createEntity('c-mephit-magma')
        expect(c1.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).not.toBeNull()
        expect(Comparator.getMeleeSlot(c1)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        const cc1 = Comparator.considerP1(c1, c2)
        const cc2 = Comparator.considerP1(c2, c1)

        expect(cc1.melee.tohit).toBe(0.65)
        expect(cc1.melee.dpa).toBe(6)
        expect(cc1.melee.dpt).toBeCloseTo(3.90, 2)
        expect(cc1.melee.hp).toBe(27)
        expect(cc1.melee.attacks).toBe(7)
        expect(cc1.melee.turns).toBe(7)

        expect(cc2.melee.tohit).toBe(0.55)
        expect(cc2.melee.dpa).toBe(7)
        expect(cc2.melee.dpt).toBeCloseTo(3.85, 2)
        expect(cc2.melee.hp).toBe(14)
        expect(cc2.melee.attacks).toBe(4)
        expect(cc2.melee.turns).toBe(4)

        // les hp restant de gob après son combat avec meph
        // 14 - 7 * 3.85 = -12.95
        expect(Comparator.considerHPLeft(cc1.melee, cc2.melee)).toBeCloseTo(-12.95, 2)

        // les hp de meph après son combat avec gob
        // 27 - 4 * 3.90 = 11.4
        expect(Comparator.considerHPLeft(cc2.melee, cc1.melee)).toBeCloseTo(11.4, 2)
        const cx = Comparator.consider(c1, c2)
        expect(cx.you.melee.hp.after).toBeCloseTo(-12.95, 2)
        expect(cx.you.melee.turns).toBe(7)

        expect(cx.adv.melee.hp.after).toBeCloseTo(11.4, 2)
        expect(cx.adv.melee.turns).toBe(4)

        expect(cx.you.ranged.hasWeapon).toBeTrue()
        expect(cx.you.ranged.hp.after).toBeCloseTo(14, 2)
        expect(cx.you.ranged.turns).toBe(7)

        expect(cx.adv.ranged.hasWeapon).toBeFalse()
        expect(cx.adv.ranged.hp.after).toBe(-Infinity)
        expect(cx.adv.ranged.turns).toBe(Infinity)
    })
})