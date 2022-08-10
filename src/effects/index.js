const CONSTS = require('../consts')
module.exports = {
  [CONSTS.EFFECT_ABILITY_BONUS]: require('./ability-bonus'),
  [CONSTS.EFFECT_AC_BONUS]: require('./ac-bonus'),
  [CONSTS.EFFECT_CONDITION]: require('./condition'),
  [CONSTS.EFFECT_DAMAGE_BONUS]: require('./damage-bonus'),
  [CONSTS.EFFECT_DAMAGE]: require('./damage'),
  [CONSTS.EFFECT_HEAL]: require('./heal')
}

