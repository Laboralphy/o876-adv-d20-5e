const createEffect = require('./abstract')
const CONSTS = require('../consts')

function create (value) {
    return createEffect(CONSTS.EFFECT_SPEED_BONUS, value)
}

module.exports = {
    create
}