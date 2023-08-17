const path = require("path")
const os = require('os')

const aModules = [
    {
        id: 'base',
        active: true,
        path: path.resolve(__dirname, 'modules', 'base')
    },
    {
        id: 'classic',
        active: false,
        path: path.resolve(__dirname, 'modules', 'classic')
    },
    {
        id: 'future',
        active: false,
        path: path.resolve(__dirname, 'modules', 'future')
    },
    {
        id: 'modern',
        active: false,
        path: path.resolve(__dirname, 'modules', 'modern')
    }
]

function resolvePath (sPath) {
    let sFinalPath = ''
    sPath = sPath.trimStart()
    switch (sPath.charAt(0)) {
        case '~': {
            sFinalPath += path.resolve(os.homedir(), sPath)
            break
        }
        case '@': {
            sFinalPath += path.resolve(__dirname, 'modules', sPath)
            break
        }
        default: {
            sFinalPath += path.resolve(sPath)
            break
        }
    }
    return sFinalPath
}

function addModule(id, sPath) {
    aModules.push({ id, active: true, path: resolvePath(sPath) })
}

function getModule(id) {
    return aModules.find(m => m.id === id)
}

function setModuleActive(id, value) {
    const m = getModule(id)
    if (m) {
        m.active = value
    }
}

function getActiveModules() {
    return aModules
        .filter(m => m.active)
        .map(m => m.path)
}

module.exports = {
    modules: aModules,
    addModule,
    getModule,
    setModuleActive,
    get activeModules() {
        return getActiveModules()
    }
}
