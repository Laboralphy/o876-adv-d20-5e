const CONSTS = require('../../../consts')

/**
 * Change l'ensemble des flags d'une pièce
 * @param state {*}
 * @param flags {string[]}
 */
module.exports = ({ state }, { flags }) => {
    const saf = state.areaFlags
    flags.forEach(flag => {
        if (!(flag.startsWith('AREA_FLAG_') && (flag in CONSTS))) {
            throw new Error('ERR_INVALID_AREA_FLAG: ' + flag)
        }
        if (!saf.includes(flag)) {
            saf.push(flag)
        }
    })
}
