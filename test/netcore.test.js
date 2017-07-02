var _ = require('busyman'),
    Q = require('q'),
    chai = require('chai'),
    Ziee = require('ziee'),
    sinon = require('sinon'),
    expect = require('chai').expect,
    FBase = require('freebird-base');

var helper = require('../lib/helper.js'),
    createZigbeeCore = require('../index.js'),
    msgHdlrs = require('../lib/handlers/msgHdlrs.js'),
    Device = require('../node_modules/zigbee-shepherd/lib/model/device.js'),
    Endpoint = require('../node_modules/zigbee-shepherd/lib/model/endpoint.js');

var zbCore = createZigbeeCore('/dev/ttyACM0', 'my_zigbee_core');

var rawDev = {
    id: 0,
    type: 'Router',
    ieeeAddr: '0x00124b0001ce4beb',
    nwkAddr: 55688,
    manufId: 0,
    epList: [ 8 ],
    status: 'online',
    joinTime: 1469528238,
    endpoints: {
        '8': {
            profId: 260,
            epId: 8,
            devId: 0,
            inClusterList: [ 0, 1, 3 ],
            outClusterList: [ 3, 6 ],
            clusters: {
                genBasic: {
                    dir: { value: 1 },
                    attrs: {
                        hwVersion: 0,
                        manufacturerName: 'TexasInstruments',
                        modelId: 'TI0001          ',
                        dateCode: '20060831        ',
                        powerSource: 1,
                        locationDesc: '                ',
                        physicalEnv: 0,
                        deviceEnabled: 1
                    }
                },
                genPowerCfg: {
                    dir: { value: 1 },
                    attrs: { batteryVoltage: 30 }
                },
                genIdentify: {
                    dir: { value: 3 },
                    attrs: { identifyTime: 0 }
                },
                genOnOff:{
                    dir: { value: 2 },
                    attrs: { onOff: 0 }
                }
            }
        }
    }
};

var rawGad = {
    profId: 'HA',
    classId: helper.getGadClassId('smartPlug', 'genOnOff'),
    auxId: 'actuation/8/genOnOff',
    attrs: {
        onOff: 0
    }
};

var zb_dev = new Device({
        type: rawDev.type,
        ieeeAddr: rawDev.ieeeAddr,
        nwkAddr: rawDev.nwkAddr,
        manufId: rawDev.manufId,
        epList: rawDev.epList
    }),
    zb_ep_8 = new Endpoint(zb_dev, {
        profId: 260,
        epId: 8,
        devId: 81,
        inClusterList: [ 0, 1, 3 ],
        outClusterList: [ 3, 6 ]
    });

zb_ep_8.foundation = function () {};
zb_ep_8.functional = function () {};
zb_ep_8.read = function () {};
zb_ep_8.report = function () {};

zb_ep_8.clusters = new Ziee();
zb_ep_8.clusters.init('genBasic', 'attrs', {
    hwVersion: 0,
    manufacturerName: 'TexasInstruments',
    modelId: 'TI0001          ',
    dateCode: '20060831        ',
    powerSource: 1,
    locationDesc: '                ',
    physicalEnv: 0,
    deviceEnabled: 1
});
zb_ep_8.clusters.init('genPowerCfg', 'attrs', {
    batteryVoltage: 30
});
zb_ep_8.clusters.init('genIdentify', 'attrs', {
    identifyTime: 0
});
zb_ep_8.clusters.init('genOnOff', 'attrs', {
    onOff: 0
});
zb_dev.endpoints[8] = zb_ep_8;


var controller = zbCore._controller,
    dev = FBase.createDevice(zbCore, rawDev),
    gad = FBase.createGadget(dev, rawGad.auxId, rawGad);

describe('Cook Functional Check', function() {
    it('cookRawDev()', function (done) {
        zbCore.cookRawDev(dev, rawDev, function (err, brewedDev) {
            var netInfo = {
                    enabled: false,
                    joinTime: null,
                    timestamp: null,
                    traffic: { in: { hits: 0, bytes: 0 }, out: { hits: 0, bytes: 0 } },
                    role: 'Router',
                    parent: '0',
                    maySleep: false,
                    sleepPeriod: 30,
                    status: 'unknown',
                    address: { permanent: '0x00124b0001ce4beb', dynamic: 55688 }
                },
                attrInfo = {
                    manufacturer: 'TexasInstruments',
                    model: 'TI0001          ',
                    serial: '20060831        ',
                    version: { hw: '', sw: '', fw: '' },
                    power: { type: 'line', voltage: '3 V' }
                };

            if (!err && _.isEqual(brewedDev.get('net'), netInfo) && _.isEqual(brewedDev.get('attrs'), attrInfo))
                done();
        });
    });

    it('cookRawGad()', function (done) {
        zbCore.cookRawGad(gad, rawGad, function (err, brewedGad) {
            var panelInfo = {
                    enabled: false,
                    classId: 'actuation',
                    profile: 'HA'
                },
                attrInfo = {
                    onOff: 0
                };

            if (!err && _.isEqual(brewedGad.get('panel'), panelInfo) && _.isEqual(brewedGad.get('attrs'), attrInfo))
                done();
        });
    });
});

