var devDrivers = {};

devDrivers.read = function (permAddr, attrName, callback) {
    // callback(err, data)
    // data: value read (Type denpends, ex: 'hello', 12, false)
    var shepherd = this;
    // attrs: {
    //     manufacturer: 'freebird',                               // String
    //     model: 'lwmqn-7688-duo',                                // String
    //     serial: 'lwmqn-2016-03-15-01',                          // String
    //     version: { hw: 'v1.2.0', sw: 'v0.8.4', fw: 'v2.0.0' },  // Object
    //     power: { type: 'line', voltage: '5V' }                  // Object
    // }
};

devDrivers.write = function (permAddr, attrName, val, callback) {
    var shepherd = this;
};

devDrivers.identify = function (permAddr, callback) {
    var shepherd = this;
};

module.exports = devDrivers;
