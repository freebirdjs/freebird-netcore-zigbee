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
        attrs;

    if (cid === 'genBasic' || cid === 'genPowerCfg') {
        attrs = helper.getDevAttrs(cid, attrsData);
        netcore.commitDevReporting(permAddr, devAttrs);
    } else {
        classId = helper.getGadClassId(cid);

        if (classId) {
            auxId = classId + '/' + ep.epId + '/' + cid;
            attrs = helper.getGadAttrs(cid, attrsData);

            netcore.commitGadReporting(permAddr, auxId, attrs);
        }
    }
};
