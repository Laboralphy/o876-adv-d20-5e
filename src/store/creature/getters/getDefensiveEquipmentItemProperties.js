module.exports = (state, getters) => getters
    .getDefensiveEquipmentList
    .map(item => item.properties)
    .flat()
