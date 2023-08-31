const path = require("path")
const os = require('os')

const BASE_MODULE_NAME = 'base'

const BUILTIN_MODULE_LIST = [
    BASE_MODULE_NAME,
    'classic',
    'modern',
    'future'
]

class Config {
    constructor () {
        this._modules = this.buildDefaultModules()
    }

    get modules () {
        return this._modules
    }

    get activeModules () {
        return this.getActiveModules()
    }

    buildDefaultModules () {
        return BUILTIN_MODULE_LIST.map(m => ({
            id: m,
            active: m === BASE_MODULE_NAME,
            path: path.resolve(__dirname, 'modules', m)
        }))
    }

    /**
     * resolve a path
     * if name begins with '~' use home director
     * if name begins with '@' use project root directory
     * else use cwd
     * @param sPath {string}
     * @returns {string}
     */
    resolvePath (sPath) {
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

    /**
     * add a new module by its id
     * @param id {string} module unique id
     * @param sPath {string} module location on fs
     */
    addModule(id, sPath) {
        this._modules.push({ id, active: true, path: this.resolvePath(sPath) })
    }

    /**
     * find a module by its id
     * @param id {string} module id
     * @returns {{ id: string, active: boolean, path: string }}
     */
    getModule (id) {
        return this._modules.find(m => m.id === id)
    }

    /**
     * activates or deactivate a module
     * @param id {string}
     * @param value {boolean}
     */
    setModuleActive(id, value) {
        const m = this.getModule(id)
        if (m) {
            m.active = value
        }
    }

    /**
     * return a list of activated modules path
     * @returns {string[]}
     */
    getActiveModules () {
        return this
            ._modules
            .filter(m => m.active)
            .map(m => m.path)
    }
}

module.exports = {
    Config,
    CONFIG: new Config()
}
