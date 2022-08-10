module.exports = (state, getters) => {
    const oWeapon = getters.getSelectedWeapon
    return oWeapon
        ? state.proficiencies.includes(oWeapon.proficiency)
        : true
}
