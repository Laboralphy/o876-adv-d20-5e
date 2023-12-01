/**
 * script spell-mending
 *
 * Le sort permet d'identifier les objets non identifiés.
 *
 * Les objets ayant des propriétés cachées sont dits : non identifiés.
 * Ce sort permet de remplacer les ITEM_PROPERTY_UNIDENTIFIED par l'item property cachée.
 */

const CONSTS = require('../../../consts')
const itemProperties = require('../../../item-properties')

module.exports = (oSpellCast, { item }) => {
    let i
    do {
        i = item.properties.findIndex(ip => ip.property === CONSTS.ITEM_PROPERTY_UNIDENTIFIED)
        const u = item.properties[i]
        if (u) {
            u.data.hiddenProperties.forEach(hp => {
                item.properties.push(itemProperties[hp.property](hp))
            })
            item.properties.splice(i, 1)
        }
    } while (i >= 0)
}