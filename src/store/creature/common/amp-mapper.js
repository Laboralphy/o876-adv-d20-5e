function ampMapper (amp, getters) {
    return typeof amp === 'number'
        ? amp
        : amp in getters
            ? getters[amp]
            : amp
}

module.exports = { ampMapper }