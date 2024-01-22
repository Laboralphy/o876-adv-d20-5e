const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Cet effet sert à casser la concentration lorsqu'on est attaqué
 * @returns {D20Effect}
 */
function create () {
    const eConcentration = createEffect(CONSTS.EFFECT_CONCENTRATION)
    eConcentration.exportable = false
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
            oCreature.store.mutations.dispelEffect({ effect })
            oCreature.effectProcessor.breakConcentration()
            target.events.emit('spellcast-concentration-end', {
                caster: target,
                spell: target.effectProcessor.concentration.data.spell,
                reason: 'CONCENTRATION_BROKEN'
            })
        }
    }
}

module.exports = {
    create,
    attacked
}