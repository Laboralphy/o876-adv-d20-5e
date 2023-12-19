const BinPacker = require('../libs/bin-packer')

describe('new', function () {
    it('should instanciate bin packer without error', function () {
        expect(() => new BinPacker()).not.toThrow()
    })
})

describe('addBin', function () {
    it('should have four bins when adding four bins', function () {
        const b = new BinPacker()
        expect(b.bins.length).toBe(0)
        b.addBin(1)
        b.addBin(1)
        b.addBin(1)
        b.addBin(1)
        expect(b.bins.length).toBe(4)
    })
    it('should throw error when adding 0 sized bin', function () {
        const b = new BinPacker()
        expect(() => {
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(0)
        }).toThrow(new Error('ERR_BIN_SIZE_INVALID'))
    })
    it('should throw error when adding too many bins', function () {
        const b = new BinPacker()
        expect(() => {
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
            b.addBin(1)
        }).toThrow(new Error('ERR_MAX_BIN_REACHED'))
    })
    it('should create well formatted bins when adding some', function () {
        const b = new BinPacker()
        b.addBin(1)
        expect(b.bins).toEqual([{
            size: 1,
            bitValue: 0,
            open: true,
            filled: 0
        }])
        b.addBin(1)
        b.addBin(2)
        expect(b.bins).toEqual([{
            size: 1,
            bitValue: 0,
            open: true,
            filled: 0
        }, {
            size: 1,
            bitValue: 0,
            open: true,
            filled: 0
        }, {
            size: 2,
            bitValue: 0,
            open: true,
            filled: 0
        }])
    })
})

describe('sortBins/resetBins', function () {
    it('should sort bin state when adding bin in random size', function () {
        const b = new BinPacker()
        b.addBin(1)
        b.addBin(2)
        b.addBin(5)
        b.addBin(4)
        b.addBin(3)
        expect(b.bins).toEqual([{
            size: 1,
            bitValue: 0,
            open: true,
            filled: 0
        }, {
            size: 2,
            bitValue: 0,
            open: true,
            filled: 0
        }, {
            size: 5,
            bitValue: 0,
            open: true,
            filled: 0
        }, {
            size: 4,
            bitValue: 0,
            open: true,
            filled: 0
        }, {
            size: 3,
            bitValue: 0,
            open: true,
            filled: 0
        }])
        b.sortBins()
        b.resetBins()
        expect(b.bins).toEqual([{
            size: 5,
            bitValue: 1,
            open: true,
            filled: 0
        }, {
            size: 4,
            bitValue: 2,
            open: true,
            filled: 0
        }, {
            size: 3,
            bitValue: 4,
            open: true,
            filled: 0
        }, {
            size: 2,
            bitValue: 8,
            open: true,
            filled: 0
        }, {
            size: 1,
            bitValue: 16,
            open: true,
            filled: 0
        }])
    })
})

describe('fillOpenBins', function () {
    it('should fill 1 binI when fille 1 unit', function () {
        const b = new BinPacker()
        b.addBin(1)
        b.addBin(1)
        b.addBin(2)
        b.addBin(3)
        b.resetBins()
        expect(b.bins[0].size).toBe(3)
        const n = b.fillOpenBins(1)
        expect(n).toBe(0)
        expect(b.bins[0].filled).toBe(0)
        expect(b.bins[1].filled).toBe(0)
        expect(b.bins[2].filled).toBe(1)
        expect(b.bins[3].filled).toBe(0)
    })
    it('should fill last binI when fill 1 unit and closing first binI', function () {
        const b = new BinPacker()
        b.addBin(1)
        b.addBin(1)
        b.addBin(2)
        b.addBin(3)
        b.resetBins()
        b.bins[2].open = false
        const n = b.fillOpenBins(1)
        expect(n).toBe(0)
        expect(b.bins[0].filled).toBe(0)
        expect(b.bins[1].filled).toBe(0)
        expect(b.bins[2].filled).toBe(0)
        expect(b.bins[3].filled).toBe(1)
    })
    it('should fill all bins, and return 93 when fill 100 units', function () {
        const b = new BinPacker()
        b.addBin(1)
        b.addBin(1)
        b.addBin(2)
        b.addBin(3)
        b.resetBins()
        const n = b.fillOpenBins(100)
        expect(n).toBe(93)
        expect(b.bins[0].filled).toBe(3)
        expect(b.bins[1].filled).toBe(2)
        expect(b.bins[2].filled).toBe(1)
        expect(b.bins[3].filled).toBe(1)
    })
})

