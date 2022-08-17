const CONSTS = require('../../../consts')

/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oConditions = getters.getConditions
    if (oConditions[CONSTS.CONDITION_BLINDED]) {
        console.log('blinded')
        return false
    }
    const target = state.target
    if (target) {
        const haveTrueSight = oConditions[CONSTS.CONDITION_TRUE_SIGHT]
        const targetIsVisible = !oConditions[CONSTS.CONDITION_INVISIBLE]
        console.log('true sight', haveTrueSight, 'visible', targetIsVisible)
        return haveTrueSight || targetIsVisible
    } else {
        console.log('no target')
        return true
    }
}
