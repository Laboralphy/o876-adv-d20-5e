module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    return oWeapon ? oWeapon.properties : []
}
