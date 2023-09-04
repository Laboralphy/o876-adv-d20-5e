module.exports = ({ state, externals }, { skill }) => {
    if ((skill in externals.data) && !state.skills.includes(skill)) {
        state.skills.push(skill)
    }
}