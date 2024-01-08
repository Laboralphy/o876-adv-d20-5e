/**
 * Rend un objet immutable : toutes ses propriétés passent en lecture seule
 * L'opération est récursive.
 * @param o {object}
 * @returns {object}
 */
function deepFreeze (o) {
    if (Object.isFrozen(o)) {
        return o
    }
    Object.freeze(o)
    if (o === undefined) {
        return o
    }

    Object.getOwnPropertyNames(o).forEach(function (prop) {
        if (o[prop] !== null &&
            (typeof o[prop] === 'object' || typeof o[prop] === 'function')
        ) {
            deepFreeze(o[prop])
        }
    })
}

module.exports = deepFreeze
