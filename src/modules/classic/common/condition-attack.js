const CONSTS = require('../../../consts')
const EffectProcessor = require('../../../EffectProcessor')


/**
 * Pattern de sortilège.
 * Applique une condition à la cible si celle-ci rate son jet de sauvegarde
 * @param caster
 * @param target
 * @param condition {string}
 * @param duration {string}
 * @param savingAbility {string}
 * @param [threats] {string[]}
 * @param dc
 */
function conditionAttack ({
    caster,
    target,
    condition,
    duration,
    savingAbility,
    threats = [],
    dc
}) {
    const { success } = target.rollSavingThrow(savingAbility, [CONSTS.THREAT_TYPE_SPELL, ...threats], dc)
    if (success) {
        const eCond = EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, 0, condition)
        target.applyEffect(eCond, duration, caster)
    }
}

module.exports = {
    conditionAttack
}