const Effects = require('./effects')

/**
 * @class EffectProcessor
 */
class EffectProcessor {
    constructor () {
        this._creatures = {}
    }

    /**
     * Référence une entité pour un usage futur dans les effecct program
     * @param oCreature {Creature}
     */
    refCreature (oCreature) {
        if (oCreature) {
            this._creatures[oCreature.id] = oCreature
        }
    }

    createEffect (sEffect, ...aArgs) {
        return Effects[sEffect].create(...aArgs)
    }

    /**
     *
     * @param aCreatures {Creature[]}
     */
    processEffects (aCreatures) {
        const aCreatureToDelete = new Set(Object.keys(this._creatures))
        aCreatures.forEach(c => {
            aCreatureToDelete.delete(c.id)
            this.processCreatureEffects(c, aCreatures)
        })
        aCreatureToDelete.forEach(id => {
            delete this._creatures[id]
        })
    }

    invokeEffectMethod (oEffect, sMethod, oTarget, oSource) {
        const oEffectProg = Effects[oEffect.tag]
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
        const aEffects = oCreature.store.state.effects
        aEffects.forEach(eff => {
            if (eff.tag === 'EFFECT_GROUP') console.log(eff)
            if (eff.duration > 0) {
                const oSource = this.getEffectSource(eff)
                this.runEffect(eff, oCreature, oSource)
                --eff.duration
            }
        })
        // remove dead effects
        for (let i = aEffects.length - 1; i >= 0; --i) {
            const oEffect = aEffects[i]
            if (oEffect.duration <= 0) {
                const aDisposedEffects = aEffects.splice(i, 1)
                aDisposedEffects.forEach(eff => {
                    this.invokeEffectMethod(eff, 'dispose', oCreature, this.getEffectSource(eff))
                })
            }
        }
    }

    removeEffect (oCreature, idEffect) {
        const oEffect = oCreature.store.getters.getEffects.find(eff => eff.id === idEffect)
        if (oEffect) {
            oEffect.duration = 0
        }
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
            target.store.mutations.addEffect({ effect: oEffect })
        }
    }
}

module.exports = EffectProcessor
