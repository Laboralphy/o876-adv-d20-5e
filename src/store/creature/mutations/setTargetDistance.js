module.exports = ({ state, externals: { data } }, { value }) => {
    const WEAPON_RANGES = data['weapon-ranges']
    state.target.distance = Math.max(WEAPON_RANGES.WEAPON_RANGE_MELEE, value)
}