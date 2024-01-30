const Effects = require('./effects')
const Events = require('events')
const CONSTS = require('./consts')

/**
 * @class EffectProcessor
 */
class EffectProcessor {
    constructor () {
        /**
         * Ce registre sert à retrouver la référence de la creature source d'un effet
         * @type {Object<string, Creature>}
         * @private
         */
        this._creatures = {}
        /**
         *
         * @type {{duration: number, effects: { target: Creature, effect: D20Effect }[], active: boolean, data:any }}
         * @private
         */
        this._concentration = {
            effects: [],
            duration: 0,
            active: false,
            data: {}
        }
        this._events = new Events()
    }

    get events () {
        return this._events
    }

    get creatures () {
        return this._creatures
    }

    /**
     *
     * @returns {{duration: number, effects: {target: Creature, effect: D20Effect}[], active: boolean}}
     */
    get concentration () {
        return this._concentration
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
        this.updateConcentration(oCreature)
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
     * Une créature sortante va disparaitre du système : on souhaite la supprimer du registre de la créature spécifiée
     * Ceci va supprimer certains effets de la créature spécifiée : ceux qui ont pour source la créature sortante.
     * @param oCreature {Creature} Créature dont on veut que les effets, dont la créature sortante est la source, soient purgés
     * @param oLeavingCreature {Creature} Créature sortante
     */
    removeCreatureFromRegistry (oCreature, oLeavingCreature) {
        const idSource = oLeavingCreature.id
        const aEffects = oCreature
            .store
            .getters
            .getEffects
            .filter(eff => eff.duration > 0 && eff.source === idSource)
        aEffects.forEach(eff => {
            oCreature.store.mutations.dispelEffect({ effect: eff })
        })
        this.removeDeadEffects(oCreature)
        this.flushCreatureRegistry(oCreature)
    }

    /**
     * La créature C spécifiée en paramètre peut subir des effets venant d'autres créatures influentes.
     * On garde trace de ces créatures influentes dans un registre, mais ces traces sont temporaires, le registre
     * n'a pas vocation à garder trace de toutes les créatures du jeu.
     * Lorsque des effets se dissipent, on vérifie dans le registre quelles sont les créatures qui n'ont plus aucune
     * influence sur C, c'est-à-dire celles qui ne sont plus source d'aucun effet appliqué à C.
     * Ces créatures n'ayant plus d'influence sont retirées du registre par cette fonction.
     * @param oCreature {Creature}
     */
    flushCreatureRegistry (oCreature) {
        // ensemble des créatures
        // Ce Set permettra d'obtenir la liste des créatures à virer (par différence)
        const aCreatureToDelete = new Set(Object.keys(this._creatures))
        // On se supprime soi-même du Set
        aCreatureToDelete.delete(oCreature.id)
        // On obtient la liste les creatures qui sont la source d'au moins un effet
        const aInfluentCreatures = oCreature.store.getters.getEffectSources
        // On obtient la liste les creatures qui sont la cible d'un effet concentré
        aInfluentCreatures
            .forEach(id => {
                // On vire de la liste les créature qui ne doivent pas être flushées,
                // C'est-à-dire les créatures éléments de l'union des deux listes.
                aCreatureToDelete.delete(id)
            })
        // On déréférence toutes les cratures qui restent dans le Set
        aCreatureToDelete.forEach(id => {
            this.unrefCreature(this._creatures[id])
        })
    }

    // ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ******
    // ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ******
    // ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ******
    // ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ******
    // ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ******
    // ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ****** CONCENTRATION ******

    /**
     * Applique un effet concentré sur une créature
     * @param oEffect {D20Effect}
     * @param oSource {Creature}
     * @param oTarget {Creature}
     * @param duration {number}
     */
    applyConcentrationEffect(oEffect, duration, oTarget, oSource = null) {
        oEffect.exportable = false
        const oAppliedEffect = oTarget.applyEffect(oEffect, duration, oSource)
        const c = this._concentration
        c.active = true
        c.duration = Math.max(duration, this._concentration.duration)
        c.effects.push({
            target: oTarget,
            effect: oAppliedEffect
        })
        return oAppliedEffect
    }

    /**
     * La concentration est brisée : supprimer les effets associés
     */
    breakConcentration (oCreature) {
        const c = this._concentration
        if (c.active) {
            c.effects.forEach(({ target, effect }) => {
                target.store.mutations.dispelEffect({ effect })
            })
            c.active = false
            c.duration = 0
            c.effects = []
        }
    }

    updateConcentration (oCreature) {
        const c = this._concentration
        if (c.active) {
            --c.duration
            if (c.duration <= 0) {
                this.breakConcentration(oCreature)
            }
        }
    }

    /**
     *
     * @param oEffect {D20Effect}
     * @param target {Creature}
     * @param duration {number}
     * @param source {Creature}
     */
    applyEffect (oEffect, target, duration, source = undefined) {
        oEffect.source = source ? source.id : target.id
        oEffect.duration = duration || 0
        this.runEffect(oEffect, target, source || target)
        const sUnicity = oEffect.unicity
        if (target.store.getters.getEffectSet.has(oEffect.type) && sUnicity !== CONSTS.EFFECT_UNICITY_STACK) {
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
