function alwaysTrue () {
    return true
}

function alwaysEmpty () {
    return ''
}

/**
 * Aggrège les effets spécifiés dans la liste, selon un prédicat
 * @param aTags {string[]} liste des effets désirés
 * @param getters {D20CreatureStoreGetters}
 * @param filters {Object} voir la fonction store/creature/common/aggregate-modifiers
 * @returns {{effects: D20Effect[], properties: object[], sorter: {Object}, max: number, sum: number}}
 */
function aggregateModifiers (aTags, getters, {
    effectFilter = alwaysTrue,
    propFilter = alwaysTrue,
    effectDisc = alwaysEmpty,
    propDisc = alwaysEmpty
} = {}) {
    const aTypeSet = new Set(
        Array.isArray(aTags)
            ? aTags
            : [aTags]
    )
    const aFilteredEffects = getters
        .getEffects
        .filter(eff =>
            aTypeSet.has(eff.type) &&
            (effectFilter ? effectFilter(eff) : true)
        )
    const aFilteredItemProperties = getters
        .getEquipmentItemProperties
        .filter(ip =>
            aTypeSet.has(ip.property) &&
            (propFilter ? propFilter(ip) : true)
        )
    const oSorter = {}
    const rdisc = sDisc => {
        if (!(sDisc in oSorter)) {
            oSorter[sDisc] = {
                properties: [],
                effects: [],
                sum: 0,
                max: 0
            }
        }
        return oSorter[sDisc]
    }
    if (effectDisc) {
        aFilteredEffects.forEach(f => {
            const sDisc = effectDisc(f)
            const sd = rdisc(sDisc)
            const amp = f.amp
            sd.effects.push(f)
            sd.max = Math.max(sd.max, amp)
            sd.sum += amp
        })
    }
    if (propDisc) {
        aFilteredItemProperties.forEach(f => {
            const sDisc = propDisc(f)
            const sd = rdisc(sDisc)
            const amp = f.amp
            sd.properties.push(f)
            sd.max = Math.max(sd.max, amp)
            sd.sum += amp
        })
    }

    const nEffAcc = aFilteredEffects.reduce((prev, curr) => prev + curr.amp, 0)
    const nEffMax = aFilteredEffects.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
    const nIPAcc = aFilteredItemProperties.reduce((prev, curr) => prev + curr.amp, 0)
    const nIPMax = aFilteredItemProperties.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
    return {
        effects: aFilteredEffects,
        properties: aFilteredItemProperties,
        sum: nEffAcc + nIPAcc,
        max: Math.max(nEffMax, nIPMax),
        sorter: oSorter
    }
}

module.exports = {
    aggregateModifiers
}