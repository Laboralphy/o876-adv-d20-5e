/**
 * @param data {D20AdvantagesOrDisadvantages}
 * @returns {D20AdvantagesOrDisadvantages}
 */
function computeValues (data) {
    for (const [sRollType, d1] of Object.entries(data)) {
        for (const [sOrigin, d2] of Object.entries(d1)) {
            for (const [sMetric, d3] of Object.entries(d2)) {
                d3.value = Object.values(d3.rules).reduce((prev, curr) => prev || curr, false)
            }
        }
    }
    return data
}
/**
 * Etabli la liste des avantages
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    /*
    Commencer par définir les règles.
    Ces règles permettront au système d'afficher pour quelles raisons on bénéficie ou pas d'un avantage
     */
    const TARGET_CANNOT_SEE_ME = !getters.canTargetSeeMe
    /*
    Définir l'ossature D20AdvantagesOrDisadvantages
     */
    return computeValues({
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: {
                rules: {
                    TARGET_CANNOT_SEE_ME
                },
                value: false
            },
            ABILITY_DEXTERITY: {
                rules: {
                    TARGET_CANNOT_SEE_ME
                },
                value: false
            },
            ABILITY_CONSTITUTION: {
                rules: {
                    TARGET_CANNOT_SEE_ME
                },
                value: false
            },
            ABILITY_INTELLIGENCE: {
                rules: {
                    TARGET_CANNOT_SEE_ME
                },
                value: false
            },
            ABILITY_WISDOM: {
                rules: {
                    TARGET_CANNOT_SEE_ME
                },
                value: false
            },
            ABILITY_CHARISMA: {
                rules: {
                    TARGET_CANNOT_SEE_ME
                },
                value: false
            }
        },
        ROLL_TYPE_SAVE: {
            ABILITY_STRENGTH: {
                rules: {
                },
                value: false
            },
            ABILITY_DEXTERITY: {
                rules: {
                },
                value: false
            },
            ABILITY_CONSTITUTION: {
                rules: {
                },
                value: false
            },
            ABILITY_INTELLIGENCE: {
                rules: {
                },
                value: false
            },
            ABILITY_WISDOM: {
                rules: {
                },
                value: false
            },
            ABILITY_CHARISMA: {
                rules: {
                },
                value: false
            }
        },
        ROLL_TYPE_SKILL: {
            ABILITY_STRENGTH: {
                rules: {
                },
                value: false
            },
            ABILITY_DEXTERITY: {
                rules: {
                },
                value: false
            },
            ABILITY_CONSTITUTION: {
                rules: {
                },
                value: false
            },
            ABILITY_INTELLIGENCE: {
                rules: {
                },
                value: false
            },
            ABILITY_WISDOM: {
                rules: {
                },
                value: false
            },
            ABILITY_CHARISMA: {
                rules: {
                },
                value: false
            },
            SKILL_STEALTH: {
                rules: {
                },
                value: false
            }
        }
    })
}
