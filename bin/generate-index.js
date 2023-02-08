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
    return `/* THIS FILE IS AUTO-GENERATED ! DO NOT MODIFY */
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

function main (sType) {
    switch (sType) {
        // item property index
        case 'ii': {
            console.log(generateIndex('./src/extra-properties', 'EXTRA_PROPERTY_'))
            break
        }

        // effect index
        case 'ei': {
            console.log(generateIndex('./src/effects', 'EFFECT_'))
            break
        }

        // item property consts
        case 'ic': {
            console.log(generateConsts('./src/extra-properties', 'EXTRA_PROPERTY_'))
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
                './src/modules/classic/store/creature/getters'
            ]))
            break
        }

        // Check skills
        case 'cs': {
            console.group('checking skills')
            checkConstAndData('./src/consts/skills.json', './src/data/skills.json')
            checkConstAndData('./src/consts/skills.json', './src/data/skills.json')
            console.groupEnd()
            break
        }

        default: {
            console.log('available options: ii, ei, ic, ec, g, cs')
            break
        }
    }
}

main(process.argv[2])
