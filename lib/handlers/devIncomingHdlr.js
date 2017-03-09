module.exports = function (netcore, eps, permAddr) {
    // listen shepherd event: 'devIncoming'
    var rawDev = eps[0].getDevice().dump();

    netcore.commitDevIncoming(permAddr, rawDev);

    eps.forEach(function (ep) {
        var rawGad;

    });
    netcore.commitGadIncoming(permAddr, auxId, rawGad);

};
