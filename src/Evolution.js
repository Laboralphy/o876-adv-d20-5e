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
            ? (oLevelByClass[sClass].level + 1)
            : 1
    }

    /**
     * Obtention des informations d'un niveau de classe donné
     * @param oCreature {Creature}
     * @param sClass {string}
     * @param nLevel {number}
     * @return {{ level: number, abilityScoreImprovement: boolean, extraAttack: boolean, feats: {uses: number, feat: string, group: string}[]}}
     */
    getClassLevelData (oCreature, sClass, nLevel) {
        const cd = this._data['class-' + sClass]
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
                extraAttack: !!cdl.extraAttack
            }
        } else {
            return {
                level: nLevel,
                feats: [],
                abilityScoreImprovement: false,
                extraAttack: false
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

    creatureLevelUp (oCreature, { selectedClass, selectedFeats = [], selectedAbility = '' }) {
        const nLevel = this.getClassNextLevelValue(oCreature, selectedClass)
        const ex = this.getClassLevelData(oCreature, selectedClass, nLevel)
        const oLevelFeatRegistry = {}
        ex.feats.forEach(f => {
            oLevelFeatRegistry[f.feat] = f
        })
        // il faut que les feats de selectedFeats soient dans les feats selectable
        if (selectedFeats.some(f => !oLevelFeatRegistry[f])) {
            throw new Error('ERR_EVOL_FORBIDDEN_FEAT')
        }
        // Déterminer les groupes de feat disponibles à ce niveau
        const oAvailableFeatGroups = {}
        ex.feats.forEach(f => {
            if ('group' in f) {
                oAvailableFeatGroups[f.group] = 0
            }
        })
        // pour tous les feats sélecteionnés, créé un compteur de group
        selectedFeats.forEach(selectedFeatName => {
            const oFeat = ex.feat.find(f => f.feat === selectedFeatName)
            if (!oFeat) {
                // bizarre, l'un des feats sélectionnés n'est pas dispo à ce niveau dans la classe
                throw new Error('ERR_EVOL_WEIRD_UNFOUND_FEAT')
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
        if (Object.values(oAvailableFeatGroups).some(x => x !== 1)) {
            throw new Error('ERR_EVOL_BAD_FEAT_GROUP_SELECTION')
        }
        // Feat deja acquis
        const aAlreadyHaveFeats = new Set()
        oCreature.store.getters.getFeatReport.forEach(f => aAlreadyHaveFeats.add(f))

        // A ce stade tous les feats sélectionnés sont valides on peut les ajouter à la créature
        // Mais certains sont peut être des augmentations d'usage
        const aFeatAugmentUse = selectedFeats.filter(f => !!oLevelFeatRegistry[f].uses)
        const aFeatAdd = selectedFeats.filter(f => !aAlreadyHaveFeats.has(f))
        return {
            aFeatAdd,
            aFeatAugmentUse,
            extraAttack: ex.extraAttack,
            abilityScoreImprovement: ex.abilityScoreImprovement
        }
    }

    /**
     * Ajoute un niveau de classe à la créature spécifiée
     * @param oCreature {Creature}
     * @param sClass {string}
     */
    addLevel (oCreature, sClass) {
        const oClasses = oCreature.store.getLevelByClass
        if (!(sClass in oClasses)) {

        }
    }
}

module.exports = Evolution