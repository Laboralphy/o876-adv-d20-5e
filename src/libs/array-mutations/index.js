/**
 * Change la valeur d'un item d'un array en déclenchant les tracker de réactivité
 * @param a {[]}
 * @param i {number}
 * @param value {*}
 * @return {[]}
 */
function setItem (a, i, value) {
    a.splice(i, 1, value)
    return a
}

/**
 * Vide un array de tous ses éléments
 * @param a {[]}
 * @return {[]}
 */
function truncate (a) {
    a.splice(0, a.length)
    return a
}

/**
 * Renvoie la valeur d'un élément du tableau
 * @param a {[]}
 * @param i {number}
 */
function getItem (a, i) {
    return a.at(i)
}

/**
 * Supprime un élément du tableau
 * @param a {[]}
 * @param i {number} indice de l'élément à supprimer
 */
function removeItem (a, i) {
    a.splice(i, 1)
    return a
}

/**
 * Renvoie un clone (shallow) du tableau spécifié
 * @param a {[]}
 * @return {[]}
 */
function clone (a) {
    return a.slice(0)
}

/**
 * Change la valeur d'un élément du tableau
 * @param a {[]}
 * @param i {number}
 * @param f {function}
 */
function mutateItem (a, i, f) {
    setItem(a, i, f(getItem(a, i)))
    return a
}

module.exports = {
    setItem,
    getItem,
    truncate,
    removeItem,
    clone,
    mutateItem
}