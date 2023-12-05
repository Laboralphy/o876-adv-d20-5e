/**
 * script spell-remove-curse
 *
 * Retire la property ITEM_PROPERTY_CURSED
 */

const CONSTS = require('../../../consts')

function isItemCursed (oItem) {
    return !!oItem.properties.find(ip => ip.property === CONSTS.ITEM_PROPERTY_CURSED)
}


module.exports = oSpellCast => {
    // retirer les objets equipés maudits
    const target = oSpellCast.target
    for (const [slot, item] of Object.entries(target.store.getters.getEquippedItems)) {
        if (!!item && isItemCursed(item)) {
            target.unequipItem(slot, true)
        }
    }
}