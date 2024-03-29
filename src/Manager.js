const EntityFactory = require('./EntityFactory')
const CONSTS = require('./consts')
const Events = require('events')
const Creature = require('./Creature')
const itemProperties = require('./item-properties')
const { Config } = require('./config')

class Manager {
    constructor () {
        this._ef = null
        this._events = new Events()
        this._creatureHandlers = new Set([
            'death',
            'attack',
            'action',
            'target-distance',
            'saving-throw',
            'check-skill',
            'damaged',
            'offensive-slot',
            'effect-applied',
            'sneak-attack',
            'despawn'
        ])
        this._config = null
    }

    get entityFactory () {
        return this._ef
    }

    get creatureHandlers () {
        return this._creatureHandlers
    }

    get config () {
        if (this._config === null) {
            this._config = new Config()
        }
        return this._config
    }

    /**
     * Définition des handlers d'évènement pour une créature nouvellement créée
     * @param oCreature {Creature}
     * @private
     */
    _defineCreatureEventHandlers (oCreature) {
        this
            .creatureHandlers
            .forEach(evName => {
                oCreature.events.on(evName, oPayload => {
                    this._events.emit(evName, {
                        ...oPayload,
                        creature: oCreature
                    })
                })
            })
    }

    /**
     * instance du gestionnaire d'évènements
     * @returns {module:events.EventEmitter}
     */
    get events () {
        return this._events
    }

    /**
     * Instance de l'asset manager
     * @returns {AssetManager}
     */
    get assetManager () {
        return this._ef.assetManager
    }

    /**
     * Lance le script init d'un module
     * @param id {string} identifiant du module
     */
    runModuleInitScript (id) {
        const sInitScript = id + '.init'
        if (sInitScript in this.assetManager.scripts) {
            this.assetManager.scripts[sInitScript]({
                manager: this
            })
        }
    }

    /**
     * Initialisation de l'instance à faire dès l'instantiation
     */
    init () {
        const ef = new EntityFactory()
        ef.init(this.config)
        this._ef = ef
        // Lancement des inits de chaque module
        this
            .config
            .modules
            .filter(m => m.active)
            .map(m => m.id)
            .forEach(id => {
                this.runModuleInitScript(id)
            })
        return this
    }

    /**
     * Creation d'une entité (créature ou item)
     * @param sResRef {string}
     * @returns {Creature|D20Item}
     */
    createEntity (sResRef = '') {
        const oEntity = !sResRef ? this._ef.createCreature(null) : this._ef.createEntity(sResRef)
        if (oEntity instanceof Creature) {
            this._defineCreatureEventHandlers(oEntity)
        }
        return oEntity
    }

    /**
     * Importation de données visant à restorer l'état d'une créature
     * La nouvelle créature est créée, puis son état est restoré
     * @param data
     * @returns {Creature|*}
     */
    importCreature (data) {
        const oCreature = this._ef.importCreature(data)
        this._defineCreatureEventHandlers(oCreature)
        return oCreature
    }

    /**
     * Sauvegarde des données d'une créature en vue d'une ré-importation ultérieure
     * @param oCreature
     * @returns {*}
     */
    exportCreature (oCreature) {
        return this._ef.exportCreature(oCreature)
    }

    createInventoryItems (oCreature, oInventory) {
        for (const [, item] of Object.entries(oInventory)) {
            if (typeof item === 'string') {
                const oItem = this.createEntity(item)
                oCreature.equipItem(oItem)
            } else if (typeof item === 'object') {
                const { slot = '', ref } = item
                const oItem = this.createEntity(ref)
                oCreature.equipItem(oItem, slot)
            }
        }
    }

    /**
     * Ajoute une propriété d'item, à un item
     * @param oItem {D20ItemDataStruct}
     * @param sItemProperty {string}
     * @param data {{}}
     * @returns {{}}
     */
    addItemProperty (oItem, sItemProperty, data) {
        const ip = itemProperties[sItemProperty](data)
        oItem.properties.push(ip)
        return ip
    }

    /**
     * @typedef D20ItemDataStruct {object}
     * @property type {string}
     * @property ref {string}
     * @property material {string}
     * @property weight {number}
     * @property damage {{type: string, value: (string|number), versatile: (string|number)}}
     * @property proficiency {string}
     * @property properties {{ property: string, amp: (number|string) }[]}
     *
     * @param oItem {D20Item}
     * @returns {D20ItemDataStruct}
     * @private
     */
    _getItemData (oItem) {
        return {
            type: oItem.itemType,
            ref: oItem.ref,
            material: oItem.material,
            weight: oItem.weight,
            damage: {
                value: oItem.damage,
                type: oItem.damageType,
                versatile: oItem.versatileDamage
            },
            proficiency: oItem.proficiency,
            properties: oItem.properties.map(p => ({
                property: p.property,
                amp: p.amp || 0,
                ...p.data
            }))
        }
    }

