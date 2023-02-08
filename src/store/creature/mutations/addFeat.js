module.exports = ({ state, externals }, { feat }) => {
    if ((feat in externals.data) && !state.feats.includes(feat)) {
        state.feats.push(feat)
    }
}