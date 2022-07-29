module.exports = function ({ ability, value }) {
    return {
        property: 'ability-bonus',
        amp: value,
        ability
    }
}