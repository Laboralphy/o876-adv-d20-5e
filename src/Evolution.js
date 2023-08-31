class Evolution {
    constructor () {
        this._data = null
    }

    set data (value) {
        this._data = value
    }

    get data () {
        return this._data
    }

    /**
     * Ajoute un niveau de classe à la créature spécifiée
     * @param oCreature {Creature}
     * @param sClass {string}
     */
    addLevel (oCreature, sClass) {
        const oClasses = oCreature.store.getLevelByClass
        if (!(sClass in oClasses)) {

        }
    }
}