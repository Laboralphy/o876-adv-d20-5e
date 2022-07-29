module.exports = (state, getters) => {
    let nSpeed = state.speed
    const nExhaustionLevel = getters.getExhaustionLevel
    const nSpeedFactor = nExhaustionLevel >= 5
        ? 0
        : nExhaustionLevel >= 2
            ? 0.5
            : 1
    return Math.floor(nSpeed * nSpeedFactor)
}
