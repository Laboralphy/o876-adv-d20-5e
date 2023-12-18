const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

module.exports = function (caster) {
    const nLevel = caster.store.getters.getLevelByClass['wizard']
    const nHalfLevelRoundedUp = Math.ceil(nLevel / 2)

}
