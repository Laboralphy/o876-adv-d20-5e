/**
 * @typedef D20CreatureStoreGetters {object}
 * @property getAbilityBaseValues {D20AbilityNumberRegistry}
 * @property getAbilityBonus {D20AbilityNumberRegistry}
 * @property getAbilityList {string[]}
 * @property getAbilityModifiers {D20AbilityNumberRegistry}
 * @property getAbilityValues {D20AbilityNumberRegistry}
 * @property getAdvantages {*}
 * @property getAggressor {{ condition: Object.<string, boolean>}}
 * @property getAggressorConditionSources {{}}
 * @property getAggressorConditions {Set}
 * @property getAreaFlags {Set<string>}
 * @property getArmorClass {number}
 * @property getArmorMaterial {string}
 * @property getAttackBonus {number}
 * @property getCarryingCapacity {number}
 * @property getConditionSources {D20ConditionBooleanRegistry}
 * @property getConditions {Set<string>}
 * @property getDamageMitigation {Object<string, D20OneDamageMitigation>}}
 * @property getDeadEffects {[]}
 * @property getDefensiveEquipmentList {D20Item[]}
 * @property getDisadvantages {D20AdvantagesOrDisadvantages}
 * @property getDistanceToTarget {number}
 * @property getEffects {[]}
 * @property getEncumbranceLevel {number}
 * @property getEntityVisibility {D20EntityVisibilityResult}
 * @property getEntropyType {string}
 * @property getEquipmentItemProperties {[]}
 * @property getEquipmentList {D20Item[]}
 * @property getEquippedItems {{[slot: string]: D20Item}}
 * @property getExhaustionLevel {number}
 * @property getFeatReport {FeatReport[]}
 * @property getHitPoints {number}
 * @property getId {number}
 * @property getLevel {number}
 * @property getLevelByClass {{[c: string]: number}}
 * @property getMaxHitPoints {number}
 * @property getMoralityType {string}
 * @property getOffensiveAbility {string}
 * @property getOffensiveAbilityBonus {number}
 * @property getOffensiveEquipmentList {D20Item[]}
 * @property getOffensiveSlot {string}
 * @property getProficiencies {string[]}
 * @property getProficiencyBonus {number}
 * @property getSelectedWeapon {D20Item}
 * @property getSelectedWeaponCriticalThreat {number}
 * @property getSelectedWeaponMaterial {string}
 * @property getSelectedWeaponProperties {array}
 * @property getSelectedWeaponRange {number}
 * @property getShieldMaterial {string}
 * @property getSize {string}
 * @property getSizeProperties {{value: number, hitDie: number, space: number, carryingCapacity}}
 * @property getSpecie {string}
 * @property getSpeed {number}
 * @property getTarget {{ condition: Object.<string, boolean>}}
 * @property getTargetConditionSources {{}}
 * @property getTargetConditions {Set}
 * @property getTargetDistance {number}
 * @property isProficientArmorAndShield {boolean}
 * @property isProficientSelectedWeapon {boolean}
 * @property isTargetInMeleeWeaponRange {boolean}
 * @property isTargetInWeaponRange {boolean}
 * @property isWearingStealthDisadvantagedArmor {boolean}
 * @property isWeildingNonLightWeapon {boolean}
 * @property isWeildingRangedWeapon {boolean}
 * @property getWizardSpellSlots {number[]}
 * @property has1HWeaponNoShield {boolean}
 * @property has2HWeaponNoShield {boolean}
 * @property isWearingArmor {boolean}
 */
