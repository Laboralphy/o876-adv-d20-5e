# Spellcast events

Liste des évènements émits par la classe SpellCast.

### spell-ranged-attack

Déclenché lorsque qu'un sort nécessite le calcul d'une attaque à distance. Écouter cet évènement permet
d'indiquer si le projectile du sort atteint ou rate sa cible.

#### Paramètres

- **caster** : {Creature} qui lance le sort.
- **target** : {Creature} cible sur qui le sort est lancé.
- **hit** : {boolean} true indique que le project touche la cible
- **ability** : {string} Caractéristique utilisée pour l'attaque à distance
- **abilityModifier** : {number} bonus de caractéristique
- **roll** : {number} valeur du dé d'attaque
- **circumstances** : {number} 1 avantage, -1 désavantage, 0 rien
- **attack** : jet d'attaque total
- **ac** : {number} Classe d'armure adverse


### spellcast-concentration-end

Déclenché lorsqu'un sort de concentration se termine.

#### Paramètres

- **caster** : {Creature} qui lance le sort.
- **spell** : {string} référence du sort
- **reason** : {string} Raison pour laquelle la concentration se termine
  - CONCENTRATION_CHANGE : La concentration se termine parce qu'une autre commence.

### spellcast-concentration

Déclenché lorsqu'un sort de concentration démarre.

#### Paramètres

- **caster** : {Creature} qui lance le sort.
- **spell** : {string} référence du sort

### spellcast

Déclenché lorsqu'une créature lance un sort.

#### Paramètres

- **caster** : {Creature} qui lance le sort.
- **spell** : {string} Référence du sort lancé.
- **level** : {number} Niveau de slot lancé.

### spellcast-at

Déclenché lorsqu'une créature devient la cible d'un sort.

#### Paramètres

- **caster** : {Creature} qui lance le sort.
- **spell** : {string} Référence du sort lancé.
- **level** : {number} Niveau de slot lancé.
