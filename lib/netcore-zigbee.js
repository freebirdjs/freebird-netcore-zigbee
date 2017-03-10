var _ = require('busyman'),
    freebirdBase = require('freebird-base'),
    ZShepherd = require('zigbee-shepherd');

var helper = require('./helper.js'),
    msgHdlrs = require('./handlers/msgHdlrs.js'),
    cookRawDev = require('./components/cookRawDev.js'),
    cookRawGad = require('./components/cookRawGad.js');

module.exports = function (path, opts, name) {
    if (!_.isObject(opts)) {
        name = opts;
        opts = {};
    }

    var netcore,
        ncName = (name || 'freebird-netcore-zigbee'),
        shepherd = new ZShepherd(path, opts),
        drivers = require('./drivers/drivers.js')(shepherd);

    /***********************************************************************/
    /*** Create Netcore                                                  ***/
    /***********************************************************************/
    netcore = freebirdBase.createNetcore(ncName, shepherd, { phy: 'ieee802.15.4', nwk: 'zigbee' });

    netcore._cookRawDev = cookRawDev;
    netcore._cookRawGad = cookRawGad;

    netcore.registerNetDrivers(drivers.net);
    netcore.registerDevDrivers(drivers.dev);
    netcore.registerGadDrivers(drivers.gad);

    /***********************************************************************/
    /*** Event Transducer                                                ***/
    /***********************************************************************/
    shepherd.on('ready', function () {
        netcore.commitReady();  // netcore.enable() inside netcore
    });

    shepherd.on('ind', function (msg) {
        var type = msg.type,
            eps = msg.endpoints,
            data = msg.data;

        switch (type) {
            case 'devIncoming':
                msgHdlrs.devIncoming(netcore, eps, data);
                break;
            case 'devLeaving':
                msgHdlrs.devLeaving(netcore, data);
                break;
            case 'devChange':
                msgHdlrs.devChange(netcore, eps, data);
                break;
            case 'devStatus':
                msgHdlrs.devStatus(netcore, eps, data);
                break;
            case 'attReport':
                msgHdlrs.attReport(netcore, eps, data);
                break;
            default:
                break;
        }
    });

    return netcore;
};
