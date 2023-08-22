class Comparator {
    static computeHitProbability (nAtkBonus, nAdvAC) {
        const nAtkDelta = nAdvAC - nAtkBonus
        let nProbToHit = 0
        if (nAtkDelta >= 20) {
            nProbToHit = 5
        } else if (nAtkDelta <= 1) {
            nProbToHit = 95
        } else {
            // entre 2 et 19
            nProbToHit = (20 - nAtkDelta) * 5
        }
        return nProbToHit / 100
    }

    /**
     *
     * @param oDamageBonus {Object<string, number>}
     * @param oDamageMitigation {Object<string, D20OneDamageMitigation>}
     * @returns {number}
     */
    static computeMitigatedDamage (oDamageBonus, oDamageMitigation) {
        // pour chaque damage bonus, voir s'il existe une mitigation
        let nTotalDamage = 0
        for (const [sDamType, nDamage] of Object.entries(oDamageBonus)) {
            const { factor = 1, reduction = 0 } = sDamType in oDamageMitigation
                ? oDamageMitigation[sDamType]
                : { factor: 1, reduction: 0 }
            nTotalDamage += Math.max(0, factor * nDamage - reduction)
        }
        return nTotalDamage
    }

    static computeDamagePerTurn(nChanceToHit, nAverageDamage, nAttackCount) {
        return nChanceToHit * nAverageDamage * nAttackCount
    }

    /**
     * @typedef ComparatorTTKAdversary {object}
     * @property hp {number}
     * @property ac {number}
     * @property damageMitigation {Object<string, D20OneDamageMitigation>}
     *
     * @typedef ComparatorTTKYou {object}
     * @property atk {number}
     * @property atkCount {number}
     * @property damages {Object<string, number>}
     *
     * @param adv {ComparatorTTKAdversary}
     * @param you {ComparatorTTKYou}
     * @return {number}
     */
    static computeTurnsToKill({ adv, you }) {
        const nHitProb = Comparator.computeHitProbability(you.atk, adv.ac)
        const nDamPerAttack = Comparator.computeMitigatedDamage(you.damages, adv.damageMitigation)
        const nDPT = Comparator.computeDamagePerTurn(nHitProb, nDamPerAttack, you.atkCount)
        return {
            tohit: nHitProb,
            dpa: nDamPerAttack,
            dpt: nDPT,
            turns: Math.ceil(adv.hp / nDPT)
        }
    }


}

module.exports = Comparator