var _ = require('busyman'),
    zclId = require('zcl-id'),
    devDrivers = {};

/***********************************************/
/*** Mandatory Functions                     ***/
/***********************************************/
devDrivers.read = function (permAddr, attrName, callback) {
    // callback(err, data)
    // data: value read (Type denpends, ex: 'hello', 12, false)
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr),
        attrKeys = [ 'manufacturer', 'model', 'serial', 'version', 'power' ],
        basicAttrs,
        powerCfgAttrs,
        data,
        epId,
        ep;

    if (!_.includes(attrKeys, attrName))
        return callback(new Error('attrName: ' + attrName + ' not exist.'));
    else if (!dev)
        return callback(new Error('Device not found.'));

    epId = dev.epList[0];
    ep = dev.getEndpoint(epId);

    ep.foundation('genBasic', 'read', [ { attrId: 1 }, { attrId: 3 }, { attrId: 4 }, { attrId: 5 }, { attrId: 6 }, { attrId: 7 }, { attrId: 16384 } ], function (err, rsp) {
        if (err)
            return callback(err);

        _.forEach(rsp, function (rec) {    // { attrId, status, dataType, attrData }
            var attrIdString = zclId.attr('genBasic', rec.attrId).key;

            basicAttrs[attrIdString] = (rec.status === 0) ? rec.attrData : null;
        });

        switch (attrName) {
            case 'manufacturer':
                data = basicAttrs.manufacturerName || '';
                break;
            case 'model':
                data = basicAttrs.modelId || '';
                break;
            case 'serial':
                data = basicAttrs.dateCode || '';
                break;
            case 'version':
                data = {
                    hw: basicAttrs.hwVersion || '',
                    sw: basicAttrs.swBuildId || '',
                    fw: basicAttrs.appVersion || ''
                };
                break;
            case 'power':
                ep.foundation('genPowerCfg', 'read', [ { attrId: 0 }, { attrId: 32 } ], function (err, rsp) {
                    var volt = '';

                    if (err)
                        return callback(err);

                    _.forEach(rsp, function (rec) {  // { attrId, status, dataType, attrData }
                        var attrIdString = zclId.attr('genPowerCfg', rec.attrId).key;

                        powerCfgAttrs[attrIdString] = (rec.status === 0) ? rec.attrData : null;
                    });

                    if (volt = powerCfgAttrs.mainsVoltage || powerCfgAttrs.batteryVoltage)
                        volt = (volt / 10) + ' V';

                    data = {
                        type: getPwrSrc(basicAttrs.powerSource) || '',
                        voltage: volt
                    };

                    callback(null, data);
                });
                break;
        }

        if (attrName !== 'power')
            callback(null, data);
    });
};

devDrivers.write = function (permAddr, attrName, val, callback) {
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr);

    if (dev)
        callback(new Error('Device attribute ' + attrName + ' is read-only.'));
    else
        callback(new Error('Device not found.'));
};

/***********************************************/
/*** Optional Functions                      ***/
/***********************************************/
devDrivers.identify = function (permAddr, callback) {
    var shepherd = this,
        dev = shepherd._findDevByAddr(permAddr),
        epId,
        ep;

    if (!dev)
        return callback(new Error('Device not found.'));

    epId = dev.epList[0];
    ep = dev.getEndpoint(epId);

    if (ep.clusters.has('genIdentify')) {
        ep.functional('genIdentify', 'identify', { identifytime: 30 }, function (err, rsp) {
            if (err)
                callback(err);
            else
                callback(null, permAddr);
        });
    } else {
        callback(new Error('Device not has identify capability.'));
    }
};

function getPwrSrc(pwrSrc) {
    pwrSrc = pwrSrc & 0x7F;

    if (pwrSrc === 0x00)
        return '';
    else if (pwrSrc === 0x03)
        return 'battery';
    else
        return 'line';
}

module.exports = devDrivers;
