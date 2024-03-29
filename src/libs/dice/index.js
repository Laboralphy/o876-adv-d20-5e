const REGEX_XDY = /^([-+]?) *(\d+) *d *(\d+) *(([-+]) *(\d+))?$/

class Dice {
  constructor () {
    this._cachexdy = {}
  }

  /**
   * Permet de forcer un valeur random, utile pour les __tests__
   * @param value {number|boolean} nombre flottant forçant la sortie de la fonction random, false pour désactiver
   */
  cheat (value = 0) {
    const t = typeof value
    switch (t) {
      case 'undefined': {
        this._DEBUG = false
        break
      }
      case 'boolean': {
        this._DEBUG = value
        break
      }
      case 'number': {
        this._DEBUG = true
        this._FORCE_RANDOM_VALUE = Math.max(0, Math.min(1, value))
        break
      }
      default: {
        throw new Error('Dice cheat value is invalid (floating number 0..1 or boolean required')
      }
    }
  }

  /**
   * Fonction random
   * @returns {number} valeur flottante aléatoire entre 0 et 1
   */
  random () {
    return this._DEBUG ? this._FORCE_RANDOM_VALUE : Math.random()
  }

  /**
   * lance un ou plusieurs dés
   * @param nSides {number} nombre de face pour el dé
   * @param nCount {number} nombre de fois qu'il faut lancer le dé
   * @param nModifier {number} modificateur à ajouter au lancé
   * @returns {number} résultat
   */
  roll (nSides, nCount = 1, nModifier = 0) {
    if (nSides === 0 || nCount === 0) {
      return nModifier
    }
    let nAcc = 0
    if (nSides === 0) {
      return nModifier
    }
    if (nCount < 0) {
      return -this.roll(nSides, -nCount, nModifier)
    }
    for (let i = 0; i < nCount; ++i) {
      nAcc += Math.floor(this.random() * nSides) + 1
    }
    return nAcc + nModifier
  }

  /**
   * Analyse une expression de type xDy+z
   * @param value
   * @returns {{count: number, sides: number}}
   */
  xdy (value) {
    const bString = typeof value === 'string'
    if (bString && (value in this._cachexdy)) {
      return this._cachexdy[value]
    }
    if (bString && isNaN(value)) {
      const r = value.trim().match(REGEX_XDY)
      if (!r) {
        throw new Error('This dice formula is invalid : "' + value + '"')
      }
      const [, sCountSign, sCount, sSides, , sModifierSign, sModifier] = r
      const count = parseInt(sCount) * (sCountSign === '-' ? -1 : 1)
      const sides = parseInt(sSides)
      const modifier = sModifier === undefined
        ? 0
        : parseInt(sModifier) * (sModifierSign === '-' ? -1 : 1)
      if (r) {
        return this._cachexdy[value] = {
          sides,
          count,
          modifier
        }
      } else {
        throw new Error('This formula does not compute : "' + value + '". Expected format is xDy+z where x, y and z are numbers (x and z may be negative)')
      }
    }
    const nModifier = parseInt(value)
    if (isNaN(nModifier)) {
      throw new Error('an error occured while evaluating "' + value + '"')
    }
    return this._cachexdy[value] = {
      sides: 0,
      count: 0,
      modifier: parseInt(value)
    }
  }

  /**
   * Evalue une expression du type xDy+z
   * @param value {number|string|object}
   * @return {number}
   */
  evaluate (value) {
    const t = typeof value
    if (t === 'number') {
      return value
    } else if (t === 'object') {
      const { sides, count, modifier } = value
      return this.roll(sides, count, modifier)
    } else {
      return this.evaluate(this.xdy(value))
    }
  }
}

module.exports = Dice
