const CONSTS = require('../consts')
module.exports = {
  [CONSTS.ITEM_PROPERTY_ABILITY_BONUS]: require('./ability-bonus'),
  [CONSTS.ITEM_PROPERTY_AC_BONUS]: require('./ac-bonus'),
  [CONSTS.ITEM_PROPERTY_ATTACK_BONUS]: require('./attack-bonus'),
  [CONSTS.ITEM_PROPERTY_DAMAGE_BONUS]: require('./damage-bonus'),
  [CONSTS.ITEM_PROPERTY_ENHANCEMENT]: require('./enhancement')
}

