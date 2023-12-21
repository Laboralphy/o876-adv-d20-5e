module.exports = {
    data: {
        spellbook: {
            knownSpells: [], // sorts connus (copiés dans le livre de sorts)
            preparedSpells: [], // sorts préparés (mémorisés)
            preparedCantrips: [], // tours de magie préparés
            slots: [0, 0, 0, 0, 0, 0, 0, 0, 0], // Emplacement de sorts (permet de lancer les sorts)
            masteredSpells: ['', ''], // Sorts maîtrisés. Doivent être préparés, mais ne nécessitent pas de dépenser des slots
            signatureSpells: [] // Sorts de prédilection { spell: string, used: boolean }
        }
    }
}