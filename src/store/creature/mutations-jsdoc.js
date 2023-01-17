/**
 * @typedef D20CreatureStoreMutations {object}
 * @property addClass {function({ ref: string, levels: number })}
 * @property addEffect {function({ effect: object })}
 * @property removeEffect {function({ effect: object })}
 * @property addProficiency {function({ proficiency: string })}
 * @property equipItem {function({ item: object, slot: string })}
 * @property setAbility {function({ ability: string, value: number })}
 * @property setSelectedWeapon {function({ slot: string })}
 * @property clearTarget {function}
 * @property clearAggressor {function}
 * @property updateTargetConditions {function({ [id]: number, conditions: Set|[] })}
 * @property updateAggressorConditions {function({ [id]: number, conditions: Set|[] })}
 * */