var _ = require('busyman'),
    zclId = require('zcl-id'),
    helper = require('../helper.js');

module.exports = function (netcore, eps, permAddr) {
    // listen shepherd event: 'devIncoming'
    var rawDev = eps[0].getDevice().dump();

    netcore.commitDevIncoming(permAddr, rawDev);

    eps.forEach(function (ep) {
        var rawGad = {},
            profId = zclId.profile(ep.getProfId());

        rawGad.profId = profId ? profId.key : ep.getProfId();

        _.forEach(ep.clusters.dumpSync(), function (cInfo , cid) {
            var classId = helper.getGadClassId(cid);

            if (classId) {
                var auxId = classId + '/' + ep.epId + '/' + cid;

                rawGad.classId = classId;
                rawGad.attrs = helper.getGadAttrs(cid, cInfo.attrs);

                setImmediate(function () {
                    netcore.commitGadIncoming(permAddr, auxId, rawGad);
                });
            }
        });
    });
};
