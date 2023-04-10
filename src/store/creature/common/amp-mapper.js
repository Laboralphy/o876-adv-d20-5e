function ampMapperWithOutGetters (amp, getters) {
    return amp
}

function ampMapperWithGetters (amp, getters) {
    return typeof amp === 'number'
        ? amp
        : amp in getters
            ? getters[amp]
            : amp
}

module.exports = { ampMapper: ampMapperWithGetters }