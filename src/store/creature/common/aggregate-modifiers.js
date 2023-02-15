function rollRandomItemProperties (aEffects) {
    let n = 0
    aEffects
        .forEach(f => {
            if (('random' in f) && f.random !== '') {
                n += this.roll(f.random)
            }
        })
    return n
}

function rollRandomEffects (aEffects) {
    return rollRandomItemProperties(aEffects.map(f => f.data || {}))
}


/**
 * Aggrège les effets spécifiés dans la liste, selon un prédicat
 * @param aTags {string[]} liste des effets désirés
 * @param getters {D20CreatureStoreGetters}
 * @param effectFilter {function}
 * @param effectAmpMapper {function}
 * @param effectDisc {function}
 * @param propFilter {function}
 * @param propAmpMapper {function}
 * @param propDisc {function}
 * @returns {{sorter: {Object}, max: number, sum: number}}
 */
function aggregateModifiers (aTags, getters, {
    effectFilter = null,
    propFilter = null,
    effectAmpMapper = null,
    propAmpMapper = null,
    effectDisc = null,
    propDisc = null
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
        .map(eff => ({
            ...eff,
            amp: effectAmpMapper ? effectAmpMapper(eff) : eff.amp
        }))
    const aFilteredItemProperties = getters
        .getEquipmentItemProperties
        .filter(ip =>
            aTypeSet.has(ip.property) &&
            (propFilter ? propFilter(ip) : true)
        )
        .map(prop => ({
            ...prop,
            amp: propAmpMapper ? propAmpMapper(prop) : prop.amp
        }))
    const oSorter = {}
    const rdisc = sDisc => {
        if (!(sDisc in oSorter)) {
            oSorter[sDisc] = {
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
            if (typeof amp !== 'number') {
                throw TypeError('Effect amp has not been properly evaluated')
            }
            sd.max = Math.max(sd.max, amp)
            sd.sum += amp
        })
    }
    if (propDisc) {
        aFilteredItemProperties.forEach(f => {
            const sDisc = propDisc(f)
            const sd = rdisc(sDisc)
            const amp = f.amp
            sd.max = Math.max(sd.max, amp)
            sd.sum += amp
        })
    }

    const nEffAcc = aFilteredEffects.reduce((prev, curr) => prev + curr.amp, 0)
    const nEffMax = aFilteredEffects.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
    const nIPAcc = aFilteredItemProperties.reduce((prev, curr) => prev + curr.amp, 0)
    const nIPMax = aFilteredItemProperties.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
    return {
        sum: nEffAcc + nIPAcc,
        max: Math.max(nEffMax, nIPMax),
        sorter: oSorter
    }
}

module.exports = {
    aggregateModifiers
}