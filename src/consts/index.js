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
 *
 * @typedef D20AbilityBooleanRegistry {object}
 * @property ABILITY_STRENGTH {boolean}
 * @property ABILITY_DEXTERITY {boolean}
 * @property ABILITY_CONSTITUTION {boolean}
 * @property ABILITY_INTELLIGENCE {boolean}
 * @property ABILITY_WISDOM {boolean}
 * @property ABILITY_CHARISMA {boolean}
 *
 * @typedef D20AbilityRuleValueRegistry {object}
 * @property ABILITY_STRENGTH {D20RuleValue}
 * @property ABILITY_DEXTERITY {D20RuleValue}
 * @property ABILITY_CONSTITUTION {D20RuleValue}
 * @property ABILITY_INTELLIGENCE {D20RuleValue}
 * @property ABILITY_WISDOM {D20RuleValue}
 * @property ABILITY_CHARISMA {D20RuleValue}
 *
 * @typedef D20SkillBooleanRegistry {object}
 * @property SKILL_STEALTH {boolean}
 *
 * @typedef D20ThreatBooleanRegistry {object}
 *
 * @typedef D20AdvantagesOrDisadvantages {object}
 * @property ROLL_TYPE_ATTACK {abilities: D20AbilityRuleValueRegistry}
 * @property ROLL_TYPE_SAVE {abilities: D20AbilityRuleValueRegistry, threats: D20RuleValue}
 * @property ROLL_TYPE_SKILL {abilities: D20AbilityRuleValueRegistry, skills: D20RuleValue}
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
    ...require('./against-type.json'),
    ...require('./alignments.json'),
    ...require('./classes.json'),
    ...require('./conditions.json'),
    ...require('./damage-types.json'),
    ...require('./effects.json'),
    ...require('./entity-types.json'),
    ...require('./equipment-slots.json'),
    ...require('./feats.json'),
    ...require('./genders.json'),
    ...require('./index.js'),
    ...require('./item-types.json'),
    ...require('./item-properties.json'),
    ...require('./proficiencies.json'),
    ...require('./roll-types.json'),
    ...require('./sizes.json'),
    ...require('./skills.json'),
    ...require('./species.json'),
    ...require('./weapon-attributes.json')
}