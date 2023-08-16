const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Cet un effet de poison. Il fait des dégâts initiaux qu'il est possible de réduire de moitié par un
 * jet de sauvegarde de constitution. Ensuite le poison agit chaque tour, provoquant des dégâts qui peuvent
 * être annulés par un jet de sauvegarde réussi. Au bout d'un certain nombre de jets de sauvegarde réussi
 * le poison se dissipe.
 * @returns {D20Effect}
 */
function create (damage, dot = "", dc, saveCount = 0) {
    return createEffect(CONSTS.EFFECT_POISON, damage, { dc, dot, saveCount, turns: 0 })
}

function mutate ({ effect, target, source }, oEffectProcessor) {
    // Ne subit pas l'effet de poison si
    if (target.store.getConditionImmunities.has(CONSTS.CONDITION_POISONED)) {
        return
    }
    if (effect.data.turns > 0) {
        if (effect.data.dot) {
            if (target.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [CONSTS.THREAT_TYPE_POISON], effect.data.dc).success, source) {
                --effect.data.saveCount
            } else {
                target.applyEffect(
                    oEffectProcessor.createEffect(
                        CONSTS.EFFECT_DAMAGE,
                        target.roll(effect.data.dot),
                        CONSTS.DAMAGE_TYPE_POISON
                    ),
                    0,
                    source
                )
            }
        }
        if (effect.data.saveCount <= 0) {
            effect.duration = 0
        }
    } else {
        // dégâts initiaux
        if (effect.amp > 0) {
            if (!target.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [CONSTS.THREAT_TYPE_POISON], effect.data.dc).success, source) {
                target.applyEffect(
                    oEffectProcessor.createEffect(
                        CONSTS.EFFECT_DAMAGE,
                        effect.amp,
                        CONSTS.DAMAGE_TYPE_POISON
                    ),
                    0,
                    source
                )
            }
        }
    }
    ++effect.data.turns
}

module.exports = {
    create,
    mutate
}
