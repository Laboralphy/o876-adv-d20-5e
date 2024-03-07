const CONSTS = require('../../../consts')
const { chooseRandomItems } = require('../../classic/common/spell-helper')
const ITEM_PROPERTIES = require('../../../item-properties')

/**
 * 0: 5, 6
 * 1: 7, 8
 * 2: 9, 10
 * 3: 11, 12
 * 4: 13, 14
 * 5: 15, 16
 * 6: 17, 18, 19, 20
 */
const SUMMON_TABLE = [
    {
        levels: new Set([0, 1, 2, 3, 4, 5, 6]),
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
 * @param oSpellCast
 */
module.exports = function (oSpellCast) {
    const caster = oSpellCast.caster
    const nSpellPower = oSpellCast.power
    const csg = caster.store.getters
    const nCasterLevel = csg.getLevelByClass['wizard']
    const nHPBonus = nCasterLevel * 2
    // prof bonus doit augmenter les damages rolls de l'arme du thrall
    const nProficiencyBonus = csg.getProficiencyBonus
    const oPayload = {
        ref: getRef(nSpellPower),
        level: nCasterLevel,
        creature: null,
    }
    caster.events.emit('summon-creature', oPayload)
    const creature = oPayload.creature
    if (creature) {
        const nGrade = Math.floor(nCasterLevel / 4)
        const oWeapons = creature.store.getters.getEquippedWeapons
        const oRanged = oWeapons.ranged
        const oMelee = oWeapons?.melee || oWeapons.natural
        if (oMelee) {
            // Augmentation des dégâts de mélée
            oMelee.itemProperties.push(ITEM_PROPERTIES[CONSTS.ITEM_PROPERTY_DAMAGE_BONUS]({ amp: nProficiencyBonus, type: oMelee.damage.type }))
        }
        if (oRanged) {
            // Augmentation de l'adresse des tirs à distance
            oRanged.itemProperties.push(ITEM_PROPERTIES[CONSTS.ITEM_PROPERTY_ATTACK_BONUS]({ amp: nGrade }))
        }
        const oArmor = creature.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST] ||
            creature.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR]
        if (oArmor) {
            // Augmentation de la classe d'armure
            oArmor.itemProperties.push(ITEM_PROPERTIES[CONSTS.ITEM_PROPERTY_AC_BONUS]({ amp: nGrade }))
        }
        // Appliquer TTL
        const eTTL = creature.effectProcessor.createEffect(CONSTS.EFFECT_TIME_TO_LIVE)
        creature.applyEffect(eTTL, oSpellCast.getDurationHours(24))
    }
}
