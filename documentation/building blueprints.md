# Construire un blueprint

## Une arme

### Liaison avec PLASMUD
Les blueprints ADV d'armes sont à insérer dans la propriété { data: { advd205e: ... } }.

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
Consulter l'objet __publicAssets.strings.weaponType__, dont les clés représentent 
les valeurs valides pour la propriété, tandis que les valeurs de cet objet sont des versions
affichables pouvant aider à concevoir une liste déroulante dans un formulaire. 

#### material
Type de matériau à sélectionner parmis les clé de l'objet __publicAssets.strings.material__.

#### properties
C'est une liste de définitions de propriété.
Consulter __publicAssets.strings.itemProperty__ pour déterminer les différentes item properties 
disponible.

Par exemple pour ajouter une propriété d'altération, et une propriété de bonus aux dégâts :

__publicAssets.data.itemProperty__


### Exemple de blueprint

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
    "amp": "1",
    "type": "DAMAGE_TYPE_FIRE"
  }],
  "material": "MATERIAL_ADAMANTINE"
}
```