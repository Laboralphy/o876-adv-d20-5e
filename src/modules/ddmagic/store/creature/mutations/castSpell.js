const ddmagicCastSpell = require('../../../scripts/ddmagic-cast-spell')
const Creature = require('../../../../../Creature')

function castSpell (spell, power, caster, target, friends, hostiles, parameters) {
    if (!target) {
        // Pas de cible = self
        target = caster
    } else if (target instanceof Creature) {
        // ciblage d'une créature
    } else if (typeof target === 'string') {
        // Ciblage d'une direction
    } else {
        // Ciblage d'un truc qui n'est pas une créature ni une direction
        // Un item ?
    }
    return ddmagicCastSpell({
        spell,
        caster,
        target,
        power,
        hostiles,
        friends,
        parameters
    })
}

module.exports = ({ state, getters, externals }, { spell, power = 0}) => {
    const cs = getters.getCastableSpells
    const oSpellDB = externals.data['data-ddmagic-spell-database']
    if (spell in oSpellDB) {
        const oSpell = oSpellDB[spell]
        const nCastLevel = Math.min(9, oSpell.level + power)
        if (spell in cs) {
            if (cs[spell][nCastLevel]) {
                // on peut caster
            }
        }
    }
}