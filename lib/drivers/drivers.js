var _ = require('busyman'),
    netDrivers = require('./netDrivers'),
    devDrivers =  require('./devDrivers'),
    gadDrivers = require('./gadDrivers');

var drivers = {
    net: null,
    dev: null,
    gad: null
};

module.exports = function (controller) {
    if (!controller)
        throw new Error('Controller should be given when requiring this module.');

    if (drivers.net === null) {
        drivers.net = {};

        // Mandatory
        drivers.net.start = netDrivers.start.bind(controller);
        drivers.net.stop = netDrivers.stop.bind(controller);
        drivers.net.reset = netDrivers.reset.bind(controller);
        drivers.net.permitJoin = netDrivers.permitJoin.bind(controller);
        drivers.net.remove = netDrivers.remove.bind(controller);
        drivers.net.ping = netDrivers.ping.bind(controller);

        // Optional
        if (_.isFunction(netDrivers.ban))
            drivers.net.ban = netDrivers.ban.bind(controller);
        if (_.isFunction(netDrivers.unban))
            drivers.net.unban =  netDrivers.unban.bind(controller);
    }

    if (drivers.dev === null) {
        drivers.dev = {};

        // Mandatory
        drivers.dev.read = devDrivers.read.bind(controller);
        drivers.dev.write = devDrivers.write.bind(controller);

        // Optional
        if (_.isFunction(devDrivers.identify))
            drivers.dev.identify = devDrivers.identify.bind(controller);
    }

    if (drivers.gad === null) {
        drivers.gad = {};

        // Mandatory
        drivers.gad.read = gadDrivers.read.bind(controller);
        drivers.gad.write = gadDrivers.write.bind(controller);

        // Optional
        if (_.isFunction(gadDrivers.exec))
            drivers.gad.exec = gadDrivers.exec.bind(controller);
        if (_.isFunction(gadDrivers.readReportCfg))
            drivers.gad.readReportCfg = gadDrivers.readReportCfg.bind(controller);
        if (_.isFunction(gadDrivers.writeReportCfg))
            drivers.gad.writeReportCfg = gadDrivers.writeReportCfg.bind(controller);
    }

    return drivers;
};
