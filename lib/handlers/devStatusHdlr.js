module.exports = function (netcore, eps, status) {
    // listen shepherd event: 'devStatus'
    netcore.commitDevNetChanging(permAddr, { status: status });
};
