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
 * @param cheat {boolean}
 */
module.exports = ({
    spell,
    caster,
    target,
    power = 0,
    hostiles = [],
    friends = [],
    parameters = {},
    cheat = false
}) => {
    const oSpellCast = new SpellCast({
        caster,
        target,
        spell,
        power,
        hostiles,
        friends,
        cheat
    })
    return oSpellCast.cast(parameters)
}
