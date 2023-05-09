const EntityFactory = require('./EntityFactory')
const CONSTS = require('./consts')
const Events = require('events')
const Creature = require('./Creature')

class Rules {
    constructor () {
        this._ef = null
        this._events = new Events()
    }

    /**
     * Définition des handlers d'évènement pour une créature nouvellement créée
     * @param oCreature {Creature}
     * @private
     */
    _defineCreatureEventHandlers (oCreature) {
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

    /**
     * instance du gestionaire d'évènements
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
     * Initialisation de l'instance à faire dès l'instantiation
     */
    init () {
        const ef = new EntityFactory()
        ef.init()
        this._ef = ef
    }

    /**
     * Creation d'une entité (créature ou item)
     * @param sResRef {string}
     * @returns {Creature|D20Item}
     */
    createEntity (sResRef) {
        const oEntity = this._ef.createEntity(sResRef)
        if (oEntity instanceof Creature) {
            this._defineCreatureEventHandlers(oEntity)
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
     * Effectue une attaque physique melee ou distance contre la cible.
     * Si la cible n'est pas à portée l'attaque échoue
     * @param oAttacker {Creature}
     * @param [oTarget] {Creature}
     */
    attack (oAttacker, oTarget = undefined) {
        if (oTarget) {
            oAttacker.setTarget(oTarget)
        }
        const asg = oAttacker.store.getters
        const sBetterSlot = asg.getSuitableOffensiveSlot
        if (sBetterSlot !== '') {
            oAttacker.useOffensiveSlot(sBetterSlot)
            return oAttacker.doAttack()
        } else {
            return oAttacker.createDefaultAttackOutcome()
        }
    }

    getCreatureData (oCreature) {
        const actions = this
            .assetManager
            .blueprints[oCreature.ref]
            .actions
        return {
            actions
        }
    }
}

module.exports = Rules
