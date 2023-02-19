module.exports = ({ state }, { flags }) => {
    const saf = state.areaFlags
    saf.splice(0, saf.length, ...flags)
}
