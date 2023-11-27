/**
 * script spell-ray-of-frost
 *
 * A bolt of fire
 */

const DDMagicSpellHelper = require('../common/ddmagic-specific-spell-helper')
const CONSTS = require('../../../consts')
const EffectProcessor = require("../../../EffectProcessor");

module.exports = ({ caster }) => {
    const oTarget = caster.getTarget()
    const { hit } = DDMagicSpellHelper.rangedAttack(caster)
    if (hit) {
        const eDam = EffectProcessor.createEffect(
            CONSTS.EFFECT_DAMAGE,
            caster.roll(DDMagicSpellHelper.getCantripDamageDice(caster, 10)),
            CONSTS.DAMAGE_TYPE_COLD
        )
        oTarget.applyEffect(eDam, 0, caster)
    }
}
