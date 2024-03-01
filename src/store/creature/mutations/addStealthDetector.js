const CONSTS = require('../../../consts')
const { refreshItem } = require('../../../libs/array-mutations')

/**
 * Ajoute une créature ayant détecté le stealth, à la liste.
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @param creature {string|number}
 */
module.exports = ({ state, getters }, { creature }) => {
    if (typeof creature === 'object') {
        throw new TypeError('creature parameter must be number or string')
    }
    if (!getters.getStealthDetectionSet.has(creature)) {
        const oEffect = state.effects.find(effect => effect.type === CONSTS.EFFECT_STEALTH)
        if (oEffect) {
            oEffect.data.detectedBy.push(creature)
            refreshItem(state.effects, oEffect)
        }
    }
}
