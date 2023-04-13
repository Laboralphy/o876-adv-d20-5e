const EntityFactory = require('./EntityFactory')
const CONSTS = require('./consts')
const Events = require('events')
const Creature = require('./Creature')

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
        const aEvents = ['attack', 'action', 'target-distance', 'saving-throw', 'check-skill', 'damaged']
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
        if (oEntity instanceof Creature) {
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
    attack (oAttacker) {
        const asg = oAttacker.store.getters
        const sBetterSlot = asg.getSuitableOffensiveSlot
        if (sBetterSlot !== '') {
            oAttacker.useOffensiveSlot(sBetterSlot)
            return oAttacker.doAttack()
        } else {
            return oAttacker.createDefaultAttackOutcome()
        }
    }

    getCreatureActions (oCreature) {
        const aActions = this
            .assetManager
            .blueprints[oCreature.ref]
            .actions
        if (Array.isArray(aActions) && aActions.length === 0) {
            // on ne renvoie pas de tableau vide
            return undefined
        } else {
            return aActions
        }
    }

    /**
     * Déclenche une action
     * @param oCreature
     */
    action (oCreature) {
        const aActions = this.getCreatureActions(oCreature)
        if (aActions && aActions.length > 0) {
            const sAction = aActions[Math.floor(Math.random() * aActions.length)]
            oCreature.doAction(sAction)
        }
    }

    walkToTarget (oAttacker) {
        const nDistance = oAttacker.store.getters.getTargetDistance - oAttacker.store.getters.getSpeed
        oAttacker.setDistanceToTarget(nDistance)
    }
}

module.exports = Rules
