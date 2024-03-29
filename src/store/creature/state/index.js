const CONSTS = require('../../../consts')

module.exports = function () {
    return {
        id: '',
        ref: '',
        abilities: {
            [CONSTS.ABILITY_STRENGTH]: 0,
            [CONSTS.ABILITY_DEXTERITY]: 0,
            [CONSTS.ABILITY_CONSTITUTION]: 0,
            [CONSTS.ABILITY_INTELLIGENCE]: 0,
            [CONSTS.ABILITY_WISDOM]: 0,
            [CONSTS.ABILITY_CHARISMA]: 0
        },
        equipment: {
            [CONSTS.EQUIPMENT_SLOT_HEAD]: null,
            [CONSTS.EQUIPMENT_SLOT_NECK]: null,
            [CONSTS.EQUIPMENT_SLOT_CHEST]: null,
            [CONSTS.EQUIPMENT_SLOT_BACK]: null,
            [CONSTS.EQUIPMENT_SLOT_ARMS]: null,
            [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: null,
            [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: null,
            [CONSTS.EQUIPMENT_SLOT_SHIELD]: null,
            [CONSTS.EQUIPMENT_SLOT_LEFT_FINGER]: null,
            [CONSTS.EQUIPMENT_SLOT_RIGHT_FINGER]: null,
            [CONSTS.EQUIPMENT_SLOT_AMMO]: null,
            [CONSTS.EQUIPMENT_SLOT_WAIST]: null,
            [CONSTS.EQUIPMENT_SLOT_FEET]: null,
            [CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR]: null,
            [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON]: null
        },
        alignment: {
            entropy: 0,
            morality: 0
        },
        specie: CONSTS.SPECIE_HUMANOID,
        size: CONSTS.CREATURE_SIZE_MEDIUM,
        offensiveSlot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
        proficiencies: [],
        speed: 0,
        effects: [],
        classes: [],
        gauges: {
            damage: 0
        },
        recentDamageTypes: {
        },
        target: {
            id: '',
            active: false,
            conditions: {},
            effects: [],
            itemProperties: [],
            distance: 0
        },
        aggressor: {
            id: '',
            active: false,
            conditions: {},
            effects: [],
            itemProperties: []
        },
        action: '',
        encumbrance: 0,
        areaFlags: [],
        feats: [],
        counters: {
            extraAttacks: {
                value: 0
            }
        },
        data: {}
    }
}
