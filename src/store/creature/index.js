const path = require('path')
const TreeSync = require('../../../libs/tree-sync')

/**
 * @typedef D20CreatureStoreGetters {object}
 * @property getAbilityBaseValues {D20AbilityNumberRegistry}
 * @property getAbilityBonus {D20AbilityNumberRegistry}
 * @property getAbilityList {string[]}
 * @property getAbilityModifiers {D20AbilityNumberRegistry}
 * @property getAbilityValues {D20AbilityNumberRegistry}
 * @property getAdvantages {D20AdvantagesOrDisadvantages}
 * @property getArmorAndShieldClass {number}
 * @property getDefensiveEquipmentItemProperties {array}
 * @property getDefensiveEquipmentList {array}
 * @property getDisadvantages {D20AdvantagesOrDisadvantages}
 * @property getEffects {array}
 * @property getEntropyType {string}
 * @property getEquippedItems {*}
 * @property getExhaustionLevel {number}
 * @property getLevel {number}
 * @property getLevelByClass {*}
 * @property getMaxHitPoints {number}
 * @property getMoralityType {string}
 * @property getProficiencyBonus {number}
 * @property getRangedWeaponProperties {array}
 * @property getSelectedWeapon {*}
 * @property getSelectedWeaponAttackBonus {number}
 * @property getSpecie {string}
 * @property getSpeed {number}
 * @property isProficientArmorAndShield {boolean}
 * @property isProficientSelectedWeapon {boolean}
 * @property isWearingStealthDisadvantagedArmor {boolean}
 *
 * @typedef D20CreatureStoreMutations {object}
 * @property addClass {function({ ref: string, levels: number })}
 * @property addEffect {function({ effect: object })}
 * @property equipItem {function({ item: object, slot: string })}
 * @property setAbility {function({ ability: string, value: number })}
 * @property setSelectedWeapon {function({ slot: string })}
 *
 * @typedef D20CreatureStore {object}
 * @property mutations {D20CreatureStoreMutations}
 * @property getters {D20CreatureStoreGetters}
 */

const buildState = require('./state')
/**
 * @type {D20CreatureStoreMutations}
 */
const mutations = TreeSync.recursiveRequire(path.resolve(__dirname, 'mutations'), true)
/**
 * @type {D20CreatureStoreGetters}
 */
const getters = TreeSync.recursiveRequire(path.resolve(__dirname, 'getters'), true)

module.exports = {
    buildState,
    mutations,
    getters
}