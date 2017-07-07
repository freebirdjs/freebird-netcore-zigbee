var _ = require('busyman'),
    zclId = require('zcl-id'),
    helper = require('../helper.js'),
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
        classId: auxId[0],
        epId: auxId[1]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getZAttr(ep.devId, attrName);

    if (!attrId)
        return callback(new Error('attrName: ' + attrName + ' not exist.'));

    ep.read(attrId.cid, attrId.attr, function (err, data) {
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
        classId: auxId[0],
        epId: auxId[1]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getZAttr(ep.devId, attrName);

    if (!attrId)
        return callback(new Error('attrName: ' + attrName + ' not exist.'));

    if (attrId.cid === 'genOnOff' && attrName === 'onOff') {
        var cmd = val ? 'on' : 'off';

        ep.functional('genOnOff', cmd, {}, function (err, rsp) {
            if (err)
                callback(err);
            else
                callback(null, val);
        });
    } else if (attrId.cid === 'genLevelCtrl' && attrName === 'dimmer') {
        ep.functional('genLevelCtrl', 'moveToLevel', { level: val, transtime: 0 }, function (err, rsp) {
            if (err)
                callback(err);
            else
                callback(null, val);
        });
    } else {
        attrIdNumber = zclId.attr(attrId.cid, attrId.attr).value;
        attrType = zclId.attrType(attrId.cid, attrId.attr).value;

        ep.foundation(attrId.cid, 'write', [{ attrId: attrIdNumber, dataType: attrType, attrData: val }], function (err, rsp) {
            if (err)
                callback(err);
            else
                callback(null, val);
        });
    }
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
        classId: auxId[0],
        epId: auxId[1]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getZAttr(ep.devId, attrName);

    if (!attrId)
        return callback(new Error('attrName: ' + attrName + ' not exist.'));

    attrIdNumber = zclId.attr(attrId.cid, attrId.attr).value;

    ep.foundation(attrId.cid, 'readReportConfig', [{ direction: 0, attrId: attrIdNumber }], function (err, rsp) {
        if (err) {
            callback(err);
        } else {
            var cfg = {
                pmin: rsp.minRepIntval,
                pmax: rsp.maxRepIntval
            };

            if (rsp.repChange)
                cfg.gt = rsp.repChange;

            callback(null, cfg);
        }
    });
};

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
        classId: auxId[0],
        epId: auxId[1]
    };

    ep = dev.getEndpoint(auxId.epId);
    attrId = helper.getZAttr(ep.devId, attrName);

    if (!attrId)
        return callback(new Error('attrName: ' + attrName + ' not exist.'));

    attrIdNumber = zclId.attr(attrId.cid, attrId.attr).value;
    attrType = zclId.attrType(attrId.cid, attrId.attr).value;

    if (!cfg.pmin || !cfg.pmax) {
        ep.foundation(attrId.cid, 'readReportConfig', [{ direction: 0, attrId: attrIdNumber }]).then(function (rsp) {
            cfg = {
                pmin: cfg.pmin || rsp.minRepIntval,
                pmax: cfg.pmax || rsp.maxRepIntval,
                gt: cfg.gt || rsp.repChange || 0,
            };

            if (cfg.enable) {
                ep.report(attrId.cid, attrId.attr, cfg.pmin, cfg.pmax, cfg.gt, function (err) {
                    if (err)
                        callback(err);
                    else
                        callback(null, true);
                });
            } else {
                ep.report(attrId.cid, attrId.attr, 0, 0xffff, 0, function (err) {
                    if (err)
                        callback(err);
                    else
                        callback(null, true);
                });
            }
        }).fail(function (err) {
            callback(err);
        }).done();
    } else {
        if (cfg.enable) {
            ep.report(attrId.cid, attrId.attr, cfg.pmin, cfg.pmax, cfg.gt || 0, function (err) {
                if (err)
                    callback(err);
                else
                    callback(null, true);
            });
        } else {
            ep.report(attrId.cid, attrId.attr, 0, 0xffff, 0, function (err) {
                if (err)
                    callback(err);
                else
                    callback(null, true);
            });
        }
    }
};

module.exports = gadDrivers;
