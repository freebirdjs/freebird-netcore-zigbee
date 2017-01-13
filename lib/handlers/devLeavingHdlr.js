module.exports = function (netcore, permAddr) {
    // listen shepherd event: 'devLeaving'
    netcore.commitDevLeaving(permAddr);
};
