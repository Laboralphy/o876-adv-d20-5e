const CONSTS = require("./consts")
const AssetManager = require('./AssetManager')
const Creature = require('./Creature')

class EntityFactory {
    constructor () {
        this._am = null
    }

    init () {
        this.initAssetManager()
    }

    initAssetManager () {
        const am = new AssetManager()
        am.init()
        this._am = am
    }

    /**
     * creation d'une armure
     * @param oBlueprint
     * @returns {D20Item}
     */
    createItemArmor (oBlueprint) {
        const oArmorData = this._am.data[oBlueprint.armorType]
        return {
            ...oBlueprint,
            ...oArmorData,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        }
    }

    createItemShield (oBlueprint) {
        const oArmorData = this._am.data[oBlueprint.shieldType]
        return {
            ...oBlueprint,
            ...oArmorData,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD]
        }
    }

    createItemWeapon (oBlueprint) {
        const oWeaponData = this._am.data[oBlueprint.weaponType]
        const slot = oWeaponData.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
            ? CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
            : CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        return {
            ...oBlueprint,
            properties: [
                ...oBlueprint.properties
            ],
            ...oWeaponData,
            equipmentSlots: [slot]
        }
    }

    /**
     * creation d'un item
     * @param oBlueprint
     * @returns {D20Item}
     */
    createItem (oBlueprint) {
        switch (oBlueprint.itemType) {
            case CONSTS.ITEM_TYPE_ARMOR: {
                return this.createItemArmor(oBlueprint)
            }

            case CONSTS.ITEM_TYPE_WEAPON: {
                return this.createItemWeapon(oBlueprint)
            }

            case CONSTS.ITEM_TYPE_SHIELD: {
                return this.createItemShield(oBlueprint)
            }

            default: {
                throw new Error('ERR_ITEM_TYPE_NOT_SUPPORTED')
            }
        }
    }

    createCreature (oBlueprint) {
        const oCreature = new Creature()

    }

    createEntity (sResRef) {
        const oBlueprint = this._am.blueprints[sResRef]
        if (!oBlueprint) {
            throw new Error('ERR_BLUEPRINT_INVALID: ' + sResRef)
        }
        switch (oBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                return this.createItem(oBlueprint)
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                return this.createCreature(oBlueprint)
            }

            default: {
                throw new Error('ERR_ENTITY_TYPE_NOT_SUPPORTED')
            }
        }
    }
}

module.exports = EntityFactory
