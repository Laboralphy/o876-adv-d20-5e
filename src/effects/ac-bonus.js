const createEffect = require('./abstract')
const CONSTS = require('../consts')

function create (value) {
    return createEffect(CONSTS.EFFECT_AC_BONUS, value)
}

module.exports = {
    create
}