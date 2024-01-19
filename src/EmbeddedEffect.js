/**
 * @class EmbeddedEffect
 *
 * Cette classe est prévue pour pouvoir accueillir un effet ainsi que les référence de la source et de la cible.
 * Ainsi, il est possible, pour une instance de cette classe, de pouvoir terminer un effet E appliqué à une créature cible Cc
 * lorsque E est managé par un effect de concentration appliqué à une créature initiatrice Ci.
 * Un exemple typique est le cas du sort d'invisibilité appliqué à autrui : L'effet de concentration accepte une instance
 * d'EmbeddedEffect mais l'effet lui, est appliqué à une créature cible qui n'est pas le caster.
 * Si la concentration du caster est rompue, il faut terminer l'effet invisible sur target.
 */
class EmbeddedEffect {
    /**
     *
     * @param effect {D20Effect}
     * @param parentEffect {D20Effect}
     * @param target {Creature}
     * @param source {Creature}
     */
    constructor ({ effect, parentEffect, target, source }) {
        this._effect = effect
        this._parentEffect = parentEffect
        /**
         * @type {Creature}
         * @private
         */
        this._source = source
        /**
         * @type {Creature}
         * @private
         */
        this._target = target
    }

    /**
     * Termine l'effet imbriqué
     */
    dispose () {
        this._target.store.mutations.dispelEffect(this._effect)
    }
}

module.exports = EmbeddedEffect
