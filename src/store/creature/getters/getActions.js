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
            const uses = oCounters[feat]?.value || 0
            const usesMax = oCounters[feat]?.max || Infinity
            return {
                action: feat,
                script: data[feat].action,
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
                    script: sAction,
                    uses: {
                        value: 0,
                        max: Infinity
                    },
                    innate: true
                })
            })
    }
    return aActions
}
