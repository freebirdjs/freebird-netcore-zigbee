var _ = require('busyman'),
    zclId = require('zcl-id'),
    helper = require('../helper.js');

module.exports = function (netcore, eps, data) {
    // listen shepherd event: 'devChange'
    var ep = eps[0],
        permAddr = ep.getIeeeAddr(),
        cid = data.cid,
        attrsData = data.data,
        classId,
        auxId,
        attrs = {};

    if (cid === 'genBasic' || cid === 'genPowerCfg') {
        _.forEach(attrsData, function (val, attrName) {
            switch (attrName) {
                case 'manufacturerName':
                    attrs.manufacturer = val;
                    break;
                case 'modelId':
                    attrs.model = val;
                    break;
                case 'dateCode':
                    attrs.serial = val;
                    break;
                case 'hwVersion':
                    attrs.version = attrs.version || {};
                    attrs.version.hw = val;
                    break;
                case 'swBuildId':
                    attrs.version = attrs.version || {};
                    attrs.version.sw = val;
                    break;
                case 'appVersion':
                    attrs.version = attrs.version || {};
                    attrs.version.fw = val;
                    break;
                case 'powerSource':
                    attrs.power = attrs.power || {};
                    attrs.power.type = val;
                    break;
                case 'mainsVoltage':
                case 'batteryVoltage':
                    attrs.power = attrs.power || {};
                    attrs.power.voltage = (val / 10) + ' V';
                    break;
            }
        });

        netcore.commitDevReporting(permAddr, attrs);
    } else {
        classId = helper.getGadClassId(cid);

        if (classId) {
            auxId = classId + '/' + ep.epId + '/' + cid;
            attrs = helper.getGadAttrs(cid, attrsData);

            netcore.commitGadReporting(permAddr, auxId, attrs);
        }
    }
};
