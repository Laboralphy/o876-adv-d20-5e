/**
 * @typedef D20AbilityNumberRegistry {object}
 * @property ABILITY_STRENGTH {number}
 * @property ABILITY_DEXTERITY {number}
 * @property ABILITY_CONSTITUTION {number}
 * @property ABILITY_INTELLIGENCE {number}
 * @property ABILITY_WISDOM {number}
 * @property ABILITY_CHARISMA {number}
 */

/**
 * @typedef D20RuleValue {object}
 * @property rules {object.<string, boolean>}
 * @property value {boolean}
 *
 * @typedef D20RuleValueRegistry {object}
 * @property ABILITY_STRENGTH {D20RuleValue}
 * @property ABILITY_DEXTERITY {D20RuleValue}
 * @property ABILITY_CONSTITUTION {D20RuleValue}
 * @property ABILITY_INTELLIGENCE {D20RuleValue}
 * @property ABILITY_WISDOM {D20RuleValue}
 * @property ABILITY_CHARISMA {D20RuleValue}
 * @property SKILL_STEALTH {D20RuleValue}
 *
 * @typedef D20AdvantagesOrDisadvantages {object}
 * @property ROLL_TYPE_ATTACK {D20RuleValueRegistry}
 * @property ROLL_TYPE_SAVE {D20RuleValueRegistry}
 * @property ROLL_TYPE_CHECK {D20RuleValueRegistry}
 *
 * @typedef D20ConditionBooleanRegistry {{[p: string]: boolean}}
 */

/**
 * @typedef D20ArmorData {object}
 * @property proficiency {string}
 * @property ac {number}
 * @property maxDexterityModifier {false|number}
 * @property minStrengthRequired {number}
 * @property disadvantageStealth {boolean}
 * @property weight {number}
 * @property equipmentSlots {string}
 *
 * @typedef D20WeaponData {object}
 * @property damage {string}
 * @property damageType {string}
 * @property attributes {string[]}
 * @property proficiency {string}
 * @property weight {number}
 * @property equipmentSlots {string}
 *
 * @typedef D20Item {object}
 * @property entityType {string}
 * @property itemType {string}
 * @property [armorType] {string}
 * @property [weaponType] {string}
 * @property properties {[]}
 * @property data {D20ArmorData|D20WeaponData}
 */

module.exports = {
    ...require('./abilities.json'),
    ...require('./actions.json'),
    ...require('./against-type.json'),
    ...require('./alignments.json'),
    ...require('./area-flags.json'),
    ...require('./conditions.json'),
    ...require('./damage-types.json'),
    ...require('./effects.json'),
    ...require('./entity-types.json'),
    ...require('./equipment-slots.json'),
    ...require('./genders.json'),
    ...require('./index.js'),
    ...require('./item-types.json'),
    ...require('./extra-properties.json'),
    ...require('./proficiencies.json'),
    ...require('./roll-types.json'),
    ...require('./sizes.json'),
    ...require('./skills.json'),
    ...require('./species.json'),
    ...require('./weapon-attributes.json')
}