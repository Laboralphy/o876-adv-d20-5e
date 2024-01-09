const Manager = require('./src/Manager')
const Creature = require('./src/Creature')
const EffectProcessor = require('./src/EffectProcessor')
const EntityFactory = require('./src/EntityFactory')
const AssetManager = require('./src/AssetManager')
const { Config, CONFIG } = require('./src/config')
const CONSTS = require('./src/consts')
const Evolution = require('./src/Evolution')
const publicAssets = {
    en: require('./src/public-assets/public-assets.en.json'),
    fr: require('./src/public-assets/public-assets.fr.json')
}

module.exports = {
    AssetManager,
    CONFIG,
    CONSTS,
    Config,
    Creature,
    EffectProcessor,
    EntityFactory,
    Evolution,
    Manager,
    publicAssets
}
