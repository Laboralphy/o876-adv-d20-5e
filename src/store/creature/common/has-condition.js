const CONSTS = require('../../../consts')
module.exports = (state, sCondition) => state.effects.some(eff => eff.tag === CONSTS.EFFECT_CONDITION && eff.data.condition === sCondition)
