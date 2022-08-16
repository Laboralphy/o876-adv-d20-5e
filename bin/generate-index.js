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
    return `const CONSTS = require('../consts')
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

function generateGetterReturnType (sPath) {
    const aFiles = ls(sPath)
    const aProperties = aFiles
        .map(f => {
            const sFile = path.join(sPath, f) + '.js'
            const sType = getLastReturnTagOfFile(sFile)
            if (!sType) {
                console.error('This file has no valid @return tag : ' + sFile)
            }
            return ' * @property ' + f + ' ' + sType
        })
    aProperties.unshift( ' * @typedef D20CreatureStoreGetters {object}')
    aProperties.unshift( '/**')
    aProperties.push(' */')
    return aProperties.join('\n')
}

function main (sType) {
    switch (sType) {
        case 'ii': {
            console.log(generateIndex('./src/item-properties', 'ITEM_PROPERTY_'))
            break
        }

        case 'ei': {
            console.log(generateIndex('./src/effects', 'EFFECT_'))
            break
        }

        case 'ic': {
            console.log(generateConsts('./src/item-properties', 'ITEM_PROPERTY_'))
            break
        }

        case 'ec': {
            console.log(generateConsts('./src/effects', 'EFFECT_'))
            break
        }

        case 'g': {
            console.log(generateGetterReturnType('./src/store/creature/getters'))
            break
        }

        default: {
            console.log('available options: ii, ei, ic, ec')
        }
    }
}

main(process.argv[2])
