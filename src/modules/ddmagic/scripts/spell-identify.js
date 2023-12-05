/**
 * script spell-mending
 *
 * Le sort permet d'identifier les objets non identifiés.
 *
 * Les objets ayant des propriétés cachées sont dits : non identifiés.
 * Ce sort permet de remplacer les ITEM_PROPERTY_UNIDENTIFIED par l'item property cachée.
 */

const CONSTS = require('../../../consts')

module.exports = (oSpellCast, { item }) => {
    let i
    do {
        i = item.properties.findIndex(ip => ip.property === CONSTS.ITEM_PROPERTY_UNIDENTIFIED)
        const u = item.properties[i]
        if (u) {
            item.properties.splice(i, 1)
        }
    } while (i >= 0)
}