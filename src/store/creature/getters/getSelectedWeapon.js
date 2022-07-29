module.exports = state => {
    const oWeapon = state.equipment[state.offensiveSlot]
    if (!oWeapon) {
        throw new Error('Offensive slot not selected')
    }
    return oWeapon
}
