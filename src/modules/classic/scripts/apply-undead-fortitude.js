const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 * Un zombie ne peut pas mourrir même si ses point de vie tombent à zero
 * Le seul moyen de le tuer est d'infliger des dégâts radiants ou des coups critiques
 *
 *
 * @param target {Creature}
 * @param source {Creature}
 * @param dc {number}
 */
module.exports = function ({ target, source, damage, property }) {
    const sDamageType = damage.data.type
    const bCritical = damage.data.critical
    if (sDamageType === CONSTS.DAMAGE_TYPE_RADIANT || bCritical) {
        return
    }
    const amp = damage.amp
    const hp = target.store.getters.getHitPoints
    if (amp >= hp) {
        const st = target.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [], 5 + damage.amp)
        if (st.success) {
            damage.amp = hp - 1
            damage.data.resistedAmount += amp - damage.amp
        }
    }
}