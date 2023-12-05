module.exports = ({ manager }) => {
    manager.creatureHandlers.add('spell-ranged-attack')
    manager.creatureHandlers.add('spellcast-concentration-end')
    manager.creatureHandlers.add('spellcast-concentration')
    manager.creatureHandlers.add('spellcast')
    manager.creatureHandlers.add('spellcast-at')
}