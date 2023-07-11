const CONSTS = require('../../../consts')

/**
 * Si la cible est a portée : morsure de gnoll
 * @param caster {Creature}
 */
module.exports = function (caster) {
    const sCurrentSlot = caster.store.getters.getOffensiveSlot
    caster.store.mutations.setSelectedWeapon({ slot: CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON })
    caster.attack()
    caster.store.mutations.setSelectedWeapon({ slot: sCurrentSlot })
}