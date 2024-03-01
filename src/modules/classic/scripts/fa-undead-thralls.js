const CONSTS = require('../../../consts')
const { chooseRandomItems } = require('../common/spell-helper')
const ITEM_PROPERTIES = require('../../../item-properties')

const SUMMON_TABLE = [
    {
        levels: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
        refs: ['c-skeleton']
    }
]

function getRef (nLevel) {
    const st = SUMMON_TABLE
        .find(sti => sti.levels.has(nLevel))
    if (st) {
        return chooseRandomItems(st.refs, 1).shift()
    } else {
        throw new Error('Error in summon table : level value not found: ' + nLevel)
    }
}

/**
 * Récupération de (1d10 + level) point de vie
 * @param caster
 */
module.exports = function (caster) {
    const csg = caster.store.getters
    const nCasterLevel = csg.getLevelByClass['wizard']
    const nHPBonus = nCasterLevel * 2
    // prof bonus doit augmenter les damages rolls de l'arme du thrall
    const nProficiencyBonus = csg.getProficiencyBonus
    const oPayload = {
        ref: getRef(nCasterLevel),
        level: nCasterLevel,
        creature: null,
    }
    caster.events.emit('summon-creature', oPayload)
    const creature = oPayload.creature
    if (creature) {
        // Augmenter le niveau
        const nDiffLevel = nCasterLevel - creature.store.getters.getLevel
        if (nDiffLevel > 0) {
            creature.store.mutations.addClass({
                ref: 'monster',
                levels: nDiffLevel
            })
        }
        const nGrade = Math.floor(nCasterLevel / 4)
        const oWeapons = creature.store.getters.getEquippedWeapons
        const oRanged = oWeapons.ranged
        const oMelee = oWeapons?.melee || oWeapons.natural
        if (oMelee) {
            oMelee.itemProperties.push(ITEM_PROPERTIES[CONSTS.ITEM_PROPERTY_DAMAGE_BONUS]({ amp: nProficiencyBonus, type: oMelee.damage.type }))
        }
        if (oRanged) {
            oRanged.itemProperties.push(ITEM_PROPERTIES[CONSTS.ITEM_PROPERTY_ATTACK_BONUS]({ amp: nGrade }))
        }
        const oArmor = creature.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST] ||
            creature.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR]
        if (oArmor) {
            oArmor.itemProperties.push(ITEM_PROPERTIES[CONSTS.ITEM_PROPERTY_AC_BONUS]({ amp: nGrade }))
        }
    }
}
