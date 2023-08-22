const Comparator = require('../src/Comparator')
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
                atk: 5,
                atkCount: 1,
                damages: {
                    slashing: 4
                }
            }
        })).toEqual({
            tohit: 0.55,
            dpa: 4,
            dpt: 2.2,
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
                atk: 5,
                atkCount: 1,
                damages: {
                    slashing: 4
                }
            }
        })).toEqual({
            tohit: 0.55,
            dpa: 2,
            dpt: 1.1,
            turns: 28
        })
    })
})