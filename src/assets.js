const AssetManager = require('./AssetManager')
let bInit = false
const am = new AssetManager()

function warmup () {
    if (!bInit) {
        am.init()
        bInit = true
    }
}

module.exports = {
    warmup,
    assetManager: am
}
