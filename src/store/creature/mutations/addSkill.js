module.exports = ({ state, externals }, { skill }) => {
    if (!(skill in externals.data)) {
        throw new Error('ERR_UNKNOWN_SKILL: ' + skill)
    }
    if (!state.skills.includes(skill)) {
        state.skills.push(skill)
    }
}