module.exports = ({ state }, { ref, levels = 1 }) => {
    const oClass = state.classes.find(c => c.ref === ref)
    if (oClass) {
        oClass.levels += levels
    } else {
        state.classes.push({
            ref,
            levels
        })
    }
}
