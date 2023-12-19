const BinPacker = require('../../../../libs/bin-packer')

module.exports = function (caster) {
    const cg = caster.store.getters
    const nLevel = cg.getLevelByClass['wizard']
    const nHalfLevelRoundedUp = Math.ceil(nLevel / 2)
    const b = new BinPacker()
    // Déterminer les slot utilisé
    const ss = cg.getSpellSlotStatus
    for (let i = 1, l = ss.length; i < l; ++i) {
        const { used } = ss[i]
        if (used > 0) {
            b.addBin(i)
        }
    }
    const { optimal, remain } = b.findSolution(nHalfLevelRoundedUp)
    const r = b.reportSolution()
    caster.events.emit('spell-slot-restore', {
        optimal,
        remain,
        restored: r.map(({ size, count }) => ({ level: size, count }))
    })
    r.forEach(({ size, count }) => {
        caster.store.mutations.restoreSpellSlot({ level: size, count })
    })
}
