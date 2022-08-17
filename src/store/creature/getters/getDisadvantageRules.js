/**
 *
 * @param state
 * @param getters
 * @returns {*}
 */
module.exports = (state, getters) => ({
    exhaustionLevel3: getters.getExhaustionLevel >= 3,
    exhaustionLevel1: getters.getExhaustionLevel >= 1,
    nonProficientArmorShield: !getters.isProficientArmorAndShield,
    wearingNonStealthArmor: getters.isWearingStealthDisadvantagedArmor,
    isTargetInvisible: !getters.isTargetVisible
})
