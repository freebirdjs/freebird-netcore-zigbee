var zclId = require('zcl-id'),
    gadDrivers = {};

/***********************************************/
/*** Mandatory Functions                     ***/
/***********************************************/
gadDrivers.read = function (permAddr, auxId, attrName, callback) {
    // callback(err, data)
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr),
        ep,
        attrId;

    if (!dev)
        return callback(new Error('Device not found.'));

    auxId = _.split(auxId, '/');
    auxId = {
        epId: auxId[0],
        type: auxId[1],
        cid: auxId[2],
        rid: auxId[3]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getAttrid(auxId.cid, attrName);

    ep.read(auxId.cid, attrId, function (err, data) {
        if (err)
            callback(err);
        else
            callback(null, data);
    });
};

gadDrivers.write = function (permAddr, auxId, attrName, val, callback) {
    // callback(err, data)
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr),
        ep,
        attrId,
        attrIdNumber,
        attrType;

    if (!dev)
        return callback(new Error('Device not found.'));

    auxId = _.split(auxId, '/');
    auxId = {
        epId: auxId[0],
        type: auxId[1],
        cid: auxId[2],
        rid: auxId[3]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getAttrid(auxId.cid, attrName);
    attrIdNumber = zclId.attr(auxId.cid, attrId).value;
    attrType = zclId.attrType(auxId.cid, attrId).value;

    ep.foundation(auxId.cid, 'write', [{ attrId: attrIdNumber, dataType: attrType, attrData: val }], function (err, rsp) {
        if (err)
            callback(err);
        else
            callback(null, val);
    });
};

/***********************************************/
/*** Optional Functions                      ***/
/***********************************************/
// gadDrivers.exec = function (permAddr, auxId, attrName, args, callback) {
//     // callback(err, data)
//     var shepherd = this;
// };

gadDrivers.readReportCfg = function (permAddr, auxId, attrName, callback) {
    // callback(err, data)
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr),
        ep,
        attrId,
        attrIdNumber;

    if (!dev)
        return callback(new Error('Device not found.'));

    auxId = _.split(auxId, '/');
    auxId = {
        epId: auxId[0],
        type: auxId[1],
        cid: auxId[2],
        rid: auxId[3]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getAttrid(auxId.cid, attrName);
    attrIdNumber = zclId.attr(auxId.cid, attrId).value;

    ep.foundation(auxId.cid, 'readReportConfig', [{ direction: 0, attrId: attrIdNumber }], function (err, rsp) {
        if (err) {
            callback(err);
        } else {
            var cfg = {
                pmin: rsp.minRepIntval,
                pmax: rsp.maxRepIntval
            };

            if (cfg.repChange)
                cfg.gt = rsp.repChange;

            callback(null, cfg);
        }
    });
};
// { status, direction, attrId }
// { dataType, minRepIntval, maxRepIntval, [repChange] }

gadDrivers.writeReportCfg = function (permAddr, auxId, attrName, cfg, callback) {
    // callback(err, data)
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr),
        ep,
        attrId,
        attrIdNumber;

    if (!dev)
        return callback(new Error('Device not found.'));

    auxId = _.split(auxId, '/');
    auxId = {
        epId: auxId[0],
        type: auxId[1],
        cid: auxId[2],
        rid: auxId[3]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getAttrid(auxId.cid, attrName);
    attrIdNumber = zclId.attr(auxId.cid, attrId).value;
    attrType = zclId.attrType(auxId.cid, attrId).value;

    if (!cfg.pmin || !cfg.pmax) {
        ep.foundation(auxId.cid, 'readReportConfig', [{ direction: 0, attrId: attrIdNumber }]).then(function (rsp) {
            cfg = {
                pmin: cfg.pmin || rsp.minRepIntval,
                pmax: cfg.pmax || rsp.maxRepIntval,
                gt: cfg.gt || rsp.repChange || 0,
            };

            if (cfg.enable) {
                ep.report(auxId.cid, attrId, cfg.pmin, cfg.pmax, cfg.gt, function (err) {
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            } else {
                ep.report(auxId.cid, attrId, 0, 0xffff, 0, function (err) {
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        }).fail(function (err) {
            callback(err);
        }).done();
    } else {
        if (cfg.enable) {
            ep.report(auxId.cid, attrId, cfg.pmin, cfg.pmax, cfg.gt || 0, function (err) {
                if (err)
                    callback(err);
                else
                    callback(null);
            });
        } else {
            ep.report(auxId.cid, attrId, 0, 0xffff, 0, function (err) {
                if (err)
                    callback(err);
                else
                    callback(null);
            });
        }
    }
};

module.exports = gadDrivers;
