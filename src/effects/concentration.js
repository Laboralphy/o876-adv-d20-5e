const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Groups several effects into a concentration effect
 * @param effects {D20Effect[]}
 * @returns {D20Effect}
 */
function create (effects) {
    // La concentration peut affecter des effets placer sur d'autres créatures
    effects.forEach(eff => {
        eff.exportable = false
    })
    const eConcentration = createEffect(CONSTS.EFFECT_CONCENTRATION, 0, { effects })
    eConcentration.exportable = false // Contient des références
    return eConcentration
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
    effect.data.effects.forEach(eff => {
        eff.duration = 0
    })
}

module.exports = {
    create,
    dispose,
    attacked
}