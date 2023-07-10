const CONSTS = require('../../../consts')
const { evocationAttack } = require('../common/spell-helper')

/**
 * Tire un projectile de feu sur la cible pour 2d6 de feu avec save dex dc 11
 * @param caster {Creature}
 */
module.exports = function (caster) {
    evocationAttack({
        caster,
        target: caster.getTarget(),
        damage: caster.roll('2d6'),
        type: CONSTS.DAMAGE_TYPE_FIRE,
        dc: 11
    })
}