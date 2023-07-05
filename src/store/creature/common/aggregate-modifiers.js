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
 * @param effectSorter {function}
 * @param effectForEach {function}
 * @param propFilter {function}
 * @param propAmpMapper {function}
 * @param propSorter {function}
 * @param propForEach {function}
 * @returns {{sorter: {Object}, max: number, sum: number, count: number, effects: number, ip: number }}
 */
function aggregateModifiers (aTags, getters, {
    effectFilter = null,
    propFilter = null,
    effectAmpMapper = null,
    propAmpMapper = null,
    effectSorter = null,
    propSorter = null,
    effectForEach = null,
    propForEach = null
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
    if (effectForEach) {
        aFilteredEffects.forEach(effectForEach)
    }
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
    if (propForEach) {
        aFilteredItemProperties.forEach(propForEach)
    }
    const oSorter = {}
    const rdisc = sDisc => {
        if (typeof sDisc !== 'string') {
            throw new Error('invalid sorting key for aggregateModifiers prop/effect sorter "' + sDisc + '"')
        }
        if (!(sDisc in oSorter)) {
            oSorter[sDisc] = {
                sum: 0,
                max: 0,
                count: 0
            }
        }
        return oSorter[sDisc]
    }
    if (effectSorter) {
        aFilteredEffects.forEach(f => {
            const sDisc = effectSorter(f)
            const sd = rdisc(sDisc)
            const amp = f.amp
            if (typeof amp !== 'number') {
                throw TypeError('Effect amp has not been properly evaluated')
            }
            sd.max = Math.max(sd.max, amp)
            sd.sum += amp
            ++sd.count
        })
    }
    if (propSorter) {
        aFilteredItemProperties.forEach(f => {
            const sDisc = propSorter(f)
            const sd = rdisc(sDisc)
            const amp = f.amp || 0
            sd.max = Math.max(sd.max, amp)
            sd.sum += amp
            ++sd.count
        })
    }

    const nEffAcc = aFilteredEffects.reduce((prev, curr) => prev + curr.amp, 0)
    const nEffMax = aFilteredEffects.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
    const nIPAcc = aFilteredItemProperties.reduce((prev, curr) => prev + curr.amp, 0)
    const nIPMax = aFilteredItemProperties.reduce((prev, curr) => Math.max(prev, curr.amp), 0)
    return {
        sum: nEffAcc + nIPAcc,
        effects: nEffAcc,
        ip: nIPAcc,
        max: Math.max(nEffMax, nIPMax),
        count: aFilteredEffects.length + aFilteredItemProperties.length,
        sorter: oSorter
    }
}

module.exports = {
    aggregateModifiers
}