    /**
     * @typedef D20AbilityDetails {object}
     * @property base {number}
     * @property value {number}
     * @property bonus {number}
     * @property modifier {number}
     *
     * @typedef D20AbilityDetailRegistry {object}
     * @property ABILITY_STRENGTH {D20AbilityDetails}
     * @property ABILITY_DEXTERITY {D20AbilityDetails}
     * @property ABILITY_CONSTITUTION {D20AbilityDetails}
     * @property ABILITY_INTELLIGENCE {D20AbilityDetails}
     * @property ABILITY_WISDOM {D20AbilityDetails}
     * @property ABILITY_CHARISMA {D20AbilityDetails}
     *
     * @property D20ArmorClassDataDetail {object}
     * @property armor {number}
     * @property shield {number}
     * @property dexterity {number}
     * @property props {number}
     * @property effects {number}
     *
     * @typedef D20EffectDetailRegistry {object}
     * @property EFFECT_SUBTYPE_FEAT {Object<string, number>}
     * @property EFFECT_SUBTYPE_CURSE {Object<string, number>}
     * @property EFFECT_SUBTYPE_BLESSING {Object<string, number>}
     * @property EFFECT_SUBTYPE_EXTRAORDINARY {Object<string, number>}
     * @property EFFECT_SUBTYPE_MAGICAL {Object<string, number>}
     * @property EFFECT_SUBTYPE_WEAPON {Object<string, number>}
     *
     * @typedef D20CreatureDataStruct {object}
     * @property ref {string}
     * @property name {string}
     * @property actions {string[]}
     * @property equipment {Object<string, D20ItemDataStruct|null>}
     * @property ac {{ value: number, details: D20ArmorClassDataDetail }}
     * @property abilities {D20AbilityDetailRegistry}
     * @property effects {D20EffectDetailRegistry}
     * @property hp {{ value: number, max: number }}
     * @property specie {string}
     * @property size {string}
     * @property classes {string[]}
     * @property level {{ value: number, classes: Object<string, number>}}
     *
     * @param oCreature {Creature}
     * @returns {D20CreatureDataStruct}
     * @private
     */
    _getCreatureData (oCreature) {
        const actions = this
            .assetManager
            .blueprints[oCreature.ref]
            .actions || []
        const equipment = {}
        for (const [slot, item] of Object.entries(oCreature.store.getters.getEquippedItems)) {
            equipment[slot] = item ? this._getItemData(item) : null
        }
        const abilities = {}
        const aAbilityBonus = oCreature.store.getters.getAbilityBonus
        const aAbilityModifiers = oCreature.store.getters.getAbilityModifiers
        const aAbilityBaseValues = oCreature.store.getters.getAbilityBaseValues
        for (const ab of oCreature.store.getters.getAbilityList) {
            abilities[ab] = {
                base: aAbilityBaseValues[ab],
                bonus: aAbilityBonus[ab],
                value: aAbilityBaseValues[ab] + aAbilityBonus[ab],
                modifier: aAbilityModifiers[ab],
            }
        }
        const effects = {}
        for (const { type: sType, duration, subtype } of oCreature.store.getters.getEffects) {
            if (!(subtype in effects)) {
                effects[subtype] = {}
            }
            const effectsSubs = effects[subtype]
            if (sType in effectsSubs) {
                effectsSubs[sType] = Math.max(effectsSubs[sType], duration)
            } else {
                effectsSubs[sType] = duration
            }
        }
        return {
            ref: oCreature.ref,
            name: oCreature.name,
            actions,
            equipment,
            ac: {
                value: oCreature.store.getters.getArmorClass,
                details: oCreature.store.getters.getArmorClassDetails
            },
            abilities,
            effects,
            hp: {
                max: oCreature.store.getters.getMaxHitPoints,
                value: oCreature.store.getters.getHitPoints
            },
            specie: oCreature.store.getters.getSpecie,
            size: oCreature.store.getters.getSize,
            classes: Object
                .entries(oCreature.store.getters.getLevelByClass)
                .sort((a, b) => b[1] - a[1])
                .map(([sClass]) => sClass),
            level: {
                value: oCreature.store.getters.getLevel,
                classes: oCreature.store.getters.getLevelByClass
            }
        }
    }

    /**
     *
     * @param oEntity {D20Item|Creature}
     * @returns {D20CreatureDataStruct|D20ItemDataStruct}
     */
    getData (oEntity) {
        switch (oEntity.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                return this._getItemData(oEntity)
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                return this._getCreatureData(oEntity)
            }

            default: {
                throw new Error('Invalid entity (type: ' + oEntity.entityType + ')')
            }
        }
    }
}

module.exports = Manager
