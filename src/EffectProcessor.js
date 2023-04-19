const Effects = require('./effects')
const Events = require('events')

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

    /**
     * Référence une entité pour un usage futur dans les effect program
     * @param oCreature {Creature}
     */
    refCreature (oCreature) {
        if (oCreature) {
            this._creatures[oCreature.id] = oCreature
        }
    }

    static createEffect (sEffect, ...aArgs) {
        return Effects[sEffect].create(...aArgs)
    }

    invokeEffectMethod (oEffect, sMethod, oTarget, oSource) {
        const oEffectProg = Effects[oEffect.type]
        if (sMethod in oEffectProg) {
            oEffectProg[sMethod]({
                effect: oEffect,
                source: oSource || oTarget,
                target: oTarget
            }, this)
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
        this.removeDeadEffects(oCreature)
        this.flushCreatureRegistry(oCreature)
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
    }

    flushCreatureRegistry (oCreature) {
        const aCreatureToDelete = new Set(Object.keys(this._creatures))
        aCreatureToDelete.delete(oCreature.id)
        const aEffects = oCreature.store.getters.getEffects
        aEffects.forEach(eff => {
            aCreatureToDelete.delete(eff.source)
        })
        aCreatureToDelete.forEach(id => {
            delete this._creatures[id]
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
        if (duration > 0) {
            return target.store.mutations.addEffect({ effect: oEffect })
        } else {
            return oEffect
        }
    }
}

module.exports = EffectProcessor
