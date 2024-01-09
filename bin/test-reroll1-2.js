const Dice = require('../src/libs/dice')
const dice = new Dice()

function rollDamage (sFormula, bApplyFeat) {
    const n = dice.evaluate(sFormula)
    if (bApplyFeat && n <= 2) {
        return dice.evaluate(sFormula)
    } else {
        return n
    }
}


class RollResult {
    constructor(props) {
        this._rolls = []
    }

    pushRoll (n) {
        this.rolls.push(n)
    }

    get rolls () {
        return this._rolls
    }

    get sum () {
        return this.rolls.reduce((prev, curr) => prev + curr, 0)
    }

    get count () {
        return this.rolls.length
    }

    get avg () {
        return Math.round(this.sum / this.count)
    }

    get result () {
        return {
            sum: this.sum,
            avg: this.avg
        }
    }
}

function getAverageDamage(sDamage) {
    const result = {
        withFeat: new RollResult(),
        withoutFeat: new RollResult()
    }
    for (let i = 0; i < 100000; ++i) {
        result.withoutFeat.pushRoll(rollDamage(sDamage, false))
        result.withFeat.pushRoll(rollDamage(sDamage, true))
    }
    return {
        withoutFeat: result.withoutFeat.result,
        withFeat: result.withFeat.result
    }
}

function runWeapons(aWeapons) {
    aWeapons.forEach(({ label, damage }) => {
        console.group(label + ':' + damage)
        const a = getAverageDamage(damage)
        console.log(a.withFeat.avg - a.withoutFeat.avg, 'more with feat')
        console.groupEnd()
    })
}

runWeapons([
    { label: 'great club / quarterstaff / spear', damage: '1d8' },
    { label: 'battle axe / glaive / halberd', damage: '1d10' },
    { label: 'great axe / sword', damage: '1d12' },
    { label: 'maul', damage: '2d6' }
])