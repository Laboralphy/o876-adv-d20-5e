const EntityFactory = require('./EntityFactory')

class Rules {
    constructor () {
        this._ef = null
    }

    init () {
        const ef = new EntityFactory()
        ef.init()
        this._ef = ef
    }

    createEntity (sResRef) {
        return this._ef.createEntity(sResRef)
    }
}

module.exports = Rules
