const Manager = require('./src/Manager')
const Creature = require('./src/Creature')
const EffectProcessor = require('./src/EffectProcessor')
const AssetManager = require('./src/AssetManager')
const { Config, CONFIG } = require('./src/config')
const { CONSTS } = require('./src/consts')
const publicAssets = {
    en: require('./src/public-assets/public-assets.en.json'),
    fr: require('./src/public-assets/public-assets.fr.json')
}

module.exports = {
    Manager,
    Creature,
    EffectProcessor,
    AssetManager,
    Config,
    CONFIG,
    publicAssets,
    CONSTS
}
