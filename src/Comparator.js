const CONSTS = require('./consts')

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
     * @typedef ComparatorTTK {object}
     * @property hp {number}
     * @property ac {number}
     * @property damageMitigation {Object<string, D20OneDamageMitigation>}
     * @property atk {number}
     * @property atkCount {number}
     * @property damages {Object<string, number>}
     *
     *
     *
     * @param adv {ComparatorTTK}
     * @param you {ComparatorTTK}
     * @return {*}
     */
    static computeTurnsToKill({ adv, you }) {
        const hp = adv.hp
        const tohit = Comparator.computeHitProbability(you.atk, adv.ac)
        const dpa = Comparator.computeMitigatedDamage(you.damages, adv.damageMitigation)
        const apt = you.atkCount
        const dpt = Comparator.computeDamagePerTurn(tohit, dpa, apt)
        const attacks = Math.ceil(hp / (tohit * dpa))
        const turns = Math.ceil(hp / dpt)
        return {
            hasWeapon: !!you.weapon,
            tohit,
            dpa,
            dpt,
            hp,
            apt,
            turns,
            attacks
        }
    }

    static getSlotStats (c, slot) {
        const g = c.store.getters
        const m = c.store.mutations
        const weapon = g.getEquippedItems[slot] ? g.getEquippedItems[slot].ref : ''
        if (weapon) {
            c.dice.cheat(0.5)
            const slotBak = g.getOffensiveSlot
            if (slot !== slotBak) {
                m.setSelectedWeapon({slot})
            }
            const atk = g.getAttackBonus
            const atkCount = g.getAttackCount
            const damages = c.rollWeaponDamage()
            const hp = g.getHitPoints
            const ac = g.getArmorClass
            const damageMitigation = g.getDamageMitigation
            if (slot !== slotBak) {
                m.setSelectedWeapon({slot: slotBak})
            }
            c.dice.cheat(false)
            return {
                weapon,
                atk,
                atkCount,
                damages,
                hp,
                ac,
                damageMitigation
            }
        } else {
            return {
                weapon: '',
                atk: 0,
                atkCount: g.getAttackCount,
                damages: {},
                hp: g.getHitPoints,
                ac: g.getArmorClass,
                damageMitigation: g.getDamageMitigation
            }
        }
    }

    static getMeleeSlot (c) {
        const g = c.store.getters
        return !!g.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
            ? CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
            : CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON
    }

    static getMeleeWeaponStats (c) {
        const s = Comparator.getMeleeSlot(c)
        return Comparator.getSlotStats(c, s)
    }

    static getRangedWeaponStats (c) {
        const s = CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        return Comparator.getSlotStats(c, s)
    }

    static ggg (you, adv) {
        // calculer combien de hp il reste après l'attaque de l'autre
    }

    static considerP1 (you, adv) {
        const ryou = Comparator.getRangedWeaponStats(you)
        const radv = Comparator.getRangedWeaponStats(adv)
        const ranged = ryou
            ? Comparator.computeTurnsToKill({
                you: ryou,
                adv: radv
            })
            : null
        const melee = Comparator.computeTurnsToKill({
            you: Comparator.getMeleeWeaponStats(you),
            adv: Comparator.getMeleeWeaponStats(adv)
        })
        return {
            melee,
            ranged
        }
    }

    static considerHPLeft (you, adv) {
        const youHP = adv.hp
        const advHP = you.hp
        // Combien de HP vont être emportés le temps que vous mettez à terminer votre adversaire
        const nTurns = you.turns
        const nAdvDamages = nTurns * adv.dpt
        return youHP - nAdvDamages
    }

    /**
     * @typedef ComparatorConsiderHP {object}
     * @property before {number} nombre de hp avant combat
     * @property after {number} nombre de hp après combat
     * @property lost {number} nombre de hp perdus
     * @property lost100 {number} ratio de hp perdu /hp max
     *
     * @typedef ComparatorConsiderAttackType {object}
     * @property toHit {number} probabilité de toucher
     * @property advDamage {number} dégâts moyen par tour
     * @property turns {number} nombre de tours nécessaires pour tuer l'adversaire
     * @property hp {ComparatorConsiderHP}
     * @property hasWeapon {boolean} true si une arme est utilisée pour ce type d'attaque
     *
     * @typedef ComparatorConsiderCombatType {{you : ComparatorConsiderAttackType, adv : ComparatorConsiderAttackType}}
     *
     * @typedef ComparatorConsiderResult {{ranged: ComparatorConsiderCombatType, melee: ComparatorConsiderCombatType}}
     *
     * @param c1 {Creature}
     * @param c2 {Creature}
     * @returns {ComparatorConsiderResult}
     */
    static consider (c1, c2) {
        const cc1 = Comparator.considerP1(c1, c2)
        const cc2 = Comparator.considerP1(c2, c1)
        const c1MeleeHPLeft = Comparator.considerHPLeft(cc1.melee, cc2.melee)
        const c2MeleeHPLeft = Comparator.considerHPLeft(cc2.melee, cc1.melee)
        const c1RangedHPLeft = Comparator.considerHPLeft(cc1.ranged, cc2.ranged)
        const c2RangedHPLeft = Comparator.considerHPLeft(cc2.ranged, cc1.ranged)
        /*
            tohit,
            dpa,
            dpt,
            hp,
            apt,
            turns,
            attacks
         */
        const c1hpmax = c1.store.getters.getMaxHitPoints
        const c1hp = c1.store.getters.getHitPoints
        const c2hpmax = c2.store.getters.getMaxHitPoints
        const c2hp = c2.store.getters.getHitPoints
        return {
            melee: {
                you: {
                    toHit: cc1.melee.tohit,
                    turns: cc1.melee.turns,
                    dpt: cc1.melee.dpt,
                    hp: {
                        before: c1hp,
                        after: c1MeleeHPLeft,
                        lost: c1hp - c1MeleeHPLeft,
                        lost100: (c1hp - c1MeleeHPLeft) / c1hpmax
                    },
                    hasWeapon: cc1.melee.hasWeapon
                },
                adv: {
                    toHit: cc2.melee.tohit,
                    turns: cc2.melee.turns,
                    dpt: cc2.melee.dpt,
                    hp: {
                        before: c2hp,
                        after: c2MeleeHPLeft,
                        lost: c2hp - c2MeleeHPLeft,
                        lost100: (c2hp - c2MeleeHPLeft) / c2hpmax,
                    },
                    hasWeapon: cc2.melee.hasWeapon
                }
            },
            ranged: {
                you: {
                    toHit: cc1.ranged.tohit,
                    turns: cc1.ranged.turns,
                    dpt: cc1.ranged.dpt,
                    hp: {
                        before: c1hp,
                        after: c1RangedHPLeft,
                        lost: c1hp - c1RangedHPLeft,
                        lost100: (c1hp - c1RangedHPLeft) / c1hpmax
                    },
                    hasWeapon: cc1.ranged.hasWeapon
                },
                adv: {
                    toHit: cc2.ranged.tohit,
                    turns: cc2.ranged.turns,
                    dpt: cc2.ranged.dpt,
                    hp: {
                        before: c2hp,
                        after: c2RangedHPLeft,
                        lost: c2hp - c2RangedHPLeft,
                        lost100: (c2hp - c2RangedHPLeft) / c2hpmax
                    },
                    hasWeapon: cc2.ranged.hasWeapon
                }
            }
        }
    }
}

module.exports = Comparator