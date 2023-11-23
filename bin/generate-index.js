const TreeSync = require('../libs/tree-sync')
const fs = require('fs')
const path = require('path')

function lsr (sPath) {
    return TreeSync
        .tree(sPath)
        .map(f => f.split(path.sep).pop())
        .filter(f => f !== 'index.js')
        .map(f => f.replace(/\.js(on|)$/, ''))
}

function ls (sPath) {
    return TreeSync
        .ls(sPath)
        .filter(f => !f.dir && f.name !== 'index.js')
        .map(f => f.name.replace(/\.js(on|)$/, ''))
}

function camelCase (s) {
    return s
        .replace(/-/g, '_')
        .toUpperCase()
}

function renderExport (s) {
    const d = new Date()
    const sDate = d.toLocaleString()
    return `/* THIS FILE IS AUTO-GENERATED ! DO NOT MODIFY ! Date: ${sDate} */
const CONSTS = require('../consts')
module.exports = ${s}
`
}

function generateIndex (sPath, sPrefix) {
    const aFiles = ls(sPath)
    const aConsts = aFiles
        .map(f => ({
            c: sPrefix + camelCase(f),
            f
        }))
    const sObject = '{\n' + aConsts
        .map(f => `  [CONSTS.${f.c}]: require('./${f.f}')`)
        .join(',\n') + '\n}'
    return renderExport(sObject)
}

function generateConsts (sPath, sPrefix) {
    const aFiles = lsr(sPath)
    const aConsts = aFiles
        .map(f => ({
            c: sPrefix + camelCase(f),
            f
        }))
    return '{\n' + aConsts
        .map(f => `  "${f.c}": "${f.c}"`)
        .join(',\n') + '\n}'
}

function getLastReturnTagOfFile (sFile) {
    const regType = /@returns? +(.*)$/
    return fs
        .readFileSync(sFile, { encoding: 'utf-8'})
        .split('\n')
        .filter(l => l.includes('@return'))
        .map(l => {
            const a = l.trim().match(regType)
            if (a) {
                return a[1]
            } else {
                return ''
            }
        })
        .filter(l => l !== '')
        .pop()
}

function generateGetterReturnType (aPaths) {
    const aProperties = aPaths.map(sPath => {
        return ls(sPath)
            .map(f => {
                const sFile = path.join(sPath, f) + '.js'
                const sType = getLastReturnTagOfFile(sFile)
                if (!sType) {
                    console.error('This file has no valid @return tag : ' + sFile)
                }
                return ' * @property ' + f + ' ' + sType
            })
    }).flat()
    aProperties.unshift( ' * @typedef D20CreatureStoreGetters {object}')
    aProperties.unshift( '/**')
    aProperties.push(' */')
    return aProperties.join('\n')
}

/**
 * Vérifie qu'un fichier de constante et un fichier de data soit bien synchro
 */
function checkConstAndData (sConstFile, sDataFile) {
    const oConsts = JSON.parse(fs.readFileSync(sConstFile).toString())
    const oData = JSON.parse(fs.readFileSync(sDataFile).toString())
    // toutes les const sont dans data ?
    Object.keys(oConsts).forEach(c => {
        if (!(c in oData)) {
            console.log(c, 'is in constant file but not in data file !')
        }
    })
    Object.keys(oData).forEach(c => {
        if (!(c in oConsts)) {
            console.log(c, 'is in data file but not in constant file !')
        }
    })
}

function generateItemPropertyParams () {
    const PATH = './src/item-properties'
    const ips = ls(PATH)
    return Object.fromEntries(ips.map(ipFile => {
        const sName = 'ITEM_PROPERTY_' + ipFile.toUpperCase().replace(/-/g, '_')
        const oParams = Object.fromEntries(fs
            .readFileSync(path.join(PATH, ipFile + '.js'))
            .toString()
            .split('\n')
            .map(s => s.trim().match(/\*\s+@param\s+([a-z]+)\s+\{(.*)}\s*(\S*)$/i))
            .filter(a => Array.isArray(a))
            .map(a => a.slice(1))
            .map(a => ([ a[0], a[2] || a[1] ])))
        return [sName, oParams]
    }))
}

function generatePublicAssets () {
    const a = new AssetManager()
    a.init()
    return a.publicAssets
}

function main (sType) {
    switch (sType) {
        // item property index
        case 'ii': {
            console.log(generateIndex('./src/item-properties', 'ITEM_PROPERTY_'))
            break
        }

        // effect index
        case 'ei': {
            console.log(generateIndex('./src/effects', 'EFFECT_'))
            break
        }

        // item property consts
        case 'ic': {
            console.log(generateConsts('./src/item-properties', 'ITEM_PROPERTY_'))
            break
        }

        // effect consts
        case 'ec': {
            console.log(generateConsts('./src/effects', 'EFFECT_'))
            break
        }

        // getters
        case 'g': {
            console.log(generateGetterReturnType([
                './src/store/creature/getters',
                './src/modules/classic/store/creature/getters',
                './src/modules/ddmagic/store/creature/getters'
            ]))
            break
        }

        case 'ipdoc': {
            console.log(JSON.stringify(generateItemPropertyParams(), null, '  '))
            break
        }

        case 'pa': {
            // console.log(JSON.stringify(generatePublicAssets()), null, '  ')
            break
        }

        default: {
            console.log('available options: ii, ei, ic, ec, g')
            break
        }
    }
}

main(process.argv[2])

