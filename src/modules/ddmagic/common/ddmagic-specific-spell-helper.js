const CONSTS = require('../../../consts')
const Creature = require('../../../Creature')
const EffectProcessor = require('../../../EffectProcessor')
const SpellHelper = require('../../classic/common/spell-helper')

/**
 *
 * @param spell {string}
 * @returns {*}
 */
function getSpellData (spell) {
    const spelldb = Creature.AssetManager.data['data-ddmagic-spell-database']
    if (spell in spelldb) {
        return spelldb[spell]
    } else {
        throw new Error('ERR_SPELL_NOT_FOUND')
    }
}

function getSpellCastingLevel (spell, power) {
    const oSpell = getSpellData(spell)
    return oSpell.level === 0
        ? 0
        : Math.min(20, oSpell.level + Math.max(0, power))
}

function getCantripDamageDice (caster, sBaseDice) {
    const d = 'd' + sBaseDice
    const nCasterLevel = caster.store.getters.getWizardLevel
    if (nCasterLevel >= 17) {
        return '4' + d
    } else if (nCasterLevel >= 11) {
        return '3' + d
    } else if (nCasterLevel >= 5) {
        return '2' + d
    } else {
        return '1' + d
    }
}

function rangedAttack (caster) {
    const nProfBonus = caster.store.getters.getProficiencyBonus
    const sAbility = CONSTS.ABILITY_INTELLIGENCE
    const nAbilityModifier = caster.store.getters.getAbilityModifiers[sAbility]
    const { value, circumstances } = caster.rollD20(CONSTS.ROLL_TYPE_ATTACK, sAbility)
    const nAtkRoll = nProfBonus + nAbilityModifier + value
    const target = caster.getTarget()
    if (!target) {
        throw new Error('ERR_NO_TARGET')
    }
    const ac = target.store.getters.getArmorClass
    const hit = nAtkRoll >= ac
    caster.events.emit('spell-ranged-attack', {
        target,
        hit
    })
    return {
        attack: nAtkRoll,
        ac,
        hit,
        circumstances
    }
}

function buildSpellMark (spell, caster, power = 0) {
    const spellLevel = getSpellData(spell).level
    const spellCastLevel = spellLevel + power
    const id = Math.random().toString(36).slice(2)
    const casterLevel = caster.store.getters.getWizardLevel
    return {
        spell,
        id,
        spellLevel,
        spellCastLevel,
        casterLevel
    }
}

function createSpellEffect (spell, caster, power, sEffect, ...args) {
    const oEffect = EffectProcessor.createEffect(sEffect, ...args)
    oEffect.data.spell = buildSpellMark(spell, caster, power)
    return oEffect
}

function evocationAttack ({
    spell,
    power = 0,
    caster,
    target,
    damage,
    type,
    dc,
    ability = CONSTS.ABILITY_DEXTERITY,
}) {
    const oEffect = SpellHelper.evocationAttack({
        caster,
        target,
        damage,
        type,
        dc,
        cantrip: getSpellCastingLevel(spell, 0) === 0,
        ability,
        apply: false
    })
    oEffect.data.spell = buildSpellMark(spell, caster, power)
    return target.applyEffect(oEffect, 0, caster)
}

function conditionAttack ({
    caster,
    target,
    spell,
    power = 0,
    condition,
    duration,
    savingAbility,
    threats = [],
    dc,
    subtype = CONSTS.EFFECT_SUBTYPE_MAGICAL
}) {
    const oEffect = SpellHelper.conditionAttack({
        caster,
        target,
        condition,
        savingAbility,
        threats,
        dc,
        subtype,
        apply: false
    })
    oEffect.data.spell = buildSpellMark(spell, caster, power)
    return target.applyEffect(oEffect, duration, caster)
}

function declareSpellEffects ({
    spell,
    power = 0,
    effects = [],
    caster,
    target
}) {
    const spellLevel = getSpellData(spell).level
    const spellCastLevel = spellLevel + power
    const id = Math.random().toString(36).slice(2)
    const casterLevel = caster.store.getters.getWizardLevel
    const oSpellMark = {
        spell,
        id,
        spellLevel,
        spellCastLevel,
        casterLevel
    }
    effects.forEach(eff => {
        eff.data.spell = oSpellMark
        target.applyEffect(eff, eff.duration, caster)
    })
}

module.exports = {
    getCantripDamageDice,
    rangedAttack,
    getSpellData,
    getSpellCastingLevel,
    declareSpellEffects,
    evocationAttack,
    conditionAttack
}