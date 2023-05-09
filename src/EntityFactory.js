const CONSTS = require("./consts")
const { warmup, assetManager } = require('./assets')
const Creature = require('./Creature')

class EntityFactory {
    constructor () {
        this._am = assetManager
    }

    get assetManager () {
        return this._am
    }

    init () {
        warmup()
    }

    mixData(oBlueprint, oData, slots) {
        const properties = [
            ...oBlueprint.properties
        ]
        properties.forEach(p => {
            if (!('data' in p)) {
                p.data = {}
            }
        })
        const oBlueprintCopy = {
            ...oBlueprint
        }
        delete oBlueprintCopy.properties
        return {
            properties,
            ...oData,
            ...oBlueprintCopy,
            equipmentSlots: slots,
        }
    }

    /**
     * creation d'une armure
     * @param oBlueprint
     * @returns {D20Item}
     */
    createItemArmor (oBlueprint) {
        const oArmorData = this._am.data[oBlueprint.armorType]
        if (!oArmorData) {
            throw new Error('This armor blueprint is undefined : ' + oBlueprint.armorType)
        }
        return this.mixData(oBlueprint, oArmorData, [oBlueprint.itemType === CONSTS.ITEM_TYPE_NATURAL_ARMOR
            ? CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR
            : CONSTS.EQUIPMENT_SLOT_CHEST
        ])
    }

    createItemShield (oBlueprint) {
        const oShieldData = this._am.data[oBlueprint.shieldType]
        if (!oShieldData) {
            throw new Error('This shield blueprint is undefined : ' + oBlueprint.shieldType)
        }
        return this.mixData(oBlueprint, oShieldData, [CONSTS.EQUIPMENT_SLOT_SHIELD])
    }

    createItemWeapon (oBlueprint) {
        const oWeaponData = this._am.data[oBlueprint.weaponType]
        if (!oWeaponData) {
            throw new Error('This weapon blueprint is undefined : ' + oBlueprint.weaponType)
        }
        const slot = oWeaponData.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)
            ? CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
            : oBlueprint.itemType === CONSTS.ITEM_TYPE_NATURAL_WEAPON
                ? CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON
                : CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        return this.mixData(oBlueprint, oWeaponData, [slot])
    }

    createItemNaturalWeapon (oBlueprint) {
        const oWeaponData = this._am.data[oBlueprint.weaponType]
        if (!oWeaponData) {
            throw new Error('This natural weapon blueprint is undefined : ' + oBlueprint.weaponType)
        }
        return this.mixData(oBlueprint, oWeaponData, [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON])
    }

    createItemAmmo (oBlueprint) {
        const oAmmoData = this._am.data[oBlueprint.ammoType]
        if (!oAmmoData) {
            throw new Error('This ammo blueprint is undefined : ' + oBlueprint.ammoType)
        }
        return this.mixData(oBlueprint, oAmmoData, [CONSTS.EQUIPMENT_SLOT_AMMO])
    }

    /**
     * creation d'un item
     * @param oBlueprint
     * @returns {D20Item}
     */
    createItem (oBlueprint) {
        switch (oBlueprint.itemType) {
            case CONSTS.ITEM_TYPE_NATURAL_ARMOR:
            case CONSTS.ITEM_TYPE_ARMOR: {
                return this.createItemArmor(oBlueprint)
            }

            case CONSTS.ITEM_TYPE_NATURAL_WEAPON: {
                return this.createItemNaturalWeapon(oBlueprint)
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

        if (!oCreature.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON]) {
            const nw = this.createEntity('nwpn-unarmed-strike')
            oCreature.equipItem(nw, CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON)
        }

        if (!oCreature.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR]) {
            const nw = this.createEntity('narm-base-properties')
            oCreature.equipItem(nw, CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR)
        }

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
        csm.setSpeed({ value: oBlueprint.speed })
        return oCreature
    }

    createEntity (ref) {
        const bObj = typeof ref === 'object'
        const bStr = typeof ref === 'string'
        if (bObj) {
            this.assetManager.validateBlueprint(ref)
        }
        const oBlueprint = bStr
            ? this._am.blueprints[ref]
            : ref
        const sResRef = bStr ? ref : (oBlueprint.ref || '')
        if (!oBlueprint) {
            throw new Error('ERR_BLUEPRINT_INVALID: ' + sResRef)
        }
        switch (oBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                const oItem = this.createItem(oBlueprint)
                oItem.ref = sResRef
                return oItem
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                const oCreature = this.createCreature(oBlueprint)
                oCreature.ref = sResRef
                return oCreature
            }

            default: {
                throw new Error('ERR_ENTITY_TYPE_NOT_SUPPORTED')
            }
        }
    }
}

module.exports = EntityFactory
