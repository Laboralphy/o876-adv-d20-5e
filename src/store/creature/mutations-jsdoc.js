/**
 * @typedef D20CreatureStoreMutations {object}
 * @property addClass {function({ ref: string, levels: number })}
 * @property addEffect {function({ effect: object })}
 * @property addProficiency {function({ proficiency: string })}
 * @property equipItem {function({ item: object, slot: string })}
 * @property setAbility {function({ ability: string, value: number })}
 * @property setSelectedWeapon {function({ slot: string })}
 * @property setTarget {function({ target: Creature })}
 */