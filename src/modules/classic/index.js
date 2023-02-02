function creatureCreated (oCreature) {
    // Que se passe-t-il lorsqu'une créature spawn

}

function creatureEquipmentChanged (oCreature) {

}

function init (rules) {
    rules.events.on('creature.create', ({ creature }) => creatureCreated(creature))
}
