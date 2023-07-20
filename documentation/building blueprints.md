# Construire un blueprint

## Fichier public-assets

Ce fichier sera fait référence à plusieurs repris, il contient tous
les renseignements nécessaires à la création de blueprints.

Il sera désigné sous le termes __public-assets__.

Il est disponible dans src/public-assets/public-assets.[lang].json (où [lang] peut être remplacé par "fr" ou "en")?

## Une arme

### Format du blueprint d'arme

Un blueprint d'arme à cet aspect :

```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_WEAPON",
  "weaponType": "weaponType",
  "properties": ["itemProperty"],
  "material": "material"
}
```

Ce JSON est disponible dans __public-assets.templates.weapon__.

#### entityType
Constante valant toujours "ENTITY_TYPE_ITEM".

#### itemType
Constante valant toujours "ITEM_TYPE_WEAPON".

#### weaponType
Consulter l'objet __public-assets.strings.weaponType__, dont les clés représentent 
les valeurs valides pour la propriété weaponType (par exemple _weapon-type-dagger_), 
tandis que les valeurs de cet objet sont des versions
affichables pouvant aider à concevoir une liste déroulante dans un formulaire 
(pour _weapon-type-dagger_ : "dague"). 

#### material
Type de matériau à sélectionner parmi les clés de l'objet __public-assets.strings.material__.

#### properties
C'est une liste de définitions de propriété.
Consulter __public-assets.strings.itemProperty__ pour déterminer les différentes item properties 
disponible.

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

#### Aspect final du formulaire

```
Type d'entité
[X] Objet         [ ] Créature

Type d'objet :
[ Arme ...................+]

Type d'arme :
[ Epée longue ............+] 

Materiau :
[ Adamantium .............+]

Propriétés :

Propriété 1 :                    [suppr.]
   [ Bonus aux dégâts ........+]

   amp: (amplitude)
   [ 1d6+2.................... ]

   type: (damageType)
   [ Feu .....................+]

Propriété 2 :                    [suppr.]
   [ Altération ..............+]

   amp: (amplitude)
   [ 4........................ ]

[ Ajouter propriété ]
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

## Une armure

### Format du blueprint d'armure

Le blueprint d'armure ressemblera beaucoup au blueprint d'arme :

```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_ARMOR",
  "armorType": "armorType",
  "properties": ["itemProperty"],
  "material": "material"
}
```
La seule différence entre un blueprint d'armure et un blueprint d'arme
est le type d'item qui passe de ITEM_TYPE_WEAPON à ITEM_TYPE_ARMOR, et
aussi la propriété "weaponType" qui devient "armorType" et qui acceptera 
des valeurs à piocher dans __public-assets.strings.armorType__

### Rappel des propriétés

#### entityType
Constante valant toujours "ENTITY_TYPE_ITEM".

#### itemType
Constante valant toujours "ITEM_TYPE_ARMOR".

#### weaponType
Consulter l'objet __public-assets.strings.armorType__, dont les clés représentent
les valeurs valides pour la propriété armorType (par exemple _armor-type-leather_),
tandis que les valeurs de cet objet sont des versions
affichables pouvant aider à concevoir une liste déroulante dans un formulaire
(pour _armor-type-leather_ : "armure de cuir").

#### material
Type de matériau à sélectionner parmi les clés de l'objet __public-assets.strings.material__.
Pour une armure on choisi généralement des matériaux de type : fer ou cuir....

#### properties
C'est une liste de définitions de propriété.
Consulter __public-assets.strings.itemProperty__ pour déterminer les différentes item properties
disponible.

### Formulaire et composition du blueprint

A titre d'exemple voici à quoi pourrait ressembler un formulaire de création 
de blueprint d'armure. Ici l'exemple d'une Armure de cuir +2.

```
Type d'entité
[X] Objet         [ ] Créature

Type d'objet :
[ Armure .................+]

Type d'armure :
[ Armure de cuir..........+] 

Materiau :
[ Cuir ...................+]

Propriétés :

Propriété 1 :                    [suppr.]
   [ Bonus d'armure ........+]

   amp: (amplitude)
   [ 2.................... ]

[ Ajouter propriété ]
```

Le principe est donc le même que pour les armes (voir plus haut).

### Blueprint final

Le blueprint final de l'armure d ecuir +2 serai le suivant :

```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_ARMOR",
  "weaponType": "weapon-type-lether",
  "properties": [{
    "property": "ITEM_PROPERTY_AC_BONUS",
    "amp": 2
  }],
  "material": "MATERIAL_LEATHER"
}
```

## Un bouclier

Très proche d'une armure, le blueprint d'un bouclier est quasiment semblable, 
à quelques détails près :

```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_SHIELD",
  "shieldType": "shieldType",
  "properties": ["itemProperty"],
  "material": "material"
}
```

La propriété "itemType" devient "ITEM_TYPE_SHIELD".
La propriété "armorType" change et devient "shieldType" et accepte comme valeur
un élément de __public-assets.strings.shieldType__.

Tout le reste est similaire à la définition d'une armure.

## Des munitions

Très proche d'une arme, le blueprint de munition diffère de quelques détails.

Voici le format attendu pour un blueprint de munition :

```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_AMMO",
  "ammoType": "ammoType",
  "properties": ["itemProperty"],
  "material": "material"
}
```


## Autres objets d'équipement

Tous les objets d'équipement partagent le même format de blueprint. Seule la valeur
de la propriété "itemType" change.

### Format du blueprint d'un objet d'équipment

```json
{
  "entityType": "ENTITY_TYPE_ITEM",
  "itemType": "ITEM_TYPE_NECKLACE",
  "properties": ["itemProperty"]
}
```

Ici il s'agit d'un collier "ITEM_TYPE_NECKLACE".

Il y a bien d'autres types d'item, autres que ITEM_TYPE_NECKLACE. 
Chaque type d'item se porte sur un emplacement d'équipement different.

En voici la liste :

| Type d'item      | itemType                 | slot d'équipement |
|------------------|--------------------------|------------------ |
| Casque/chapeau   | ITEM_TYPE_HELM           | EQUIPMENT_SLOT_HEAD |
| Collier/amulette | ITEM_TYPE_NECKLACE       | EQUIPMENT_SLOT_NECK |
| Manteau/cape     | ITEM_TYPE_CLOAK          | EQUIPMENT_SLOT_BACK |
| Gantelets         | ITEM_TYPE_GAUNTLETS         | EQUIPMENT_SLOT_ARMS |
| Gantelet         | ITEM_TYPE_GLOVES         | EQUIPMENT_SLOT_ARMS |
| Anneau/bague     | ITEM_TYPE_RING           | EQUIPMENT_SLOT_LEFT_FINGER / EQUIPMENT_SLOT_RIGHT_FINGER |
| Ceinturon        | ITEM_TYPE_BELT           | EQUIPMENT_SLOT_WAIST |
| Bottes           | ITEM_TYPE_BOOTS          | EQUIPMENT_SLOT_FEET |
| Torche           | ITEM_TYPE_TORCH          | EQUIPMENT_SLOT_SHIELD |

