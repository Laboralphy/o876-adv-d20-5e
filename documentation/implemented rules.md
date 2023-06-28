## Abilities

- Strength
- Dexterity
- Constitution
- Intelligence
- Wisdom
- Charisma

## Effects

### ability-bonus 

```javascript
creature.applyEffect('ability-bonus', { 
    ability: 'strength',
    value: 10,
    duration: 5
})
```

## Implementation of rules

### Rule : ability modifier

"To determine an ability modifier without consulting the table, 
subtract 10 from the ability score and then divide the total by 2 
(round down)."

```javascript
creature.store.getters.getAbilityMofifierStrength
creature.store.getters.getAbilityMofifierDexterity
```

### Rule : proficiency bonus

bonus = floor((level - 1) / 4)

Level can never be modified, unlike 3.5 spells (enervation etc..., vampire...)

### Rule : Hitpoints

Pour déterminer le nombre de PV Max on addition les PV Max de
chaque classe.
Pour la première classe, le premier niveau est maximisé en PV

Le nombre de PV par niveau pour une classe est
```
PV = floor((HD + 1) / 2)
```
avec HD = hit dice de la classe



### Rule : Exhaustion

La condition "exhaustion" possède 6 niveau et apporte des malus cumulable à 
chaque niveau

| Level | Effect                                         |
|-------|------------------------------------------------|
| 1     | Disadvantage on ability checks                 |
| 2     | Speed halved                                   |
| 3     | Disadvantage on attack rolls and saving throws |
| 4     | Hit point maximum halved                       |
| 5     | Speed reduced to 0                             |
| 6     | Death                                          |

  
### Rule : Automatic and semiautomatic weapon

Les armes semi-automatiques proposent une attaque à -2, 
pour un bonus de dégât de +50%, pour le prix de 2 munitions

Les armes automatiques proposent une attaque à -4, pour un bonus de dégâts
de +100%, pour le prix de 5 munitions.

### Rule : Spread weapon attribute

Les armes spread font des dégâts additionnel +50% à courte portée, et peuvent toucher
deux adversaires à longue portée sans bonus de dégâts.
