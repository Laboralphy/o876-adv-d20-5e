/**
 * script spell-mending
 *
 * Niveau 1 divination
 * Le sort permet d'identifier les objets non identifiés.
 *
 * Les objets ayant des propriétés cachées sont dits : non identifiés.
 * Ce sort permet de remplacer les ITEM_PROPERTY_UNIDENTIFIED par l'item property cachée.
 */

const CONSTS = require('../../../consts')

module.exports = (oSpellCast, { item }) => {
    let i, bFound
    do {
        i = item.properties.findIndex(ip => ip.property === CONSTS.ITEM_PROPERTY_UNIDENTIFIED)
        bFound = i >= 0
        if (bFound) {
            item.properties.splice(i, 1)
        }
    } while (bFound)
}
