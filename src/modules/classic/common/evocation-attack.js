const CONSTS = require('../../../consts')
const EffectProcessor = require('../../../EffectProcessor')


/**
 * Effectue une attaque d'évocation typique
 * C'est à dire : une attaque qui touche automatiquement sur une cible
 * Avec possibilité de jet de sauvegarde basé sur la DEX
 * Si le jet de sauvegarde réussit : c'est moitié de dommage
 * @param caster
 * @param target
 * @param level
 * @param damage
 * @param sType
 * @param dc
 */
function evocationAttack ({
                              caster,
                              target,
                              damage,
                              type: sType,
                              dc
                          }) {
    const { value } = target.rollSavingThrow(CONSTS.ABILITY_DEXTERITY, [CONSTS.THREAT_TYPE_SPELL])
    if (value >= dc) {
        damage = damage >> 1
    }
    const eDam = EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, damage, { type: sType })
    target.applyEffect(eDam, 0, caster)
}

module.exports = {
    evocationAttack
}