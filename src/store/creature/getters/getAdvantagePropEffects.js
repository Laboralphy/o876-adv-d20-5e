const CONSTS = require("../../../consts");
const {getDisAndAdvEffectRegistry} = require("../common/get-disandadv-effect-registry");

/**
 * Renvoie la liste des skill bénéficiant d'avantages de la part des effets et des propriétés d'item
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @returns {Object<string, Object<string, string>>}
 */
module.exports = (state, getters) => {
    const oRelevantEffects = getters
        .getEffects
        .filter(effect => effect.type === CONSTS.EFFECT_ADVANTAGE)
    const oRelevantProperties = getters
        .getEquipmentItemProperties
        .filter(prop => prop.property === CONSTS.ITEM_PROPERTY_ADVANTAGE)
    return getDisAndAdvEffectRegistry(oRelevantEffects, oRelevantProperties)
}