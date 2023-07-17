module.exports = ({ state }, { creature }) => {
    const idSource = creature.id
    state.effects.forEach(eff => {
        if (eff.source === idSource) {
            eff.duration = 0
        }
    })
}
