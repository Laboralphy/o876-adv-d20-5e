const TreeSync = require('../libs/tree-sync')

function ls (sPath) {
    return TreeSync
        .ls(sPath)
        .filter(f => !f.dir && f.name !== 'index.js')
        .map(f => f.name.replace(/\.js$/, ''))
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
    const aFiles = ls(sPath)
    const aConsts = aFiles
        .map(f => ({
            c: sPrefix + camelCase(f),
            f
        }))
    return '{\n' + aConsts
        .map(f => `  "${f.c}": "${f.c}"`)
        .join(',\n') + '\n}'
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

        default: {
            console.log('available options: ii, ei, ic, ec')
        }
    }
}

main(process.argv[2])
