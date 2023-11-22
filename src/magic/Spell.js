module.exports = class Spell {
    /**
     *
     * @param id {string} identifiant du sort
     * @param name {string} nom affichable du sort, et qui sert de désignation par les utilisateurs
     * @param level {number} niveau du sort
     * @param [ritual] {boolean} indique que le sort est un rituel, utilisable sans préparation (par defaut : false)
     * @param [concentration] {boolean} indique que le sort doit être maintenu en concentration, ne pas être interrompu
     * par des dégâts, un seul sort par concentration peut être maintenu à la fois
     */
    constructor ({ id, name, level, ritual = false, concentration = false }) {
        this._id = id
        this._name = name
        this._level = level
        this._ritual = ritual
        this._concentration = concentration
    }

    /**
     * renvoie l'identifiant du sort
     * @returns {string}
     */
    get id () {
        return this._id
    }

    /**
     * Renvoie le nom affichable du sort
     * @returns {string}
     */
    get name () {
        return this._name
    }

    /**
     *
     * @returns {*}
     */
    get level () {
        return this._level
    }

    get isCantrip () {
        return this._level < 1
    }

    get isRitual () {
        return this._ritual
    }

    get isConcentration () {
        return this._concentration
    }
}