describe('applyBinMask', function () {
    it('should close all bins when applying 255 mask', function () {
        const b = new BinPacker()
        b.addBin(1)
        b.addBin(1)
        b.addBin(2)
        b.addBin(3)
        b.resetBins()
        b.applyBinMask(255)
        expect(b.bins.every(b => !b.open)).toBeTrue()
    })
    it('should close first bin only when applying 1 mask', function () {
        const b = new BinPacker()
        b.addBin(1)
        b.addBin(1)
        b.addBin(2)
        b.addBin(3)
        b.resetBins()
        b.applyBinMask(1)
        expect(b.bins[0].open).toBeFalse()
        expect(b.bins[1].open).toBeTrue()
        expect(b.bins[2].open).toBeTrue()
        expect(b.bins[3].open).toBeTrue()
    })
    it('should close second bin only when applying 2 mask', function () {
        const b = new BinPacker()
        b.addBin(1)
        b.addBin(1)
        b.addBin(2)
        b.addBin(3)
        b.resetBins()
        b.applyBinMask(2)
        expect(b.bins[0].open).toBeTrue()
        expect(b.bins[1].open).toBeFalse()
        expect(b.bins[2].open).toBeTrue()
        expect(b.bins[3].open).toBeTrue()
    })
})

describe('findSolution', function () {
    it('should find solution 2xII when having bins 2xII, 1xIII and filling 4 units', function () {
        const b = new BinPacker()
        b.addBin(2)
        b.addBin(2)
        b.addBin(3)
        const n = b.findSolution(4)
        expect(n).toEqual({
            optimal: true,
            solution: 1,
            spent: 4,
            remain: 0
        })
        expect(b.bins[0].filled).toBe(0)
        expect(b.bins[0].size).toBe(3)
        expect(b.bins[1].filled).toBe(2)
        expect(b.bins[1].size).toBe(2)
        expect(b.bins[2].filled).toBe(2)
        expect(b.bins[2].size).toBe(2)
    })
    it('should not find solution when having bins 2xII, 1xIII and filling 1 unit1', function () {
        const b = new BinPacker()
        b.addBin(2)
        b.addBin(2)
        b.addBin(3)
        const n = b.findSolution(1)
        expect(n.optimal).toBeFalse()
    })
})

describe('reportSolution', function () {
    it('should report 2xII when having bins 2xII, 1xIII and filling 4 units', function () {
        const b = new BinPacker()
        b.addBin(2)
        b.addBin(2)
        b.addBin(3)
        const s1 = b.findSolution(4)
        expect(s1).toEqual({
            optimal: true,
            solution: 1,
            spent: 4,
            remain: 0
        })
        expect(b.reportSolution()).toEqual([
            {
                size: 2,
                count: 2
            }
        ])
    })
    it('should report 1xIII, 1xII when having bins 2xII, 1xIII and filling 6 units', function () {
        const b = new BinPacker()
        b.addBin(2)
        b.addBin(2)
        b.addBin(3)
        const s1 = b.findSolution(6)
        expect(s1).toEqual({
            optimal: false,
            solution: 0,
            spent: 5,
            remain: 1
        })
        expect(b.reportSolution()).toEqual([
            {
                size: 3,
                count: 1
            },
            {
                size: 2,
                count: 1
            }
        ])
    })
    it('should report empty solution when no bins', function () {
        const b = new BinPacker()
        b.findSolution(6)
        expect(b.reportSolution()).toEqual([])
    })
})
