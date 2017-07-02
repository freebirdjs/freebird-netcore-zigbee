var _ = require('busyman'),
    defs = require('./defs/defs.js');

var helper = {};

helper.getGadClassId = function (devId) {
    return defs[devId] ? defs[devId].oid : undefined;
};

helper.getGadAttrs = function (devId, clusters) {
    var sAttrs = {};  // smartobject Attrs

    if (!defs[devId])
        return undefined;

    _.forEach(defs[devId].rid, function (zAttr, sAttr) {
        zAttr = _.split(zAttr, ':');
        zAttr = {
            cid: zAttr[0],
            attr: zAttr[1]
        };

        try {
            zAttrVal = clusters[zAttr.cid].attrs[zAttr.attr];
            sAttrs[sAttr] = zAttrVal;
        } catch(e) {}
    });

    return sAttrs;
};

helper.getZAttr = function (devId, attr) {
    var validAttr = {
        cid: null,
        attr: null
    };

    if (!defs[devId])
        return undefined;

    _.forEach(defs[devId].rid, function (zAttr, sAttr) {
        if (attr === sAttr) {
            zAttr = _.split(zAttr, ':');
            validAttr.cid = zAttr[0];
            validAttr.attr = zAttr[1];
        }
    });

    return validAttr;
};

helper.getPwrSrc = function (pwrSrc) {
    pwrSrc = pwrSrc & 0x7F;

    if (pwrSrc === 0x00)
        return '';
    else if (pwrSrc === 0x03)
        return 'battery';
    else
        return 'line';
};

module.exports = helper;
