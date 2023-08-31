/**
 * @typedef D20CreatureStoreMutations {object}
 * @property addClass {function({ ref: string, levels: number })}
 * @property addEffect {function({ effect: D20Effect })}
 * @property addRecentDamageType {function({ effect: D20Effect, type: string, amount: number })}
 * @property clearRecentDamageTypes{function({ effect: D20Effect })}
 * @property removeEffect {function({ effect: D20Effect })}
 * @property removeEffectIndex {function({ index: number })}
 * @property patchEffect {function({ effect: D20Effect })}
 * @property decrementEffectDuration {function({ effect: D20Effect, value: number })}
 * @property addProficiency {function({ proficiency: string })}
 * @property equipItem {function({ item: object, slot: string })}
 * @property setAbility {function({ ability: string, value: number })}
 * @property setSelectedWeapon {function({ slot: string })}
 * @property clearTarget {function}
 * @property clearAggressor {function}
 * @property updateTargetConditions {function({ [id]: number, conditions: Set|[] })}
 * @property updateAggressorConditions {function({ [id]: number, conditions: Set|[] })}
 * @property setEncumbrance {function({ value: number })}
 * @property setAreaFlags {function({ flags: string[] })}
 * @property addFeat {function({ feat: string })}
 * @property updateFeatEffects {function()}
 * @property dispellEffect {function({ effect })}
 * @property setGaugeDamage {function({ value })}
 * @property heal {function({ amount })}
 * @property setTargetDistance {function({ value })}
 * @property setSize {function({ value })}
 * @property setSpecie {function({ value })}
 * @property setSpeed {function({ value })}
 * @property setId {function({ value })}
 * @property importCreatureState {function({ state })}
 * @property dispellEffectFromCreature {function({ creature })}
 * @property setCounterValue {function({ counter, value, max })}
 */