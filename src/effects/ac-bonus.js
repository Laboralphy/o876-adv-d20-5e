const createEffect = require('./abstract')

function create ({ value }) {
    return createEffect('ac-bonus', value)
}

module.exports = {
    create
}