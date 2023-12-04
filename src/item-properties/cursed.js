/**
 * Un objet maudit équipé ne peut plus être enlevé
 */
const CONSTS = require("../consts");
module.exports = function () {
    return {
        property: CONSTS.ITEM_PROPERTY_CURSED,
        amp: 0,
        data: {}
    }
}
