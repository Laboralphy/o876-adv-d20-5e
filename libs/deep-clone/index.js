function cloneArray (aArray) {
  return aArray.map(cloneItem)
}

function cloneObject (oObject) {
  const oOutput = {}
  for (const sKey in oObject) {
    if (Object.prototype.hasOwnProperty.call(oObject, sKey)) {
      oOutput[sKey] = cloneItem(oObject[sKey])
    }
  }
  return oOutput
}

function cloneItem (oItem) {
  switch (typeof oItem) {
    case 'object':
      if (Array.isArray(oItem)) {
        return cloneArray(oItem)
      } else if (oItem === null) {
        return null
      } else {
        return cloneObject(oItem)
      }

    case 'number':
    case 'string':
    case 'boolean':
      return oItem
  }
}

module.exports = cloneItem
