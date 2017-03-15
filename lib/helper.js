var _ = require('busyman'),
    defs = require('./defs/defs.js');

var helper = {};

helper.getGadClassId = function (cid) {
    return defs[cid] ? defs[cid].oid : undefined;
};

helper.getGadAttrs = function (cid, zAttrs) {
    var sAttrs = {};  // smartobject Attrs

    _.forEach(zAttrs, function (val, zAttr) {
        var sAttr = defs[cid].rid[zAttr];

        if (sAttr)
            sAttrs[sAttr] = val;
    });

    return sAttrs;
};

helper.getZAttr = function (cid, attr) {
    var validAttr;

    if (!defs[cid])
        return undefined;

    _.forEach(defs[cid].rid, function (zAttr, sAttr) {
        if (attr === sAttr)
            validAttr = zAttr;
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
