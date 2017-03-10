module.exports = function (netcore, eps, status) {
    // listen shepherd event: 'devStatus'
    netcore.commitDevNetChanging(eps[0].getIeeeAddr(), { status: status });
};
