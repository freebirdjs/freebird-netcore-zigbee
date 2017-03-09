var devDrivers = {};

/***********************************************/
/*** Mandatory Functions                     ***/
/***********************************************/
devDrivers.start = function (callback) {
    var shepherd = this;
    shepherd.start(callback);
};

devDrivers.stop = function (callback) {
    var shepherd = this;
    shepherd.stop(callback);
};

devDrivers.reset = function (mode, callback) {
    var shepherd = this;
    // netcore reset mode:  0 -> soft, 1 -> hard
    // shepherd reset mode: 0 -> hard, 1 -> soft
    mode = !mode ? 'soft' : 'hard';
    shepherd.reset(mode, callback);
};

devDrivers.permitJoin = function (duration, callback) {
    var shepherd = this;

    duration = Math.floor(duration);

    shepherd.permitJoin(255, function (err) {
        if (err) {
            callback(err);
        } else {
            setTimeout(function () {
                shepherd.permitJoin(0);
            }, duration);
            callback(null, duration);
        }
    });
};

devDrivers.remove = function (permAddr, callback) {
    var shepherd = this;

    shepherd.remove(permAddr, function (err) {
        if (err)
            callback(err);
        else
            callback(null, permAddr);
    });
};

devDrivers.ping = function (permAddr, callback) {
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr),
        timestamp = Date.now(),
        nwkAddr;

    if (dev) {
        nwkAddr = dev.getNwkAddr();
        shepherd.controller.request('ZDO', 'nodeDescReq', { dstaddr: nwkAddr, nwkaddrofinterest: nwkAddr }).then(function (err, rsp) {
            if (err)
                callback(err);
            else
                callback(null, Date.now() - timestamp);
        });
    } else {
        callback(new Error('Device not found.'));
    }
};

/***********************************************/
/*** Optional Functions                      ***/
/***********************************************/
// devDrivers.ban = function (permAddr, callback) {
//     var shepherd = this;
// };

// devDrivers.unban = function (permAddr, callback) {
//     var shepherd = this;
// };

module.exports = devDrivers;
