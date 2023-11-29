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
module.exports = ({ spell, caster, power = 0, hostiles = [], friends = [], parameters = {} }) => {
    const oSpellCast = new SpellCast({
        caster,
        spell,
        power,
        hostiles,
        friends,
        parameters
    })
    if (oSpellCast.isSpellAvailable) {
        const sScript = 'spell-' + spell
        const pScript = Creature.AssetManager.scripts[sScript]
        if (pScript) {
            oSpellCast.consumeSpellSlot()
            pScript(oSpellCast)
            return true
        } else {
            throw new Error('ERR_SPELL_SCRIPT_NOT_FOUND: ' + sScript)
        }
    } else {
        return false
    }
}
