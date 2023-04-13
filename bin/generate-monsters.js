const fs = require('fs')
const path = require('path')



function loadCsv () {
    const csv = fs
        .readFileSync(path.join(__dirname, './monsters.csv'))
        .toString()
        .split('\n')
        .map(s => s.trim().split(','))
    const headers = csv.shift()
    const data = {}
}

loadCsv()