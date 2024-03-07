# Creature events

## liste des évènements

 Evènement                       | Paramètres                                          | Description
---------------------------------|-----------------------------------------------------|----------------------------------
 spellcast-concentration-end     | caster, spell, reason                               | La concentration est interrompue 
 change-id                       | creature, newId, oldId                              | La créature change d'identifiant 
 target-distance                 | _value_, creature, target                           | Demande à l'application client de renseigner la distance entre la creature et sa cible spécifiée 
 effect-applied                  | effect, target, source                              | Un nouvel effet est appliqué sur la créature
 damaged                         | type, amount, source, resisted                      | La créature subit des dégâts
 death                           | killer, effect                                      | La créature meurt
 check-skill                     | outcome                                             | Un jet de compétence à été lancé
 saving-throw                    | output                                              | Un jet de sauvegarde a été effectué
 action                          | action                                              | une action a été effectuée
 offensive-slot                  | previous { slot, weapon }, current { slot, weapon } | La créature change d'équipement offensif pour attaquer (ex: passer de l'arc à l'épée)
 attack                          | outcome                                             | La créature effectue une attaque sur sa cible
 summon-creature                 | ref, level, creature                                | La créature réaclame l'invocation d'un thrall

