const CONSTS = require("./consts")
const AssetManager = require('./AssetManager')
const Creature = require('./Creature')

class EntityFactory {
    constructor () {
        this._am = null
    }

    get assetManager () {
        return this._am
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

    createItemAmmo (oBlueprint) {
        const oAmmoData = this._am.data[oBlueprint.ammoType]
        return {
            ...oBlueprint,
            oAmmoData,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_AMMO]
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

            case CONSTS.ITEM_TYPE_AMMO: {
                return this.createItemAmmo(oBlueprint)
            }

            default: {
                throw new Error('ERR_ITEM_TYPE_NOT_SUPPORTED')
            }
        }
    }

    /**
     * @typedef CreatureBlueprintAbilitiyDef {object}
     * @property strength {number}
     * @property dexterity {number}
     * @property constitution {number}
     * @property intelligence {number}
     * @property wisdom {number}
     * @property charisma {number}
     *
     * @typedef CreatureBlueprint {object}
     * @property [class] {string}
     * @property [level] {number}
     * @property classes {{ class: string, levels: number}[]}
     * @property abilities {CreatureBlueprintAbilityDef}
     * @property equipment {string[]}
     *
     * @param oBlueprint
     * @returns {Creature}
     */
    createCreature (oBlueprint) {
        const oCreature = new Creature()
        const csm = oCreature.store.mutations
        if ('class' in oBlueprint) {
            csm.addClass({ ref: oBlueprint.class, levels: oBlueprint.level })
        }
        if ('classes' in oBlueprint) {
            oBlueprint.classes.forEach(c => {
                csm.addClass({ ref: c.class, levels: c.level })
            })
        }
        const ba = oBlueprint.abilities
        csm.setAbility({ ability: CONSTS.ABILITY_STRENGTH, value: ba.strength })
        csm.setAbility({ ability: CONSTS.ABILITY_DEXTERITY, value: ba.dexterity })
        csm.setAbility({ ability: CONSTS.ABILITY_CONSTITUTION, value: ba.constitution })
        csm.setAbility({ ability: CONSTS.ABILITY_INTELLIGENCE, value: ba.intelligence })
        csm.setAbility({ ability: CONSTS.ABILITY_WISDOM, value: ba.wisdom })
        csm.setAbility({ ability: CONSTS.ABILITY_CHARISMA, value: ba.charisma })

        const bi = oBlueprint.equipment
        bi.forEach(e => {
            oCreature.equipItem(this.createEntity(e))
        })

        const sSizeConst = 'CREATURE_SIZE_' + (oBlueprint.size || 'medium').toUpperCase()
        if (sSizeConst in CONSTS) {
            csm.setSize({ value: sSizeConst })
        } else {
            throw new Error('ERR_INVALID_SIZE: ' + oBlueprint.size)
        }
        const sSpecieConst = 'SPECIE_' + oBlueprint.specie.toUpperCase()
        if (sSpecieConst in CONSTS) {
            csm.setSpecie({ value: sSpecieConst })
        } else {
            throw new Error('ERR_INVALID_SPECIE: ' + oBlueprint.specie)
        }
        return oCreature
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
