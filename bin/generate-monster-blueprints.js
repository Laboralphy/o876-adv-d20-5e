const fs = require('fs')
const path = require('path')
const vm = require('vm')
const { parse } = require('csv-parse/sync')
const CONSTS = require('../src/consts')

function loadCsv () {
    const csv = parse(fs
        .readFileSync(path.join(__dirname, './monsters.csv'))
        .toString(), {
        delimiter: ',',
        columns: false,
        skip_empty_lines: true
    })
    const aColumnCodes = csv[1]
    return {
        codes: aColumnCodes,
        data: csv.slice(2)
    }
}

/**
 *
 * @param oCodes {Object<string, string>}
 * @return {vm.Script[]}
 */
function compile (oCodes) {
    const aCompiled = []
    for (const [sName, sCode] of Object.entries(oCodes)) {
        aCompiled.push(new vm.Script(sCode))
    }
    return aCompiled
}

/**
 *
 * @returns {Context}
 */
function createContext () {
    const oContext = {
        c: {},
        value: '',
        _output: [],
        _prevValue: '',
    }

    /**
     * Créé une propriété dans l'obj de sorte que obj[_lastValue] = value
     * @param obj
     */
    function kv (obj) {
        if (typeof oContext.value === "number") {
            obj[oContext._prevValue] = oContext.value
            return
        }
        const sTrimmedValue = oContext.value.trim()
        const c0 = sTrimmedValue.charAt(0)
        const sSigns = '[{"\''
        obj[oContext._prevValue] = sSigns.includes(c0) ? JSON.parse(sTrimmedValue) : sTrimmedValue
    }

    function last (arr) {
        return arr.slice(-1).pop()
    }

    function output () {
        oContext._output.push(oContext.c)
        oContext.c = {}
    }

    oContext.kv = kv
    oContext.output = output
    oContext.last = last

    return vm.createContext(oContext)
}

/**
 * @param aRow {string[]}
 * @param aScripts {vm.Script[]}
 * @param oContext {Context}
 */
function run (aRow, aScripts, oContext) {
    if (!Array.isArray(aRow)) {
        console.error(aRow)
        throw new TypeError('ERR_ARRAY_EXPECTED')
    }
    aRow.forEach((value, i) => {
        if (value !== '') {
            value = isNaN(+value) ? value : parseInt(value)
            oContext.value = value
            try {
                aScripts[i].runInContext(oContext)
            } catch (e) {
                console.error(aRow)
                console.error('COLUMN ' + i + ' : ' + value)
                throw e
            } finally {
                oContext._prevValue = value
            }
        }
    })
}

function searchConst (sSearch) {
    if (Array.isArray(sSearch)) {
        return sSearch.map(s => searchConst(s))
    }
    if (typeof sSearch === "number") {
        return sSearch
    }
    const sSearchUpper = '_' + sSearch.replace(/-/g, '_').toUpperCase()
    const sFound = Object.values(CONSTS).find(s => s.endsWith(sSearchUpper))
    return sFound === undefined ? sSearch : sFound
}

function searchConstObj (obj) {
    const oOutput = {}
    for (const [k, v] of Object.entries(obj)) {
        if (k === 'skill') {
            oOutput[k] = 'SKILL_' + v.toUpperCase()
        } else {
            oOutput[k] = searchConst(v)
        }
    }
    return oOutput
}

function makeBlueprint (data) {
    const blueprint = {
        entityType: "ENTITY_TYPE_ACTOR",
        class: data.class,
        level: data.level,
        abilities: data.abilities,
        size: data.size,
        specie: data.specie,
        speed: data.speed,
        equipment: data.equipment ? data.equipment : [],
        actions: data.actions || []
    }
    if (data.damage) {
        blueprint.equipment.push({
            entityType: "ENTITY_TYPE_ITEM",
            itemType: "ITEM_TYPE_NATURAL_WEAPON",
            weaponType: "weapon-type-unarmed",
            ref: 'nwpn-' + data.name,
            damage: data.damage,
            damageType: searchConst(data.damageType),
            material: 'MATERIAL_UNKNOWN',
            properties: data.weaponProps
                ? data.weaponProps.map(wp => ({
                    property: 'ITEM_PROPERTY_' + wp.type.replace(/-/g, '_').toUpperCase(),
                    amp: wp.amp || 0,
                    ...searchConstObj(wp.data)
                }))
                : []
        })
    }
    if (data.armorProps && data.armorProps.length > 0) {
        blueprint.equipment.push({
            entityType: "ENTITY_TYPE_ITEM",
            itemType: "ITEM_TYPE_NATURAL_ARMOR",
            armorType: "armor-type-natural",
            material: 'MATERIAL_UNKNOWN',
            ref: 'narm-' + data.name,
            properties: data.armorProps
                ? data.armorProps.map(ap => ({
                    property: 'ITEM_PROPERTY_' + ap.property.replace(/-/g, '_').toUpperCase(),
                    amp: ap.amp || 0,
                    ...searchConstObj(ap.data)
                }))
                : []
        })
    }
    return blueprint
}

function main() {
    const t = loadCsv()
    const aCodes = compile(t.codes)
    const oContext = createContext()
    t.data.forEach(r => run(r, aCodes, oContext))
    oContext.output()
    oContext._output.forEach(o => {
        if (o.name) {
            fs
                .writeFileSync(
                    path.join(__dirname, './generated-blueprints', o.name + '.json'),
                    JSON.stringify(makeBlueprint(o), null, '  ')
                )
        }
    })
}

main()
