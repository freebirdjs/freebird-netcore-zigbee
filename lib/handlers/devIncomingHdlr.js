var _ = require('busyman'),
    zclId = require('zcl-id'),
    helper = require('../helper.js');

module.exports = function (netcore, eps, permAddr) {
    // listen shepherd event: 'devIncoming'
    var rawDev = eps[0].getDevice().dump();

    netcore.commitDevIncoming(permAddr, rawDev);

    eps.forEach(function (ep) {
        var rawGad = {},
            profId = zclId.profile(ep.getProfId()),
            classId = helper.getGadClassId(ep.devId);

        profId = profId ? profId.key : ep.getProfId();

        if (classId) {
            var auxId = classId + '/' + ep.epId;

            rawGad.profId = profId;
            rawGad.classId = classId;
            rawGad.attrs = helper.getGadAttrs(ep.devId, ep.clusters.dumpSync());

            setImmediate(function () {
                netcore.commitGadIncoming(permAddr, auxId, rawGad);
            });
        }
        
    });
};
