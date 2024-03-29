const { update: updateArray } = require('../../../libs/array-mutations')

module.exports = ({ state }, { state: importState }) => {
    const {
        abilities,
        alignment,
        specie,
        size,
        offensiveSlot,
        proficiencies,
        speed,
        effects,
        classes,
        gauges,
        recentDamageTypes,
        feats,
        equipment,
        counters,
        encumbrance,
        data
    } = importState
    state.abilities = abilities
    state.alignment = alignment
    state.specie = specie
    state.size = size
    state.offensiveSlot = offensiveSlot
    updateArray(state.proficiencies, proficiencies)
    state.speed = speed
    updateArray(state.effects, effects)
    updateArray(state.classes, classes)
    state.gauges = gauges
    state.recentDamageTypes = recentDamageTypes
    updateArray(state.feats, feats)
    state.equipment = equipment
    state.counters = counters
    state.encumbrance = encumbrance
    state.data = data
}