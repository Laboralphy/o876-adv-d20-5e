const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Renvoie la liste des proficiency de la creature
 * @return {string[]}
 */
module.exports = (state, getters, { data }) => {
    const aClasses = getters.getClassList
    const oClassProficiencies = new Set(
        aClasses
        .map((ref, i) => {
            const sClassName = 'class-' + ref
            if (sClassName in data) {
                const cr = data['class-' + ref]
                return (i !== 0 && 'multiclass' in cr)
                    ? (cr.multiclass.proficiencies || [])
                    : cr.proficiencies
            } else {
                throw new Error('this class has no defined data : ' + sClassName)
            }
        })
        .reduce((prev, curr) => prev.concat(curr), []))
    const aExtraProficiencies = new Set()
    aggregateModifiers([
        CONSTS.EFFECT_EXTRA_PROFICIENCY,
        CONSTS.ITEM_PROPERTY_EXTRA_PROFICIENCY
    ], getters, {
        effectForEach: eff => {
            aExtraProficiencies.add(eff.data.proficiency)
        },
        propForEach: prop => {
            aExtraProficiencies.add(prop.data.proficiency)
        }
    })
    return [...oClassProficiencies, ...state.proficiencies, aExtraProficiencies]
}
