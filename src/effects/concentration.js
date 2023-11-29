const createEffect = require('./abstract')
const CONSTS = require('../consts')
const GroupEffect = require('./group')

/**
 * Groups several effects into a concentration effect
 * @param effects {D20Effect[]}
 * @returns {D20Effect}
 */
function create (effects) {
    return createEffect(
        CONSTS.EFFECT_CONCENTRATION,
        0,
        {
            effects,
            applied: false,
            appliedEffects: []
        },
        'CONCENTRATION'
    )
}

function attacked ({
    effect, outcome
}) {
    if (outcome.damages.amount > 0) {
        const dc = Math.max(10, outcome.damages.amount >> 1)
        const oCreature = effect.target
        const st = oCreature.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [], dc, oCreature)
        if (!st.success) {
            effect.duration = 0
        }
    }
}

module.exports = {
    mutate: GroupEffect.mutate,
    dispose: GroupEffect.dispose,
    create,
    attacked
}