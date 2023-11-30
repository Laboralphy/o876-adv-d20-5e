const Creature = require('../../../Creature')
const SpellCast = require('../common/SpellCast')

/**
 * @param spell {string}
 * @param caster {Creature}
 * @param target {Creature}
 * @param power {number}
 * @param hostiles {Creature[]}
 * @param friends {Creature[]}
 * @param parameters {{}}
 */
module.exports = ({
    spell,
    caster,
    power = 0,
    hostiles = [],
    friends = [],
    parameters = {},
    cheat = false
}) => {
    const oSpellCast = new SpellCast({
        caster,
        spell,
        power,
        hostiles,
        friends,
        cheat
    })
    return oSpellCast.cast(parameters)
}