var invokeCbNextTick = function (cb) {
    setImmediate(cb, null);
};

describe('Drivers Check', function() {
    describe('- Netcore', function() {
        it('#start()', function (done) {
            var startStub = sinon.stub(controller, 'start', function (callback) {
                    controller._enabled = true;
                    invokeCbNextTick(callback);
                });

            zbCore.start(function (err) {
                if (!err) {
                    expect(startStub).to.be.calledOnce;
                    startStub.restore();
                    done();
                }
            });

        });

        it('#stop()', function (done) {
            var stopStub = sinon.stub(controller, 'stop', function (callback) {
                    controller._enabled = false;
                    invokeCbNextTick(callback);
                });

            zbCore.stop(function (err) {
                if (!err) {
                    expect(stopStub).to.be.calledOnce;
                    stopStub.restore();
                    done();
                }
            });
        });

        it('#reset()', function (done) {
            var resetStub = sinon.stub(controller, 'reset', function (mode, callback) {
                    expect(mode).to.be.equal('hard');
                    invokeCbNextTick(callback);
                }),
                stopStub = sinon.stub(zbCore, 'stop', function (callback) {
                    invokeCbNextTick(callback);
                });

            zbCore.enable();

            zbCore.reset(1, function (err) {
                if (!err) {
                    expect(resetStub).to.be.calledOnce;
                    resetStub.restore();
                    stopStub.restore();
                    done();
                }
            });
        });

        it('#permitJoin()', function (done) {
            var permitJoinStub = sinon.stub(controller, 'permitJoin', function (time, callback) {
                    expect(time).to.be.equal(255);
                    invokeCbNextTick(callback);
                });

            zbCore.permitJoin(60, function (err) {
                if (!err) {
                    expect(permitJoinStub).to.be.calledOnce;
                    permitJoinStub.restore();
                    done();
                }
            });
        });

        it('#remove()', function (done) {
            var removeStub = sinon.stub(controller, 'remove', function (ieeeAddr, callback) {
                    expect(ieeeAddr).to.be.equal('0x00124b0001ce4beb');
                    invokeCbNextTick(callback);
                });

            zbCore.remove('0x00124b0001ce4beb', function (err) {
                if (!err) {
                    expect(removeStub).to.be.calledOnce;
                    removeStub.restore();
                    done();
                }
            });
        });

        it('#ping()', function (done) {
            var requestStub = sinon.stub(controller.controller, 'request', function (subsys, cmdId, valObj, callback) {
                    return Q.resolve(null).nodeify(callback);
                });

            controller._registerDev(zb_dev, function (err) {
                if (!err)
                    zbCore.ping('0x00124b0001ce4beb', function (err) {
                        if (!err) {
                            expect(requestStub).to.be.calledOnce;
                            requestStub.restore();
                            done();
                        }
                    });
            });
        });
    });

    describe('- Device', function() {
        it('#read()', function (done) {
            var foundationStub = sinon.stub(zb_ep_8, 'foundation', function (cId, cmd, zclData, callback) {
                    setImmediate(callback, null, [
                        { attrId: 1, status: 0, attrData: 0 },
                        { attrId: 3, status: 0, attrData: 0 },
                        { attrId: 4, status: 0, attrData: 'sivann' },
                        { attrId: 5, status: 0, attrData: 'hiver01' },
                        { attrId: 6, status: 0, attrData: '20170314' },
                        { attrId: 7, status: 0, attrData: 1 },
                        { attrId: 16384, status: 0, attrData: '001' }
                    ]);
                });

            dev.enable();

            dev.read('serial', function (err, result) {
                if (!err) {
                    expect(result).to.be.equal('20170314');
                    foundationStub.restore();
                    done();
                }
            });
        });

        it('#write()', function (done) {
            dev.write('serial', '20170214',function (err, result) {
                if (err.message === 'Device attribute serial is read-only.')
                    done();
            });
        });

        it('#identify()', function (done) {
            var clusterHasStub = sinon.stub(zb_ep_8.clusters, 'has', function () {
                    return true;
                }),
                functionalStub = sinon.stub(zb_ep_8, 'functional', function (cId, cmd, zclData, callback) {
                    invokeCbNextTick(callback);
                });

            dev.identify(function (err) {
                if (!err) {
                    clusterHasStub.restore();
                    functionalStub.restore();
                    done();
                }
            });
        });
    });

    describe('- Gadget', function() {
        it('#read()', function (done) {
            var readStub = sinon.stub(zb_ep_8, 'read', function (cId, attrId, callback) {
                    expect(cId).to.be.equal('genOnOff');
                    expect(attrId).to.be.equal('onOff');
                    setImmediate(callback, null, 0);
                });

            gad.enable();

            gad.read('onOff', function (err, result) {
                if (!err) {
                    expect(result).to.be.equal(0);
                    readStub.restore();
                    done();
                }
            });
        });

        it('#write()', function (done) {
            var functionalStub = sinon.stub(zb_ep_8, 'functional', function (cId, cmd, zclData, callback) {
                expect(cmd).to.be.equal('on');
                    invokeCbNextTick(callback);
                });

            gad.write('onOff', 1,function (err, result) {
                if (!err)
                    done();
            });
        });

        it('#readReportCfg()', function (done) {//(attrName, callback)
            var foundationStub = sinon.stub(zb_ep_8, 'foundation', function (cId, cmd, zclData, callback) {
                    setImmediate(callback, null, {
                        minRepIntval: 5,
                        maxRepIntval: 10,
                        repChange: 100
                    });
                });

            gad.readReportCfg('onOff', function (err, cfg) {
                if (!err) {
                    expect(cfg.pmin).to.be.equal(5);
                    expect(cfg.pmax).to.be.equal(10);
                    expect(cfg.gt).to.be.equal(100);

                    foundationStub.restore();
                    done();
                }
            });
        });

        it('#writeReportCfg()', function (done) {
            var reportStub = sinon.stub(zb_ep_8, 'report', function (cId, attrId, minInt, maxInt, repChange, callback) {
                    invokeCbNextTick(callback);
                });

            gad.writeReportCfg('onOff', {pmin: 3, pmax: 10, enable: true}, function (err, data) {
                if (!err && data) {
                    reportStub.restore();
                    done();
                }
            });
        });
    });
});

