// Mutation restoreActionFeatCounters
//
// Permet à une créature de récupérer l'ensemble de ses compteurs d'action quotidien

module.exports = ({ state, getters }) => {
    // Déterminer les actions innées
    // Les actions innées des monstres sont gérées par l'IA

    // Déterminer les actions de feats
    getters
        .getFeatReport.filter(({ activable }) => activable)
        .forEach(({ feat }) => {
            state.counters[feat].value = state.counters[feat].max
        })
}
