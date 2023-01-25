/**
 * @typedef D20CreatureStoreMutations {object}
 * @property addClass {function({ ref: string, levels: number })}
 * @property addEffect {function({ effect: D20Effect })}
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
 * */