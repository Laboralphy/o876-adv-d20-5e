module.exports = ({ state }, { tag }) => {
    const sp = state.properties
    for (let i = sp.length - 1; i >= 0; --i) {
        if (sp[i].tag === tag) {
            sp.splice(i, 1)
        }
    }
}
