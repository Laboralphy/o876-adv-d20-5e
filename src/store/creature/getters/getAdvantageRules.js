/**
 *
 * @param state
 * @param getters
 * @returns {{ }}
 */
module.exports = (state, getters) => ({
    targetCannotSeeMe: !getters.canTargetSeeMe
})
