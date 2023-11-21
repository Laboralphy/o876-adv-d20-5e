const CONSTS = require("../../../consts");

/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {{innate: boolean, uses: {max: number, value: number}, action: string}[]}
 */
module.exports = (state, getters, externals) => {
    const { data } = externals
    const aActions = state
        .feats
        .filter(feat => 'action' in data[feat])
        .map(feat => {
            const oCounters = state.counters
            const uses = oCounters[feat]?.value || Infinity
            const usesMax = oCounters[feat]?.max || Infinity
            return {
                action: feat,
                uses: {
                    value: uses,
                    max: usesMax
                },
                innate: false
            }
        })
    const oBlueprint = externals.blueprints[state.ref]
    if (oBlueprint && ('actions' in oBlueprint)) {
        oBlueprint
            .actions
            .forEach(sAction => {
                aActions.push({
                    action: sAction,
                    uses: {
                        value: Infinity,
                        max: Infinity
                    },
                    innate: true
                })
            })
    }
    return aActions
}
