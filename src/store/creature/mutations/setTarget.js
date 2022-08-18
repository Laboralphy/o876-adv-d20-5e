const CONSTS = require('../../../consts')

module.exports = ({ state }, { target }) => {
    if (target) {
        const oConditions = target.store.getters.getConditions
        state.target.active = true
        state.target.conditions[CONSTS.CONDITION_INVISIBLE] = oConditions[CONSTS.CONDITION_INVISIBLE]
    } else {
        state.target.active = false
    }
}