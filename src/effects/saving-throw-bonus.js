const createEffect = require('./abstract')
const CONSTS = require('../consts')

function create (value, sType) {
    return createEffect(CONSTS.EFFECT_SAVING_THROW_BONUS, value, { type: sType })
}

module.exports = {
    create
}