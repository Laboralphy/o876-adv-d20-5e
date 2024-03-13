const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");
/**
 *
 * @param caster {Creature}
 * @param target {Creature}
 */
module.exports = function (caster, target) {
    // Permet de contrôler un mort-vivant
    // La cible doit faire un jet de sauvegarde de Charisme contre le DD de sauvegarde de vos sorts.
    target.rollSavingThrow(CONSTS.ABILITY_CHARISMA, [], )
    // Si elle réussit, vous ne pouvez plus utiliser cette capacité de nouveau sur elle.
    // Si elle échoue, elle devient amicale envers vous et obéit à vos ordres jusqu'à ce que vous utilisiez cette disposition de nouveau.
    // Si la cible a une Intelligence de 8 ou plus, elle a un avantage à son jet de sauvegarde.
    // Si elle échoue au jet de sauvegarde et possède une Intelligence de 12 ou plus,
    // elle peut répéter son jet de sauvegarde à la fin de chaque heure, jusqu'à ce qu'elle réussisse et se libère.
}