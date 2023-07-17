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
        skills,
        equipment
    } = importState
    state.abilities = abilities
    state.alignment = alignment
    state.specie = specie
    state.size = size
    state.offensiveSlot = offensiveSlot
    state.proficiencies = proficiencies
    state.speed = speed
    state.effects = effects
    state.classes = classes
    state.gauges = gauges
    state.recentDamageTypes = recentDamageTypes
    state.feats = feats
    state.skills = skills
    state.equipment = equipment
}