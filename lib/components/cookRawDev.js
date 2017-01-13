module.exports = function (dev, rawDev, callback) {
    var netInfoObj = {
            role: '',
            parent: '0',
            maySleep: false,
            sleepPeriod: 60,
            address: {
                permanent: '',
                dynamic: ''
            }
        },
        devAttrsObj = {
            manufacturer: '',
            model: '',
            serial: '',
            version: {
                hw: '',
                sw: '',
                fw: ''
            },
            power: {
                type: '',
                voltage: ''
            }
        };

    dev.set('net', netInfoObj);
    dev.set('attrs', devAttrsObj);

    callback(null, dev);
};
