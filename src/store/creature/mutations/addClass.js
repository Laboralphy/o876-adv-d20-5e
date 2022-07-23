module.exports = ({ state }, { name }) => {
    const oClass = state.classes.find(c => c.name === name)
    if (oClass) {
        ++oClass.levels
    } else {
        state.classes.push({
            name,
            levels: 1
        })
    }
}
