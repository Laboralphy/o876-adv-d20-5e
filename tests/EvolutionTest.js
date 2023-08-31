const Evolution = require('../src/Evolution')
const AssetManager = require('../src/AssetManager')
const { Config } = require('../src/config')

describe('basic test', function () {
    it ('should load properly when doing nothing', function () {
        expect(() => {
            const config = new Config()
            const am = new AssetManager({ config })
            am.init()
        }).not.toThrow()
    })
})