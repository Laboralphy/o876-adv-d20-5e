/**
 * script spell-chill-touch
 *
 * A skeletal hand is thrown at target and deals 1d8 necrotic damage
 */

const DDMagicSpellHelper = require('../common/ddmagic-specific-spell-helper')
const CONSTS = require('../../../consts')
const EffectProcessor = require("../../../EffectProcessor");

module.exports = ({ caster }) => {
    const target = caster.getTarget()
    const { hit } = DDMagicSpellHelper.rangedAttack(caster)
    if (hit) {
        const eDam = EffectProcessor.createEffect(
            CONSTS.EFFECT_DAMAGE,
            caster.roll(DDMagicSpellHelper.getCantripDamageDice(caster, 8)),
            CONSTS.DAMAGE_TYPE_NECROTIC
        )
        DDMagicSpellHelper.declareSpellEffects({
            spell: 'chill-touch',
            effects: [eDam],
            caster,
            target
        })
    }
}
