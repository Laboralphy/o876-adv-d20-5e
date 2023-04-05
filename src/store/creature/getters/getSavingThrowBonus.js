const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')
const { ampMapper } = require('../common/amp-mapper')

const ABILITY_PROFICIENCIES = {
    [CONSTS.ABILITY_STRENGTH]: CONSTS.PROFICIENCY_SAVING_THROW_STRENGTH,
    [CONSTS.ABILITY_DEXTERITY]: CONSTS.PROFICIENCY_SAVING_THROW_DEXTERITY,
    [CONSTS.ABILITY_CONSTITUTION]: CONSTS.PROFICIENCY_SAVING_THROW_CONSTITUTION,
    [CONSTS.ABILITY_INTELLIGENCE]: CONSTS.PROFICIENCY_SAVING_THROW_INTELLIGENCE,
    [CONSTS.ABILITY_WISDOM]: CONSTS.PROFICIENCY_SAVING_THROW_WISDOM,
    [CONSTS.ABILITY_CHARISMA]: CONSTS.PROFICIENCY_SAVING_THROW_CHARISMA
}

/**
 * liste des bonus de jet de sauvegarde
 * @param state
 * @param getters
 * @return {{}}
 */
module.exports = (state, getters) => {
    const prof = new Set(getters.getProficiencies)
    const profBonus = getters.getProficiencyBonus
    const ab = getters.getAbilityModifiers

    const ag = aggregateModifiers(
        [CONSTS.EFFECT_SAVING_THROW_BONUS],
        getters,
        {
            effectAmpMapper: eff => ampMapper(eff.amp, getters),
            propAmpMapper: prop => ampMapper(prop.amp, getters),
            effectSorter: eff => eff.data.type,
            propSorter: prop => prop.type
        }
    )
    const ags = ag.sorter
    const result = {}

    const oSetKeys = new Set([
        ...Object.keys(ags),
        ...Object.keys(ab)
    ])

    const aKeys = [...oSetKeys]

    for (const s of aKeys) {
        const x1 = s in ags ? ags[s].sum : 0
        const x2 = s in ab ? ab[s] : 0
        const x3 = ((s in ABILITY_PROFICIENCIES) && prof.has(ABILITY_PROFICIENCIES[s])) ? profBonus : 0
        result[s] = x1 + x2 + x3
    }

    return result
}