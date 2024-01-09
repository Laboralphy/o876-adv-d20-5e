const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Harvest life energy from slain creatures
 * Cet effet est dédié à la classe de nécromancien et devrait être supprimer si
 * on utilise pas ddmagic.
 *
 * @returns {D20Effect}
 */
function create () {
    const oEffect = createEffect(CONSTS.EFFECT_GRIM_REAPER, 1)
    oEffect.unicity = CONSTS.EFFECT_UNICITY_NO_REPLACE
    return oEffect
}

function mutate ({ effect }) {
    if (effect.amp === 0) {
        effect.amp = 1
    }
}

function kill ({ effect, data: { effect: killingEffect } }) {
    // déterminer si la créature a été butée par un sort
    const { spellmark = null } = killingEffect.data.spellmark
    const sRace = effect.target.store.getters.getSpecie
    const bHarvestable = sRace !== CONSTS.SPECIE_UNDEAD && sRace !== CONSTS.SPECIE_CONSTRUCT
    if (bHarvestable && spellmark) {
        const bNecromancy = spellmark.spellSchool === 'SPELL_SCHOOL_NECROMANCY'
        const nLevel = spellmark.spellCastLevel
        const oNecromancer = effect.source
        const nHeal = bNecromancy ? 3 * nLevel : 2 * nLevel
        const eHeal = oNecromancer.EffectProcessor.createEffect(CONSTS.EFFECT_HEAL, nHeal)
        oNecromancer.applyEffect(eHeal, oNecromancer)
    }
}

module.exports = {
    create,
    mutate,
    kill
}
