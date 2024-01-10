const Effects = require('./effects')
const Events = require('events')
const CONSTS = require('./consts')

/**
 * @class EffectProcessor
 */
class EffectProcessor {
    constructor () {
        this._creatures = {}
        this._events = new Events()
    }

    get events () {
        return this._events
    }

    get creatures () {
        return this._creatures
    }

    /**
     * Référence une entité pour un usage futur dans les effect program
     * @param oCreature {Creature}
     */
    refCreature (oCreature) {
        if (oCreature) {
            this._creatures[oCreature.id] = oCreature
        }
    }

    unrefCreature (oCreature) {
        if (oCreature) {
            delete this._creatures[oCreature.id]
        }
    }

    static createEffect (sEffect, ...aArgs) {
        const EffectBuilder = Effects[sEffect]
        const oEffect = Effects[sEffect].create(...aArgs)
        oEffect.mutable = 'mutate' in EffectBuilder
        return oEffect
    }

    invokeEffectMethod (oEffect, sMethod, oTarget, oSource, data) {
        const oEffectProg = Effects[oEffect.type]
        if (sMethod in oEffectProg) {
            oEffectProg[sMethod]({
                processor: this,
                effect: oEffect,
                source: oSource || oTarget,
                target: oTarget,
                data
            }, this)
        }
    }

    invokeAllEffectsMethod (oCreature, sMethod, oTarget, oSource, data) {
        const aEffects = oCreature.store.getters.getEffects
        for (let iEff = 0, l = aEffects.length; iEff < l; ++iEff) {
            this.invokeEffectMethod(aEffects[iEff], sMethod, oTarget, oSource, data)
        }
    }

    runEffect (oEffect, oCreature, oSource) {
        this.refCreature(oCreature)
        this.refCreature(oSource)
        this.invokeEffectMethod(oEffect, 'mutate', oCreature, oSource)
    }

    getEffectSource (oEffect) {
        return oEffect.source
            ? this._creatures[oEffect.source]
            : null
    }

    processCreatureEffects (oCreature) {
        const aEffects = oCreature.store.getters.getEffects
        // getEffects semble renvoyer null
        aEffects.forEach(eff => {
            const oSource = this.getEffectSource(eff)
            this.runEffect(eff, oCreature, oSource)
            oCreature.store.mutations.decrementEffectDuration({ effect: eff })
        })
        const deff = this.removeDeadEffects(oCreature)
        if (deff.length > 0) {
            this.flushCreatureRegistry(oCreature)
        }
    }

    removeDeadEffects (oCreature) {
        const aDeadEffects = oCreature
            .store
            .getters
            .getDeadEffects
        oCreature.store.mutations.removeDeadEffects()
        aDeadEffects
            .forEach(eff => {
                this._events.emit('dispose', { effect: eff })
                this.invokeEffectMethod(eff, 'dispose', oCreature, this.getEffectSource(eff))
            })
        return aDeadEffects
    }

    /**
     * Renvoie la liste des créatures qui ne sont la source d'aucun effet appliqué à d'autre créature
     * Si une créature qu'on veut supprimer du registre n'est la source d'aucun effet appliqué à une autre
     * créature qu'elle, on peut la supprimer
     */
    getSourceCreatures () {
        const aCreatureKeys = Object.keys(this._creatures)
        const aSourceCreatures = new Set(aCreatureKeys)
        for (const [id, oCreature] of aCreatureKeys) {
            oCreature
                .store
                .getters
                .getEffectSources
                .forEach(eff => {
                    if (eff.source !== id) {
                        aSourceCreatures.delete(eff.source)
                    }
                })
        }
    }

    /**
     * Supprime du registre la créature spécifiée ainsi que tous les effets dont elle est la source.
     * @param oCreature {Creature} Créature dont on veut que les effets soient purgé
     * @param oSource {Creature} Créature qu'on veut voir disparaitre
     */
    removeCreatureFromRegistry (oCreature, oSource) {
        const idSource = oSource.id
        const aEffects = oCreature
            .store
            .getters
            .getEffects
            .filter(eff => eff.duration > 0 && eff.source === idSource)
        aEffects.forEach(eff => {
            eff.duration = 0
        })
        this.flushCreatureRegistry(oCreature)
    }

    /**
     * Supprime du registre de la créature spécifiée, les creatures qui ne font plus effet sur elle
     * @param oCreature {Creature} Créature dont on veut faire un vaccuum sur les effets
     */
    flushCreatureRegistry (oCreature) {
        const aCreatureToDelete = new Set(Object.keys(this._creatures))
        aCreatureToDelete.delete(oCreature.id)
        oCreature
            .store
            .getters
            .getEffects
            .filter(eff => eff.duration > 0)
            .forEach(eff => {
                aCreatureToDelete.delete(eff.source)
            })
        aCreatureToDelete.forEach(id => {
            this.unrefCreature(this._creatures[id])
        })
    }

    /**
     *
     * @param oEffect
     * @param target {Creature}
     * @param duration {number}
     * @param source {Creature}
     */
    applyEffect (oEffect, target, duration, source = undefined) {
        oEffect.source = source ? source.id : target.id
        oEffect.duration = duration || 0
        this.runEffect(oEffect, target, source || target)
        const sUnicity = oEffect.unicity
        if (target.store.getters.getEffectList.has(oEffect.type) && sUnicity !== CONSTS.EFFECT_UNICITY_STACK) {
            const oAlreadyHaveEffect = target
                .store
                .getters
                .getEffects
                .find(eff => eff.type === oEffect.type)
            switch (sUnicity) {
                case CONSTS.EFFECT_UNICITY_NO_REPLACE: {
                    // On ne remplace pas l'effet déja installé
                    return oAlreadyHaveEffect
                }

                case CONSTS.EFFECT_UNICITY_REPLACE: {
                    // On remplace l'effet existant
                    oAlreadyHaveEffect.duration = 0
                }
            }
        }

        if (duration > 0) {
            return target.store.mutations.addEffect({ effect: oEffect })
        } else {
            return oEffect
        }
    }
}

module.exports = EffectProcessor
