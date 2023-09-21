class Evolution {
    constructor () {
        this._data = null
    }

    set data (value) {
        this._data = Object
            .fromEntries(Object
                .entries(value)
                .filter(([sKey]) => sKey.startsWith('class-'))
            )
    }

    get data () {
        return this._data
    }

    /**
     * Renvoie la valeur numérique du prochain niveau dans la classe spécifiée
     * @param oCreature {Creature}
     * @param sClass {string}
     * @return {number}
     */
    getClassNextLevelValue (oCreature, sClass) {
        const oLevelByClass = oCreature.store.getters.getLevelByClass
        return sClass in oLevelByClass
            ? (oLevelByClass[sClass] + 1)
            : 1
    }

    getClassData (sClass) {
        const cd = this._data['class-' + sClass]
        if (!cd) {
            throw new Error('ERR_EVOL_UNKNOWN_CLASS')
        }
        return cd
    }

    /**
     * Obtention des informations d'un niveau de classe donné
     * @param oCreature {Creature}
     * @param sClass {string}
     * @param nLevel {number}
     * @return {{ level: number, abilityScoreImprovement: boolean, extraAttacks: boolean, feats: {uses: number, feat: string, group: string}[]}}
     */
    getClassLevelData (oCreature, sClass, nLevel) {
        if (isNaN(nLevel)) {
            throw new TypeError('ERR_EVOL_BAD_LEVEL')
        }
        const cd = this.getClassData(sClass)
        if ('evolution' in cd) {
            const cdl = cd.evolution.find(n => n.level === nLevel)
            // déterminer les feat actuellement disponible pour la creature
            const aAlreadyHaveFeats = oCreature.store.getters.getFeatReport.map(f => f.feat)
            // déterminer la liste des prochains feat susceptible d'etre ajouté par le niveau
            /**
             * @type {{ feat: string, uses?: number, group?: string}[]}
             */
            const aNextLevelFeats = 'feats' in cdl ? cdl.feats : []
            const feats = aNextLevelFeats.filter(f => 'uses' in f || !aAlreadyHaveFeats.includes(f.feat))
            return {
                level: nLevel,
                feats,
                abilityScoreImprovement: !!cdl.abilityScoreImprovement,
                extraAttacks: !!cdl.extraAttacks
            }
        } else {
            return {
                level: nLevel,
                feats: [],
                abilityScoreImprovement: false,
                extraAttacks: false
            }
        }
    }

    /**
     * Renvoie true si le feat est disponible pour la creature à ce niveau de classe
     * @param oCreature {Creature} Creature à tester
     * @param sClass {string} Classe qu'on veut examiner
     * @param nLevel {number} niveau de classe
     * @param sFeat {string} nom du feat dont on teste la disponibilité
     */
    isCreatureFeatAvailable (oCreature, sClass, nLevel, sFeat) {
        const oLevelData = this.getClassLevelData(oCreature, sClass, nLevel)
        return !!oLevelData.feats.find(f => f.feat === sFeat)
    }

    isMeetingClassPrerequisites (oCreature, sClass) {
        const g = oCreature.store.getters
        const ab = g.getAbilityBaseValues
        const cd = this.getClassData(sClass)
        if (!('multiclass' in cd)) {
            return true
        }
        const sMulticlass = cd.multiclass?.abilities || ''
        let r
        r = sMulticlass.match(/(ABILITY_[_A-Z]+) *& *(ABILITY_[_A-Z]+)/)
        if (r) {
            const [, ab1, ab2] = r
            return ab[ab1] >= 13 && ab[ab2] >= 13
        }
        r = sMulticlass.match(/(ABILITY_[_A-Z]+) *| *(ABILITY_[_A-Z]+)/)
        if (r) {
            const [, ab1, ab2] = r
            return ab[ab1] >= 13 || ab[ab2] >= 13
        }
        r = sMulticlass.match(/(ABILITY_[_A-Z]+)/)
        if (r) {
            const [, ab1] = r
            return ab[ab1] >= 13
        }
        return true
    }

    /**
     * Renvoie true si on est multiclasser ou si on va multiclasser
     * @param oCreature {Creature}
     * @param sClass {string}
     */
    isMultiClassing (oCreature, sClass) {
        const cl = oCreature.store.getters.getClassList
        const nClassCount = cl.length
        const bOneClass = nClassCount === 1
        const bMoreClasses = nClassCount > 1
        return bMoreClasses || (bOneClass && cl[0] !== sClass)
    }

    /**
     * Repond true si la creature a le droit de choisir la classe spécifiée
     * @param oCreature
     * @param sClass
     * @returns {this is string[]|boolean}
     */
    canCreatureLevelUpTo (oCreature, sClass) {
        const aClasses = Object.keys(oCreature.store.getters.getLevelByClass)
        if (sClass !== aClasses[aClasses.length - 1]) {
            aClasses.push(sClass)
        }
        if (aClasses.length === 1) {
            return true
        }
        return aClasses.every(c => this.isMeetingClassPrerequisites(oCreature, c))
    }

    /**
     * La focntion doit pouvoir proposer une liste de selection parmi les feats, skills, abilities...
     * @param oCreature
     * @param sClass
     * @returns {{skills: *[], skillCount: (number|*), canDo: boolean, ability: boolean, class, feats: {}}}
     */
    checkLevelUpRequirements (oCreature, sClass) {
        const nLevel = this.getClassNextLevelValue(oCreature, sClass)
        const bNeedSkills = nLevel === 1
        const ex = this.getClassLevelData(oCreature, sClass, nLevel)
        const cd = this.getClassData(sClass)
        const bMultiClassing = this.isMultiClassing(oCreature, sClass)
        const nExpectedSkillCount = bNeedSkills
            ? bMultiClassing
                ? (cd.multiclass?.skillCount || 0)
                : (cd.skillCount || 0)
            : 0
        const oOutcome = {
            class: sClass,
            canDo: true,
            feats: {},
            skills: [],
            skillCount: nExpectedSkillCount,
            ability: ex.abilityScoreImprovement
        }
        if (!this.canCreatureLevelUpTo(oCreature, sClass)) {
            oOutcome.canDo = false
            return oOutcome
        }
        // Déterminer les feat groupés
        const oAvailableFeatGroups = oOutcome.feats
        ex.feats.forEach(f => {
            if ('group' in f) {
                if (f.group in oAvailableFeatGroups) {
                    oAvailableFeatGroups[f.group].push(f.feat)
                } else {
                    oAvailableFeatGroups[f.group] = [f.feat]
                }
            }
        })
        // Y a t il des skills à selectionner ?
        if (bNeedSkills) {
            const skills = bNeedSkills
                ? cd.classSkills
                : []
            oOutcome.skills = skills.slice(0)
        }
        return oOutcome
    }

    creatureLevelUp (oCreature, {
        selectedClass,
        selectedFeats = [],
        selectedAbility = '',
        selectedSkills = []
    }) {
        if (!selectedClass) {
            throw new Error('ERR_EVOL_NO_CLASS_SELECTED')
        }
        if (selectedFeats.some(s => typeof s !== 'string')) {
            throw new TypeError('ERR_EVOL_FEATS_EXPECTED_STRING')
        }
        if (selectedSkills.some(s => typeof s !== 'string')) {
            throw new TypeError('ERR_EVOL_SKILLS_EXPECTED_STRING')
        }
        if (typeof selectedAbility !== 'string') {
            throw new TypeError('ERR_EVOL_ABILITY_EXPECTED_STRING')
        }
        if (typeof selectedClass !== 'string') {
            throw new TypeError('ERR_EVOL_CLASS_EXPECTED_STRING')
        }
        const oJournal = {}
        if (!this.canCreatureLevelUpTo(oCreature, selectedClass)) {
            throw new Error('ERR_EVOL_CANT_MULTICLASS')
        }

        // Est ce qu'on multiclass ?
        const bMulticlass = this.isMultiClassing(oCreature, selectedClass)

        // Niveau auquel on acceder
        const nLevel = this.getClassNextLevelValue(oCreature, selectedClass)
        const bNeedSkills = nLevel === 1
        const ex = this.getClassLevelData(oCreature, selectedClass, nLevel)
        const cd = this.getClassData(selectedClass)

        const clur = this.checkLevelUpRequirements(oCreature, selectedClass)

        // les skills
        // lorsqu'on accède à cette classe la première fois, il faut choisir des skills
        // Pour un fresh new character il faut choisir parmis ".skill"
        // Sinon (multiclass) il faut choisir parmis ".skills" aussi mais seulement si .multiclass.skillCount est supérieur à 0
        const nExpectedSkillCount = clur.skillCount

        if (nExpectedSkillCount !== selectedSkills.length) {
            throw new Error('ERR_EVOL_INVALID_SKILL_COUNT')
        }

        // Tous les skills doivent être dans les skills autorisés
        const aAllowedSkills = clur.skills
        if (selectedSkills.some(skill => !aAllowedSkills.includes(skill))) {
            const sError = selectedSkills.filter(skill => !aAllowedSkills.includes(skill)).join(', ')
            const sAllowed = aAllowedSkills.join(', ')
            throw new Error('ERR_EVOL_FORBIDDEN_SKILL: ' + sError + ' - ALLOWED VALUES: ' + sAllowed)
        }

        // FEATS
        const oLevelFeatRegistry = {}
        ex.feats.forEach(f => {
            oLevelFeatRegistry[f.feat] = f
        })
        // il faut que les feats de selectedFeats soient dans les feats selectable
        if (selectedFeats.some(f => !(f in oLevelFeatRegistry))) {
            const sError = selectedFeats.filter(f => !oLevelFeatRegistry[f]).join(', ')
            const sAllowed = Object.keys(oLevelFeatRegistry).join(', ')
            throw new Error('ERR_EVOL_FORBIDDEN_FEAT: ' + sError + ' - ALLOWED VALUES: ' + sAllowed)
        }
        // Déterminer les groupes de feat disponibles à ce niveau
        const oAvailableFeatGroups = {}
        const aAutoFeats = []
        ex.feats.forEach(f => {
            if ('group' in f) {
                oAvailableFeatGroups[f.group] = 0
            } else {
                aAutoFeats.push(f)
            }
        })
        // pour tous les feats sélecteionnés, créé un compteur de groupe
        selectedFeats.forEach(selectedFeatName => {
            const oFeat = ex.feats.find(f => f.feat === selectedFeatName)
            if (!oFeat) {
                // bizarre, l'un des feats sélectionnés n'est pas dispo à ce niveau dans la classe
                throw new Error('ERR_EVOL_WEIRD_UNFOUND_FEAT: ' + selectedFeatName)
            }
            if ('group' in oFeat) {
                // on ne traite que les feats groupés
                if (oFeat.group in oAvailableFeatGroups) {
                    ++oAvailableFeatGroups[oFeat.group]
                } else {
                    // bizarre, l'un des feats sélectionnés fait partie d'un groupe non enregistré
                    throw new Error('ERR_EVOL_WEIRD_UNFOUND_FEAT_GROUP')
                }
            }
        })
        // Vérifier que tous les groupes sont sélectionnés exactement une fois
        if (Object.values(oAvailableFeatGroups).some(x => x < 1)) {
            throw new Error('ERR_EVOL_GROUP_FEAT_NOT_SELECTED')
        }
        if (Object.values(oAvailableFeatGroups).some(x => x > 1)) {
            throw new Error('ERR_EVOL_GROUP_FEAT_OVER_SELECTED')
        }
        // Feat deja acquis
        const aAlreadyHaveFeats = new Set()
        oCreature.store.getters.getFeatReport.forEach(f => aAlreadyHaveFeats.add(f.feat))

        // A ce stade tous les feats sélectionnés sont valides on peut les ajouter à la créature
        // Mais certains sont peut être des augmentations d'usage
        const aFinalFeats = [...(aAutoFeats.map(({ feat }) => feat)), ...selectedFeats]
        const aFeatAugmentUses = aFinalFeats.filter(f => !!oLevelFeatRegistry[f].uses)
        const aFeatAdd = aFinalFeats.filter(f => !aAlreadyHaveFeats.has(f))

        // Ajouter la classe
        oCreature.store.mutations.addClass({ ref: selectedClass })
        oJournal.class = selectedClass

        // Ajouter les feats
        aFeatAdd.forEach(feat => {
            oCreature.store.mutations.addFeat({ feat })
        })
        aFeatAugmentUses.forEach(({ feat, uses }) => oCreature.store.mutations.setCounterValue({ counter: feat, max: uses }))

        const bHasNewFeats = aFeatAdd.length > 0
        const bHasNewFeatUses = aFeatAugmentUses.length > 0
        if (bHasNewFeats || bHasNewFeatUses) {
            oJournal.feats = {}
        }
        if (bHasNewFeats) {
            oJournal.feats.newFeats = aFeatAdd
        }
        if (bHasNewFeatUses) {
            oJournal.feats.newFeatUses = aFeatAugmentUses
        }

        if (ex.extraAttacks) {
            const nPrevExtraAttacks = oCreature.store.getters.getCounters.extraAttacks.value
            if (nPrevExtraAttacks < ex.extraAttacks) {
                oCreature.store.mutations.setCounterValue({ counter: 'extraAttacks', value: ex.extraAttacks })
                oJournal.extraAttacks = ex.extraAttacks
            } else {
                oJournal.extraAttacks = 0
            }
        }
        if (ex.abilityScoreImprovement) {
            if (!selectedAbility) {
                throw new Error('ERR_EVOL_ABILITY_REQUIRED')
            }
            const nValue = oCreature.store.getters.getAbilityBaseValues[selectedAbility]
            if (isNaN(nValue)) {
                throw new Error('ERR_EVOL_ABILITY_INVALID_VALUE')
            }
            oCreature.store.mutations.setAbility({ ability: selectedAbility, value: nValue + 1 })
            oJournal.augmentedAbility = selectedAbility
        }

        return oJournal
    }

    /**
     * Ajoute un niveau de classe à la créature spécifiée
     * @param am {AssetManager}
     * @param sClass {string}
     * @param nLevel {number}
     */
    getLevelData (am, sClass, nLevel) {
        const oClassData = am.data.classes[sClass]
        const aEvolData = oClassData.evolution
        if (aEvolData) {
            return aEvolData.find(ed => ed.level === nLevel)
        } else {
            return undefined
        }
    }
}

module.exports = Evolution
