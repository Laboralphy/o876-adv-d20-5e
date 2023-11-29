const CONSTS = require('../../../consts')
const { conditionAttack } = require('../common/spell-helper')

/**
 * Tire un projectile de feu sur la cible pour 2d6 de feu avec save dex dc 11
 * @param caster {Creature}
 */
module.exports = function (caster) {
    conditionAttack({
        caster,
        target: caster.getTarget(),
        condition: CONSTS.CONDITION_BLINDED,
        duration: 10,
        savingAbility: CONSTS.ABILITY_DEXTERITY,
        dc: 10,
        apply: true
    })
}