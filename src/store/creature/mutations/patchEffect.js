const PATCHABLE_PROPERTIES = new Set([
    'amp',
    'duration',
    'data'
])

module.exports = ({ state }, { effect }) => {
    if (!effect) {
        throw new Error('"effect" property is missing in mutation parameters')
    }
    const id = effect.id
    const oFoundEffect = state.effects.find(eff => eff.id === id)
    if (oFoundEffect) {
        for (const [key, value] of Object.entries(effect)) {
            if (PATCHABLE_PROPERTIES.has(key) && oFoundEffect[key] !== value) {
                oFoundEffect[key] = value
            }
        }
    }
}
