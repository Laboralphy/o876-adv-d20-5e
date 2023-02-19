function ampMapperWithOutGetters (amp, getter) {
    return amp
}

function ampMapperWithGetters (amp, getters) {
    return typeof amp === 'number'
        ? amp
        : amp in getters
            ? getters[amp]
            : amp
}

module.exports = { ampMapper: ampMapperWithOutGetters }