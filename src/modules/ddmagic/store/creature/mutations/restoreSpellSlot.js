const { mutateItem } = require('../../../../../libs/array-mutations')
module.exports = ({ state }, { level, count }) => {
    if (level >= 1 && level <= 9) {
        mutateItem(state.data.spellbook.slots, level - 1, n => Math.max(0, n - count))
    } else {
        throw new Error('slot level is invalid, should be 1..9 (' + level + ' given)')
    }
}