module.exports = ({ state }, { spell }) => {
    const ss = state
        .data
        .spellbook
        .signatureSpells
        .find(sx => sx.spell === spell )
    if (ss) {
        ++ss.used
    }
}
