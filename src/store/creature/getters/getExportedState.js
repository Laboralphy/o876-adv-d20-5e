/**
 *
 * @param state
 * @returns {{id: number, specie: (string|*), counters: (*|{}), classes: ([]|*), equipment: ([{damage: string, itemType: string, entityType: string, weaponType: string, attributes: [], damageType: string, properties: [{amp: number, property: string},{amp: string, property: string, type: string}]},{itemType: string, material: string, entityType: string, armorType: string, properties: [{property: string, type: string},{property: string, type: string},{property: string, type: string},{condition: string, property: string},{amp: number, skill: string, property: string}]}]|*), gauges: ({damage: number}|*), feats: ([]|*), speed: *, encumbrance: (number|*), abilities, skills: ([]|*), effects: (number|[]|*), size, proficiencies: ([]|*), offensiveSlot: *, recentDamageTypes: *, alignment: ({entropy: number, morality: number}|*)}}
 */
module.exports = state => {
    return {
        id: state.id,
        abilities: state.abilities,
        alignment: state.alignment,
        specie: state.specie,
        size: state.size,
        offensiveSlot: state.offensiveSlot,
        proficiencies: state.proficiencies,
        speed: state.speed,
        effects: state.effects,
        classes: state.classes,
        gauges: state.gauges,
        recentDamageTypes: state.recentDamageTypes,
        feats: state.feats,
        skills: state.skills,
        equipment: state.equipment,
        counters: state.counters,
        encumbrance: state.encumbrance
    }
}