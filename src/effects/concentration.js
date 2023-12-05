const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Groups several effects into a concentration effect
 * @param effects {D20Effect[]}
 * @returns {D20Effect}
 */
function create (effects) {
    return createEffect(CONSTS.EFFECT_CONCENTRATION)
}

function attacked ({
    effect, target, outcome
}) {
    if (outcome.damages.amount > 0) {
        const dc = Math.max(10, outcome.damages.amount >> 1)
        const oCreature = target
        const st = oCreature.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [], dc, oCreature)
        if (!st.success) {
            effect.duration = 0
        }
    }
}

function dispose ({ effect, target: oCreature }) {
    oCreature.store.getters.getEffects.forEach(eff => {
        if (eff.data.spellmark.id === effect.data.spellmark.id) {
            eff.duration = 0
        }
    })
}

module.exports = {
    create,
    dispose,
    attacked
}