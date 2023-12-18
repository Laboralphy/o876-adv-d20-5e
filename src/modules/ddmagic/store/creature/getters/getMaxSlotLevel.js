module.exports = (state, getters) => {
    const ss = getters.getSpellSlotStatus
    let nMaxSlotLevel = 0
    for (let i = 1; i <= 9; ++i) {
        if (ss[i - 1].count > 0) {
            nMaxSlotLevel = i
        } else {
            break
        }
    }
    return nMaxSlotLevel
}