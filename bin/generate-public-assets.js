const AssetManager = require('../src/AssetManager')
const { Config } = require('../src/config')

const CONFIG = new Config()
CONFIG.setModuleActive('*', true)

function generatePublicAssets (sLang) {
    const a = new AssetManager({ config: CONFIG })
    a.init()
    a.lang = sLang || 'en'
    return a.publicAssets
}

console.log(JSON.stringify(generatePublicAssets(process.argv[2]), null, '  '))
