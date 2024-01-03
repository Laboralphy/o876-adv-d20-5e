const { clone } = require('../../../libs/array-mutations')
/**
 *
 * @param state
 * @returns {{id: number, specie: (string|*), counters: (*|{}), classes: ([]|*), equipment: ([{damage: string, itemType: string, entityType: string, weaponType: string, attributes: [], damageType: string, properties: [{amp: number, property: string},{amp: string, property: string, type: string}]},{itemType: string, material: string, entityType: string, armorType: string, properties: [{property: string, type: string},{property: string, type: string},{property: string, type: string},{condition: string, property: string},{amp: number, skill: string, property: string}]}]|*), gauges: ({damage: number}|*), feats: ([]|*), speed: *, encumbrance: (number|*), abilities, skills: ([]|*), effects: (number|[]|*), size, proficiencies: ([]|*), offensiveSlot: *, recentDamageTypes: *, alignment: ({entropy: number, morality: number}|*)}, data: any}
 */
module.exports = state => {
    return {
        id: state.id,
        abilities: state.abilities,
        alignment: state.alignment,
        specie: state.specie,
        size: state.size,
        offensiveSlot: state.offensiveSlot,
        proficiencies: clone(state.proficiencies),
        speed: state.speed,
        effects: clone(state.effects),
        classes: clone(state.classes),
        gauges: state.gauges,
        recentDamageTypes: state.recentDamageTypes,
        feats: clone(state.feats),
        equipment: state.equipment,
        counters: state.counters,
        encumbrance: state.encumbrance,
        data: state.data
    }
}