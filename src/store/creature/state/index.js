const CONSTS = require('../../../consts')

module.exports = function () {
    return {
        id: 0,
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
        properties: [],
        classes: [],
        gauges: {
            damage: 0
        },
        target: {
            id: 0,
            active: false,
            conditions: {}
        },
        aggressor: {
            id: 0,
            active: false,
            conditions: {}
        },
        action: '',
        encumbrance: 0,
        areaFlags: [],
        feats: [],
        skills: []
    }
}
