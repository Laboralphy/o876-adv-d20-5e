const deepClone = require('../deep-clone')

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject (item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
function mergeDeep (target, source) {
  if (isObject(target) && isObject(source)) {
    for (const [key, item] of Object.entries(source)) {
      if (isObject(item)) {
        if (!(key in target)) {
          Object.assign(target, { [key]: {} })
        }
        mergeDeep(target[key], item)
      } else if (Array.isArray(item)) {
        if (!(key in target)) {
          target[key] = []
        }
        item.forEach(x => target[key].push(deepClone(x)))
      } else {
        Object.assign(target, { [key]: item })
      }
    }
  }
  return target
}

module.exports = mergeDeep
