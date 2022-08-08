const CONSTS = require("./consts")
const deepClone = require('../libs/deep-clone')
const deepFreeze = require('../libs/deep-freeze')
const AssetManager = require('./AssetManager')

/**
 * @typedef D20ArmorData {object}
 * @property proficiency {string}
 * @property ac {number}
 * @property maxDexterityModifier {false|number}
 * @property minStrengthRequired {number}
 * @property disadvantageStealth {boolean}
 * @property weight {number}
 * @property equipmentSlots {string}
 *
 * @typedef D20WeaponData {object}
 * @property damage {string}
 * @property damageType {string}
 * @property attributes {string[]}
 * @property proficiency {string}
 * @property weight {number}
 * @property equipmentSlots {string}
 *
 * @typedef D20Item {object}
 * @property entityType {string}
 * @property itemType {string}
 * @property [armorType] {string}
 * @property [weaponType] {string}
 * @property properties {[]}
 * @property data {D20ArmorData|D20WeaponData}
 */

class EntityFactory {
    constructor () {
        this._am = new AssetManager()
        this._am.load()
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

    createItemWeapon (oBlueprint) {
        const oWeaponData = this._am.data[oBlueprint.weaponType]
        const slot = oWeaponData.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
            ? CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
            : CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        return {
            ...oBlueprint,
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

            default: {
                throw new Error('ERR_ITEM_TYPE_NOT_SUPPORTED')
            }
        }
    }

    createEntity (sResRef) {
        const oBlueprint = this._am.blueprints[sResRef]
        switch (oBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                return this.createItem(oBlueprint)
            }

            default: {
                throw new Error('ERR_ENTITY_TYPE_NOT_SUPPORTED')
            }
        }
    }
}

module.exports = EntityFactory
