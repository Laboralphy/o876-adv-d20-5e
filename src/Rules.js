const EntityFactory = require('./EntityFactory')
const CONSTS = require('./consts')

class Rules {
    constructor () {
        this._ef = null
    }

    init () {
        const ef = new EntityFactory()
        ef.init()
        this._ef = ef
    }

    get assetManager () {
        return this._ef.assetManager
    }

    log (...args) {
        console.log(...args)
    }

    defineCreatureEventHandlers (oCreature) {
        oCreature.events.on('attack', ({ attack, attacker, attacked }) => {
            const oWeapon = attacker.store.getters.getSelectedWeapon
            const oAmmo = attacker.store.getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_AMMO]
            this.log('%s attacks %s with %s', attacker.name, attacked.name, oWeapon.weaponType)
        })
    }

    createEntity (sResRef) {
        const oEntity = this._ef.createEntity(sResRef)
        if (oEntity.type === CONSTS.ENTITY_TYPE_ACTOR) {
            this.defineCreatureEventHandlers(oEntity)
        }
        return oEntity
    }

    createInventory (oCreature, oInventory) {
        const oDef = {
            resref: '',
            classes: []
            inventory
        }
        for (const [sSlot, item] of Object.entries(oInventory)) {
            if (typeof item === 'string') {
                const oItem = this.createEntity(item)
                oCreature.equipItem(oItem)
            } else {
                const oItem = this.createEntity(item.blueprint)

            }
        }
    }

    /**
     * Effectue une attaque de melee contre la cible.
     * Si la cible n'est pas à portée l'attaque échoue
     * @param oAttacker {Creature}
     * @param oTarget {Creature}
     */
    strike (oAttacker, oTarget) {
        oAttacker.useOffensiveSlot(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE)
        oAttacker.setTarget(oTarget)
        oAttacker.doAttack()
    }

    shoot (oAttacker, oTarget) {
        oAttacker.useOffensiveSlot(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
        oAttacker.setTarget(oTarget)
        oAttacker.doAttack()
    }
}

module.exports = Rules
