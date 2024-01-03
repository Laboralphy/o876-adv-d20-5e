module.exports = ({ state }) => {
    const sb = state.data.spellbook
    for (let i = 0; i < 9; ++i) {
        sb.slots.splice(0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    }
    const ss = sb.signatureSpells
    for (let i = 0, l = ss.length; i < l; ++i) {
        ss[i].used = 0
    }
    sb.overchannelUses = 0
}