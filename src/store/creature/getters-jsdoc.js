/**
 * @typedef D20CreatureStoreGetters {object}
 * @property canApproachTarget {boolean}
 * @property canAttackTarget {boolean}
 * @property canMove {boolean}
 * @property getAbilityBaseValues {D20AbilityNumberRegistry}
 * @property getAbilityBonus {D20AbilityNumberRegistry}
 * @property getAbilityList {string[]}
 * @property getAbilityModifiers {D20AbilityNumberRegistry}
 * @property getAbilityValues {D20AbilityNumberRegistry}
 * @property getAdvantagePropEffects {Object<string, Object<string, string>>}
 * @property getAdvantages {D20AdvantagesOrDisadvantages}
 * @property getAggressor {{ condition: Object.<string, boolean>}}
 * @property getAggressorConditionSources {{}}
 * @property getAggressorConditions {Set}
 * @property getApproachToTargetTurns {number}
 * @property getAreaFlags {Set<string>}
 * @property getArmorClass {number}
 * @property getArmorClassDetails {{armor: number, dexterity: number, shield: number, effects: number, props: number}}
 * @property getArmorClassRanges {{type: string, min: number, max: number}[]}
 * @property getArmorMaterial {string}
 * @property getAttackBonus {number}
 * @property getBreakableEffects undefined
 * @property getCarryingCapacity {number}
 * @property getConditionImmunities {Set<string>}
 * @property getConditionSources {D20ConditionBooleanRegistry}
 * @property getConditions {Set<string>}
 * @property getDamageMitigation {Object<string, D20OneDamageMitigation>}}
 * @property getDamageRerollThreshold {[]}
 * @property getDeadEffects {[]}
 * @property getDefensiveApplicableConditions {{condition: string, dc: number, ability: number, duration: number}[]}
 * @property getDefensiveEquipmentList {D20Item[]}
 * @property getDisadvantagePropEffects {Object<string, string>}
 * @property getDisadvantages {D20AdvantagesOrDisadvantages}
 * @property getEffectSources {string[]}
 * @property getEffects {D20Effect[]}
 * @property getEncumbranceLevel {number}
 * @property getEntityVisibility {D20EntityVisibilityResult}
 * @property getEntropyType {string}
 * @property getEquipmentItemProperties {[]}
 * @property getEquipmentList {D20Item[]}
 * @property getEquippedItems {{[slot: string]: D20Item}}
 * @property getExhaustionLevel {number}
 * @property getFeatReport {FeatReport[]}
 * @property getHealMitigation {{pharma: boolean, negateheal: boolean, factor: number}}
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
 * @property getRecentDamageTypes {{ type: string, amount: number }}
 * @property getSavingThrowBonus {{}}
 * @property getSelectedWeapon {D20Item}
 * @property getSelectedWeaponApplicableConditions {{condition: string, dc: number, saveAbility: number, duration: number}[]}
 * @property getSelectedWeaponApplicablePoisons {{condition: string, dc: number, saveAbility: number, duration: number}[]}
 * @property getSelectedWeaponCriticalThreat {number}
 * @property getSelectedWeaponMaterial {string}
 * @property getSelectedWeaponOnHitProperties {{condition: string, dc: number, saveAbility: number, duration: number}[]}
 * @property getSelectedWeaponProperties {array}
 * @property getSelectedWeaponRange {number}
 * @property getShieldMaterial {string}
 * @property getSize {string}
 * @property getSizeProperties {{value: number, hitDice: number, space: number, carryingCapacity: number, extraMeleeDamageDice: number }}
 * @property getSkillProficiencies {Set<string>}
 * @property getSpecie {string}
 * @property getSpeed {number}
 * @property getSuitableOffensiveSlot {string}
 * @property getTarget {{ condition: Object.<string, boolean>}}
 * @property getTargetConditionSources {{}}
 * @property getTargetConditions {Set}
 * @property getTargetDistance {number}
 * @property isEquippedWithRangedWeapon {boolean}
 * @property isProficientArmorAndShield {boolean}
 * @property isProficientSelectedWeapon {boolean}
 * @property isRangedWeaponProperlyLoaded {boolean}
 * @property isTargetAutoCritical {boolean}
 * @property isTargetInMeleeWeaponRange {boolean}
 * @property isTargetInWeaponRange {boolean}
 * @property isWearingStealthDisadvantagedArmor {boolean}
 * @property isWieldingHeavyMeleeWeapon {boolean}
 * @property isWieldingNonLightWeapon {boolean}
 * @property isWieldingRangedWeapon {boolean}
 * @property getClassicSkillAdvantages {D20AdvantagesOrDisadvantages}
 * @property getClassicSkillDisadvantages {*}
 * @property getProficiencyHalfBonus {number}
 * @property getWizardSpellSlots {number[]}
 * @property has1HWeaponNoShield {boolean}
 * @property has2HWeaponNoShield {boolean}
 * @property isWearingArmor {boolean}
 */
