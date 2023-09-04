const AssetManager = require('../src/AssetManager')
const { CONFIG } = require('../src/config')

CONFIG.setModuleActive('*', true)

function generatePublicAssets (sLang) {
    const a = new AssetManager()
    a.init()
    a.lang = sLang || 'en'
    return a.publicAssets
}

console.log(JSON.stringify(generatePublicAssets(process.argv[2]), null, '  '))
