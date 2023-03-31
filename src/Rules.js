const EntityFactory = require('./EntityFactory')
const CONSTS = require('./consts')
const Events = require('events')

class Rules {
    constructor () {
        this._ef = null
        this._events = new Events()
    }

    get events () {
        return this._events
    }

    init () {
        const ef = new EntityFactory()
        ef.init()
        this._ef = ef
    }

    get assetManager () {
        return this._ef.assetManager
    }

    defineCreatureEventHandlers (oCreature) {
        const aEvents = ['attack', 'target-out-of-range', 'target-distance']
        aEvents.forEach(evName => {
            oCreature.events.on(evName, oPayload => {
                this._events.emit(evName, {
                    ...oPayload,
                    creature: oCreature
                })
            })
        })
    }

    createEntity (sResRef) {
        const oEntity = this._ef.createEntity(sResRef)
        console.log(oEntity)
        if (oEntity.type === CONSTS.ENTITY_TYPE_ACTOR) {
            this.defineCreatureEventHandlers(oEntity)
        }
        return oEntity
    }

    createInventoryItems (oCreature, oInventory) {
        for (const [sSlot, item] of Object.entries(oInventory)) {
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
     * Effectue une attaque de melee contre la cible.
     * Si la cible n'est pas à portée l'attaque échoue
     * @param oAttacker {Creature}
     */
    strike (oAttacker) {
        oAttacker.useOffensiveSlot(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        return oAttacker.doAttack()
    }

    shoot (oAttacker, oTarget) {
        oAttacker.useOffensiveSlot(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
        return oAttacker.doAttack()
    }
}

module.exports = Rules
