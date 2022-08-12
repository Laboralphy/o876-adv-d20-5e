module.exports = ({ state }, { proficiency }) => {
    if (!state.proficiencies.includes(proficiency)) {
        state.proficiencies.push(proficiency)
    }
}