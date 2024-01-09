class BinPacker {
    constructor () {
        this._bins = []
        this._invalid = true
    }

    get bins () {
        return this._bins
    }

    /**
     * Ajoute une corbeille d'une taille spécifique
     * @param size {number}
     */
    addBin (size) {
        if (size <= 0) {
            throw new Error('ERR_BIN_SIZE_INVALID')
        }
        const n = this._bins.length
        if (n > 31) {
            throw new Error('ERR_MAX_BIN_REACHED')
        }
        this._invalid = true
        this._bins.push({
            size,
            bitValue: 0,
            open: true,
            filled: 0
        })
    }

    /**
     * Ouverture, numérotage et vidage de toutes les corbeilles
     */
    resetBins () {
        if (this._invalid) {
            this.sortBins()
            this._invalid = false
        }
        this._bins.forEach((b, i) => {
            b.filled = 0
            b.open = true
            b.bitValue = 1 << i
        })
    }

    /**
     * Trie toutes les corbeilles
     */
    sortBins () {
        this._bins.sort((a, b) => b.size - a.size)
    }

    /**
     * Remplir toutes les corbeilles dans l'ordre.
     * Une corbeille ne peut être que soit totalement pleine soit totalement vide.
     *
     * @param n {number} quantité à remplir
     * @returns {number} restant non distribué
     */
    fillOpenBins (n) {
        for (let i = 0, l = this._bins.length; i < l; ++i) {
            const b = this._bins[i]
            if (b.open && n >= b.size) {
                b.filled = b.size
                n -= b.size
            }
            if (n === 0) {
                break
            }
        }
        return n
    }

    /**
     * Ouvre ou ferme les corbeilles en fonction du masque appliqué
     * @param n {number}
     */
    applyBinMask (n) {
        this._bins.forEach((b, i) => {
            const nBit = 1 << i
            b.open = (nBit & n) === 0
        })
    }

    /**
     * Find solution with current bin configuration
     * @param nVolume {number} volume to be filled in bins
     * @returns {{ optimal: boolean, solution: number, remain: number }}
     */

    findSolution (nVolume) {
        let i = 0
        let nMax = 1 << this._bins.length
        let iWithMinRemain = -1
        let nMinRemain = Infinity
        while (i < nMax) {
            const nRemain = this.applySpecificSolution(i, nVolume)
            if (nRemain === 0) {
                return {
                    optimal: true,
                    solution: i,
                    spent: nVolume,
                    remain: 0
                }
            } else {
                if (nRemain < nMinRemain) {
                    iWithMinRemain = i
                    nMinRemain = nRemain
                }
            }
            ++i
        }
        this.applySpecificSolution(iWithMinRemain, nVolume)
        return {
            optimal: false,
            solution: iWithMinRemain,
            spent: nVolume - nMinRemain,
            remain: nMinRemain
        }
    }

    applySpecificSolution (i, nVolume) {
        this.resetBins()
        this.applyBinMask(i)
        return this.fillOpenBins(nVolume)
    }

    reportSolution () {
        const aRegistry = []
        this._bins.forEach(b => {
            if (b.filled > 0) {
                let r = aRegistry.find(x => x.size === b.size)
                if (!r) {
                    r = { size: b.size, count: 0 }
                    aRegistry.push(r)
                }
                ++r.count
            }
        })
        return aRegistry
    }
}

module.exports = BinPacker