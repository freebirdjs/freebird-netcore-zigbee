module.exports = function (netcore, eps, permAddr) {
    // listen shepherd event: 'devIncoming'
    netcore.commitDevIncoming(permAddr, rawDev);
    netcore.commitGadIncoming(permAddr, auxId, rawGad);
};