describe('Handlers Check', function() {
    it('devIncomingHdlr()', function (done) {
        var devIncoming,
            gadIncoming,
            commitDevStub = sinon.stub(zbCore, 'commitDevIncoming', function (permAddr, rawDev) {
                expect(permAddr).to.be.equal('0x00124b0001ce4beb');
                commitDevStub.restore();

                devIncoming = true;
                if (devIncoming && gadIncoming)
                    done();
            }),
            commitGadStub = sinon.stub(zbCore, 'commitGadIncoming', function (permAddr, auxId, rawGad) {
                expect(permAddr).to.be.equal('0x00124b0001ce4beb');
                expect(auxId).to.be.equal('actuation/8/genOnOff');
                expect(rawGad.profId).to.be.equal('HA');
                expect(rawGad.classId).to.be.equal('actuation');
                commitGadStub.restore();

                gadIncoming = true;
                if (devIncoming && gadIncoming)
                    done();
            });

        msgHdlrs.devIncoming(zbCore, [ zb_ep_8 ], '0x00124b0001ce4beb');
    });

    it('devStatusHdlr()', function (done) {
        var commitDevNetChangeStub = sinon.stub(zbCore, 'commitDevNetChanging', function (permAddr, changes) {
                expect(permAddr).to.be.equal('0x00124b0001ce4beb');
                expect(changes.status).to.be.equal('online');
                commitDevNetChangeStub.restore();

                done();
            });

        msgHdlrs.devStatus(zbCore, [ zb_ep_8 ], 'online');
    });

    it('devChangeHdlr()', function (done) {
        var commitGadReportStub = sinon.stub(zbCore, 'commitGadReporting', function (permAddr, auxId, attrs) {
                expect(permAddr).to.be.equal('0x00124b0001ce4beb');
                expect(auxId).to.be.equal('actuation/8/genOnOff');
                expect(_.isEqual(attrs, { onOff: 1 })).to.be.true;
                commitGadReportStub.restore();

                done();
            });

        msgHdlrs.devChange(zbCore, [ zb_ep_8 ], { cid: 'genOnOff', data: { onOff: 1 } });
    });

    it('devLeavingHdlr()', function (done) {
        var commitDevLeaveStub = sinon.stub(zbCore, 'commitDevLeaving', function (permAddr) {
                expect(permAddr).to.be.equal('0x00124b0001ce4beb');
                commitDevLeaveStub.restore();

                done();
            });

        msgHdlrs.devLeaving(zbCore, '0x00124b0001ce4beb');
    });
});
