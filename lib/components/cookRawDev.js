var helper = require('../helper.js');

module.exports = function (dev, rawDev, callback) {
    var netInfoObj = {
            role: rawDev.type,  // 'Router', 'EndDevice'
            parent: '0',        // [TODO] ZDO_TC_DEV_IND
            address: {
                permanent: rawDev.ieeeAddr,
                dynamic: rawDev.nwkAddr
            }
        },
        devAttrsObj = {
            manufacturer: '',
            model: '',
            serial: '',
            version: {
                hw: '',
                sw: '',
                fw: ''
            },
            power: {
                type: '',
                voltage: ''
            }
        };

    var epId = rawDev.epList[0],
        epInfo = rawDev.endpoints[epId];

    if (epInfo) {
        var basicAttrs = epInfo.clusters.genBasic.attrs,
            powerCfgAttrs = epInfo.clusters.hasOwnProperty('genPowerCfg') ? epInfo.clusters.genPowerCfg.attrs : undefined;

        devAttrsObj = {
            manufacturer: basicAttrs.manufacturerName || '',
            model: basicAttrs.modelId || '',
            serial: basicAttrs.dateCode || '',
            version: {
                hw: basicAttrs.hwVersion ? basicAttrs.hwVersion.toString() : '',
                sw: basicAttrs.swBuildId ? basicAttrs.swBuildId : '',
                fw: basicAttrs.appVersion ? basicAttrs.appVersion.toString() : ''
            },
            power: {
                type: basicAttrs.powerSource ? helper.getPwrSrc(basicAttrs.powerSource) : '',
                voltage: ''
            }
        };

        if (powerCfgAttrs) {
            var volt = powerCfgAttrs.mainsVoltage || powerCfgAttrs.batteryVoltage;
            if (volt)
                devAttrsObj.power.voltage = (volt / 10) + ' V';
        }
    }

    dev.set('net', netInfoObj);
    dev.set('attrs', devAttrsObj);

    callback(null, dev);
};
