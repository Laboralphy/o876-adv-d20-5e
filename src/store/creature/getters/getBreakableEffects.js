const CONSTS = require('../../../consts')

module.exports = (state, getters) => getters.getEffects.filter(eff => eff.subtype === CONSTS.EFFECT_SUBTYPE_BREAKABLE)
