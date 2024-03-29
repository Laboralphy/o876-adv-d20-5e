/**
 * @typedef D20CreatureStoreMutations {object}
 * @property addClass {function({ ref: string, levels: number })}
 * @property addEffect {function({ effect: D20Effect })}
 * @property addFeat {function({ feat: string })}
 * @property addProficiency {function({ proficiency: string })}
 * @property addRecentDamageType {function({ effect: D20Effect, type: string, amount: number })}
 * @property addStealthDetector {function({ creature: string | number })}
 * @property addSkill {function({ skill: string })}
 * @property clearAggressor {function}
 * @property clearRecentDamageTypes {function({ effect: D20Effect })}
 * @property clearTarget {function}
 * @property damage {function({ amount: number })}
 * @property decrementEffectDuration {function({ effect: D20Effect, value: number })}
 * @property dispelEffect {function({ effect })}
 * @property dispelEffectFromCreature {function({ creature })}
 * @property equipItem {function({ item: object, slot: string })}
 * @property heal {function({ amount })}
 * @property importCreatureState {function({ state })}
 * @property resetCharacter {function}
 * @property setAbility {function({ ability: string, value: number })}
 * @property setAreaFlags {function({ flags: string[] })}
 * @property setCounterValue {function({ counter, value, max })}
 * @property setEncumbrance {function({ value: number })}
 * @property setGaugeDamage {function({ value })}
 * @property setId {function({ value })}
 * @property setRef {function({ value })}
 * @property setSelectedWeapon {function({ slot: string })}
 * @property setSize {function({ value })}
 * @property setSpecie {function({ value })}
 * @property setSpeed {function({ value })}
 * @property setTargetDistance {function({ value })}
 * @property updateAggressorConditions {function({ [id]: number, conditions: Set|[], effects: string[] })}
 * @property updateFeatEffects {function()}
 * @property updateTargetConditions {function({ [id]: number, conditions: Set|[], effects: string[] })}
 * @property learnSpell {function({spell: string}}
 * @property restoreSpellSlot {function({level: number, count: number}}
 * @property defineMasteredSpell {function({spell: string})}
 * @property defineSignatureSpell {function({spell: string})}
 * @property prepareSpell {function({ spell })}
 * @property consumeSignatureSpellSlot {function({ spell })}
 * @property consumeSpellSlot {function({ level }}
 */