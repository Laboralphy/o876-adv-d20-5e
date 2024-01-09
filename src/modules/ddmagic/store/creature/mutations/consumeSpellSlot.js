const { mutateItem } = require('../../../../../libs/array-mutations')
module.exports = ({ state }, { level }) => {
    if (level >= 1 && level <= 9) {
        mutateItem(state.data.spellbook.slots, level - 1, n => n + 1)
    } else {
        throw new Error('slot level is invalid, should be 1..9 (' + level + ' given)')
    }
}