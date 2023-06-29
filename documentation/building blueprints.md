# Construire un blueprint

## Fichier public-assets

Ce fichier est fait référence de nombreuse fois, il contient tous
les renseignements nécessaires à la création de blueprints.

il sera désigné sous le termes __public-assets__.

## Une arme

### Format du blueprint
```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_WEAPON",
  "weaponType": "weaponType",
  "properties": ["itemProperty"],
  "material": "material"
}
```

#### entityType
Constante valant toujours "ENTITY_TYPE_ITEM"

#### itemType
Constante valant toujours "ITEM_TYPE_WEAPON"

#### weaponType
Consulter l'objet __public-assets.strings.weaponType__, dont les clés représentent 
les valeurs valides pour la propriété, tandis que les valeurs de cet objet sont des versions
affichables pouvant aider à concevoir une liste déroulante dans un formulaire. 

#### material
Type de matériau à sélectionner parmi les clés de l'objet __public-assets.strings.material__.

#### properties
C'est une liste de définitions de propriété.
Consulter __public-assets.strings.itemProperty__ pour déterminer les différentes item properties 
disponible.

__public-assets.data.itemProperty__


### Exemple de blueprint

La création d'une arme devrait se faire à l'aide d'un formulaire
de ce type :

```
Type d'entité
[X] Objet         [ ] Créature

Type d'objet :
[ Arme (ITEM_TYPE_WEAPON) +]

Type d'arme :
[.........................+] 
(voir public-assets.strings.weaponType)

Materiau :
[.........................+]
(voir public-assets.strings.material)

Propriétés :
[.........................+] [Ajouter] [Suppr.]
(voir public-assets.strings.itemProperty)
--- partie du formulaire variable en fonction de la proriété --
```

#### Exemples d'ajout de propriété

Les propriétés ont chacune leur propre ensemble de paramètres.
Si on choisit __ITEM_PROPERTY_DAMAGE_BONUS__ alors :
1) on consulte __public-assets.strings.itemProperty.ITEM_PROPERTY_DAMAGE_BONUS__ pour déterminer le nom affichable "Bonus aux dégâts"
2) On cherche dans __public-assets.data.itemProperty.ITEM_PROPERTY_DAMAGE_BONUS__ pour savoir quels sont les paramètres requis de cette propriété.
3) On voit que la propriété réclame deux paramètres : "amp" (de type "dice"), et "type" (de type "damageType")
4) Le type "dice" est une chaîne de caractère d'un certain format (par exemple "1d6", "1d8", "2d4", "1d6+2", "2", sont des valeurs valides pour un paramètre de type "dice")
5) Le type "damgeType" est à rechercher dans __public-assets.strings.damageType__ cela conduit à contruire une liste de sélection pour proposer la saisie de la valeur du paramètre correspondant ("type")

Cela mène à la composition du formulaire suivant :
```
Propriété :
[ Bonus aux dégâts ........+] (id: ITEM_PROPERTY_DAMAGE_BONUS)

amp: (amplitude)
[ 1d6+2.................... ] (chaîne au format 1d6+2 par ex.)

type: (damageType)
[ Feu .....................+] (id: DAMAGE_TYPE_FIRE)
```

et produira le json suivant, à intégrer au blueprint de l'arme :

```json
{
  "property": "ITEM_PROPERTY_DAMAGE_BONUS",
  "amp": "1d6+2",
  "type": "DAMAGE_TYPE_FIRE"
}
```

On ajoutera cette structure dans la liste des "properties" du blueprint.

#### Autre exemple

On choisit d'ajouter une propriété supplémentaire : ITEM_PROPERTY_ENHANCEMENT
qui rend l'arme plus puissante et précise.

1) on consulte __public-assets.strings.itemProperty.ITEM_PROPERTY_ENHANCEMENT__ pour déterminer le nom affichable "Bonus d'altération"
2) On cherche dans __public-assets.data.itemProperty.ITEM_PROPERTY_ENHANCEMENT__ pour savoir quels sont les paramètres requis de cette propriété.
3) On voit que la propriété ne réclame qu'un paramètre : "amp" (de type "number" cette fois)
4) Le type "number" est juste un nombre (entier)

Cela mène à la composition du formulaire suivant :
```
Propriété :
[ Bonus aux dégâts ........+] (id: ITEM_PROPERTY_DAMAGE_BONUS)

amp: (amplitude)
[ 4........................ ] (nombre)
```

cela donnera :
```json
{
  "property": "ITEM_PROPERTY_ENHANCEMENT",
  "amp": 4
}
```

#### Blueprint final :

En combinant toutes les parties on obtient le blueprint complet :

```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_WEAPON",
  "weaponType": "weapon-type-longsword",
  "properties": [{
    "property": "ITEM_PROPERTY_ENHANCEMENT",
    "amp": 4
  }, {
    "property": "ITEM_PROPERTY_DAMAGE_BONUS",
    "amp": "1d6+2",
    "type": "DAMAGE_TYPE_FIRE"
  }],
  "material": "MATERIAL_ADAMANTINE"
}
```

Ce blueprint peut être intégré aux data du blueprint PLASMUD.
