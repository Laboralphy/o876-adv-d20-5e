const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

const SAVING_THROW_KEY = 'CONTROL_UNDEAD_NECRO_FAILED_ATTEMPT_LIST'
const SAVING_THROW_SEPARATOR = ' '

/**
 *
 * @param caster {Creature}
 * @param target {Creature}
 */
module.exports = function (caster, target) {
    // Permet de contrôler un mort-vivant
    // La cible doit être un mort-vivant
    if (target.store.getters.getSpecie !== CONSTS.SPECIE_UNDEAD) {
        return {
            outcome: 'fa-control-undead:target-must-be-undead'
        }
    }
    // La cible ne doit pas avoir résisté à un controle de ce nécro
    const sWhoHaveFailed = target.store.getters.getData[SAVING_THROW_KEY] || ''
    if (sWhoHaveFailed.includes(caster.id)) {
        // Ce necro a déja tenté le coup, l'undead est immunisé
        return {
            outcome: 'fa-control-undead:immunity-caused-by-previous-failed-attempt'
        }
    }

    // La cible doit faire un jet de sauvegarde de Charisme contre le DD de sauvegarde de vos sorts.
    const dc = target.store.getters.getSpellDC
    if (dc === undefined) {
        throw new Error('This feat action (control undead) need ddmagic module, please activate.')
    }

    const outcome = target.rollSavingThrow(CONSTS.ABILITY_CHARISMA, [], dc, caster)
    // Si elle réussit, vous ne pouvez plus utiliser cette capacité de nouveau sur elle.
    if (outcome.success) {
        target.store.mutations.setDataValue(SAVING_THROW_KEY, sWhoHaveFailed + SAVING_THROW_SEPARATOR + caster.id)
        return {
            outcome: 'fa-control-undead:saving-throw'
        }
    }
    // Si elle échoue, elle devient amicale envers vous et obéit à vos ordres jusqu'à ce que vous utilisiez cette disposition de nouveau.
    // Si la cible a une Intelligence de 8 ou plus, elle a un avantage à son jet de sauvegarde.
    // Si elle échoue au jet de sauvegarde et possède une Intelligence de 12 ou plus,
    // elle peut répéter son jet de sauvegarde à la fin de chaque heure, jusqu'à ce qu'elle réussisse et se libère.
}