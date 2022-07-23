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