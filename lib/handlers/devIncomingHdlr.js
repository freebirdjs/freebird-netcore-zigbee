var _ = require('busyman'),
    zclId = require('zcl-id');

module.exports = function (netcore, eps, permAddr) {
    // listen shepherd event: 'devIncoming'
    var rawDev = eps[0].getDevice().dump();

    netcore.commitDevIncoming(permAddr, rawDev);

    eps.forEach(function (ep) {
        var rawGad = {},
            profId = zclId.profile(ep.getProfId());

        rawGad.profId = profId ? profId.key : ep.getProfId();

        _.forEach(ep.clusters, function (cid, cInfo) {
            var classId = helper.getGadClassId(cid),
                attrs = helper.getGadAttrs(cid, cInfo);

            if (classId) {
                setImmediate(function () {
                    var auxId = classId + '/' + ep.epId + '/' + cid;

                    rawGad.classId = classId;

                    netcore.commitGadIncoming(permAddr, auxId, rawGad);
                });
            }
        });
    });
};
