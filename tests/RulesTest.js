const Rules = require('../src/Rules')

describe('instanciation', function () {
    it('should instanciate with no error', function () {
        expect(() => {
            const r = new Rules()
            r.init()
        }).not.toThrow()
    })
})
