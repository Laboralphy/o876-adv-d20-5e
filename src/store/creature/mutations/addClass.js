module.exports = ({ state, getters }, { ref, levels = 1 }) => {
    if (ref === undefined) {
        throw new Error('The "addClass" mutation requires a { ref } property in the payload')
    }
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
