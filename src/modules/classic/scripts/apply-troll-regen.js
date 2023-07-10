const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 * Lorsqu'un troll est blessé par acide ou feu, il ne peut pas se soigner lors du prochain tour
 *
 * @param target {Creature}
 * @param source {Creature}
 * @param dc {number}
 */
module.exports = function ({ target, source, damage, property }) {
    const sDamageType = damage.data.type
    const amp = damage.amp
    if (amp > 0 && (sDamageType === CONSTS.DAMAGE_TYPE_ACID) || (sDamageType === CONSTS.DAMAGE_TYPE_FIRE)) {
        const oNoHeal = EffectProcessor.createEffect(CONSTS.EFFECT_MUMMY_ROT)
        target.applyEffect(oNoHeal, 2, source)
    }
}