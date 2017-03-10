var _ = require('busyman'),
    defs = require('./defs/defs.js');

var helper = {};

helper.getGadClassId = function (cid) {
    return defs[cid] ? defs[cid].oid : undefined;
};

helper.getGadAttrs = function (cid, cInfo) {
    var zAttrs = cInfo.attrs,
        sAttrs = {};

    _.forEach(zAttrs, function (zAttr, val) {
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
