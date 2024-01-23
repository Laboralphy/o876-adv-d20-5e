const Manager = require('./src/Manager')
const Creature = require('./src/Creature')
const EffectProcessor = require('./src/EffectProcessor')
const EntityFactory = require('./src/EntityFactory')
const AssetManager = require('./src/AssetManager')
const { Config, CONFIG } = require('./src/config')
const CONSTS = require('./src/consts')
const Evolution = require('./src/Evolution')
const publicAssets = {
    en: require('./src/public-assets/public-assets.en.json'),
    fr: require('./src/public-assets/public-assets.fr.json')
}

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
 *
 * @typedef D20AdvantagesOrDisadvantages {object}
 * @property ROLL_TYPE_ATTACK {D20RuleValueRegistry}
 * @property ROLL_TYPE_SAVE {D20RuleValueRegistry}
 * @property ROLL_TYPE_CHECK {D20RuleValueRegistry}
 *
 * @typedef D20ConditionBooleanRegistry {{[p: string]: boolean}}
 *
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
 * @property versatileDamage {string}
 * @property attributes {string[]}
 * @property proficiency {string}
 * @property weight {number}
 * @property equipmentSlots {string}
 *
 * @typedef D20Item {object}
 * @property ref {string} blueprint reference
 * @property entityType {string}
 * @property itemType {string}
 * @property [armorType] {string}
 * @property [weaponType] {string}
 * @property [shieldType] {string}
 * @property [ammoType] {string}
 * @property properties {[]}
 * @property data {D20ArmorData|D20WeaponData|D20AmmoData|D20ShieldData}
 * @property equipmentSlots {string[]}
 * @property material {string}
 *
 * @property D20AmmoData {object}
 * @property weight {number}
 * @property weaponTypes {string[]}
 * @property equipmentSlots {string}
 *
 * @property D20ShieldData {object}
 * @property weight {number}
 * @property equipmentSlots {string}
 */

module.exports = {
    AssetManager,
    CONFIG,
    CONSTS,
    Config,
    Creature,
    EffectProcessor,
    EntityFactory,
    Evolution,
    Manager,
    publicAssets
}
