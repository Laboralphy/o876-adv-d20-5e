const Manager = require('../src/Manager')

function main () {
        const r = new Manager()
        r.config.setModuleActive('classic', true)
        r.init()
        const aSoldiers = []
        let aCombats = []
        const times = []
        const nSoldierCount = 0

        const createCombat = () => {
            const s1 = r.createEntity('c-soldier')
            const s2 = r.createEntity('c-soldier')
            aSoldiers.push(s1)
            aSoldiers.push(s2)
            s1.setTarget(s2)
            s2.setTarget(s1)
            aCombats.push({
                fighter: s1,
                target: s2
            })
            aCombats.push({
                fighter: s2,
                target: s1
            })
        }

        const playCombats = () => {
            const t1 = Date.now()
            aCombats.forEach(({ fighter, target }) => {
                if (fighter.store.getters.getHitPoints > 0 && target.store.getters.getHitPoints > 0) {
                    fighter.attack(target)
                }
                if (fighter.store.getters.getHitPoints <= 0 && target.store.getters.getHitPoints <= 0) {
                    aCombats = aCombats.filter(c => c.fighter === fighter || c.target === target)
                }
                // target.store.mutations.heal({ amount: Infinity })
                // fighter.store.mutations.heal({ amount: Infinity })
            })
            const t2 = Date.now()
            return t2 - t1
        }

        for (let i = 0; i < nSoldierCount; ++i) {
            createCombat()
        }

        for (let i = 0; i < 250; ++i) {
            const nMoreCombat = 1 // 10 + (i % 5)
            for (let n = 0; n < nMoreCombat; ++n) {
                createCombat()
            }
            times.push({ combat: aCombats.length, time: playCombats() })
        }
        times.forEach(x => console.log(x))
}
 main()