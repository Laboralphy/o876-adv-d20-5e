const Rules = require('../src/Rules')
const CONSTS = require('../src/consts')

function main () {
    const r = new Rules()
    r.init()
    r.events.on('attack', ({
        creature,
        ac,
        distance,
        range,
        bonus,
        roll,
        critical,
        hit,
        dice,
        damages: {
            amount: damageAmount,
            types: damageTypes
        }
    }) => {
        if (range < distance) {
            console.log(
                creature.name, 'cannot attack', creature.getTarget().name, 'OUT OF RANGE'
            )
        } else {
            console.log(
                creature.name, 'attacks', creature.getTarget().name,
                dice, '+', bonus, '=', roll,
                'vs ac', ac,
                hit ? 'HIT' : 'MISS',
                critical ? 'CRITICAL' : ''
            )
            if (hit) {
                console.log(creature.getTarget().name, 'damage taken', damageAmount)
            }
        }
    })
    const c1 = r.createEntity('c-pilgrim')
    const c2 = r.createEntity('c-street-rogue')
    c1.setTarget(c2)
    c2.setTarget(c1)
    r.strike(c1)
}

main()
