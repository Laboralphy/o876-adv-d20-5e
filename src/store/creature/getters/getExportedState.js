/**
 * @param item {D20Item}
 * @returns {*|(object&{id})|null}
 */
function exportItem (item) {
    if (!item) {
        return null
    } else if (('id' in item) && !!item.id) {
        return item.id
    } else {
        return item
    }
}

/**
 * @param state
 * @returns {{specie: (string|*), classes: ([]|*), equipment: (*|(Object&{id})|null)[], gauges: ({damage: number}|*), feats: ([]|*), speed: *, abilities: *, skills: ([]|*), effects: (number|[]|*), size, proficiencies: ([]|*), offensiveSlot: (*|string), recentDamageTypes: (*|{}), alignment: ({entropy: number, morality: number}|*)}}
 */
module.exports = state => {
    return {
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
        equipment: state.equipment
    }
}