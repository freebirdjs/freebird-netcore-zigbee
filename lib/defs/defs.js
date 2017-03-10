module.exports = {
    genOnOff: {
        oid: 'actuation',
        rid: {
            "onOff": "onOff",
            "globalSceneCtrl": null,
            "onTime": "onTime",
            "offWaitTime": null
        }
    },
    genLevelCtrl: {
        oid: 'levelControl',
        rid: {
            "currentLevel": "level",
            "remainingTime": null,
            "onOffTransitionTime": null,
            "onLevel": null,
            "onTransitionTime": "onTime",
            "offTransitionTime": "offTime",
            "defaultMoveRate":  null
        }
    },
    genTime: {
        oid: 'time',
        rid: {
            "time": "currentTime",
            "timeStatus": null,
            "timeZone": null,
            "dstStart": null,
            "dstEnd": null,
            "dstShift": null,
            "standardTime": null,
            "localTime": null,
            "lastSetTime": null,
            "validUntilTime": null,
        }
    },
    genAnalogInput: {
        oid: 'aIn',
        rid: {
            "description": "sensorType",
            "maxPresentValue": "maxRangeValue",
            "minPresentValue": "minRangeValue",
            "outOfService":     null,
            "presentValue":    "aInCurrValue" ,
            "reliability":      null,
            "resolution":       null,
            "statusFlags":      null,
            "engineeringUnits": null,
            "applicationType":  "appType"
        }
    },
    genAnalogOutput: {
        oid: 'aOut',
        rid: {
            "description": null,
            "maxPresentValue": "maxRangeValue",
            "minPresentValue": "minRangeValue",
            "outOfService": null,
            "presentValue": "aOutCurrValue",
            "priorityArray": null,
            "reliability": null,
            "relinquishDefault": null,
            "resolution": null,
            "statusFlags": null,
            "engineeringUnits": null,
            "applicationType": "appType"
        }
    },
    genBinaryInput: {
        oid: 'dIn',
        rid: {
            "activeText": null,
            "description": "sensorType",
            "inactiveText": null,
            "outOfService": null,
            "polarity": "dInPolarity",
            "presentValue": "dInState",
            "reliability": null,
            "statusFlags": null,
            "applicationType": "appType"
        }
    },
    genBinaryOutput: {
        oid: 'dOut',
        rid: {
            "activeText": null,
            "description": null,
            "inactiveText": null,
            "minimumOffTime": null,
            "minimumOnTime": null,
            "outOfService": null,
            "polarity": "dOutPolarity",
            "presentValue": "dOutState",
            "priorityArray": null,
            "reliability": null,
            "relinquishDefault": null,
            "statusFlags": null,
            "applicationType": "appType"
        }
    },
    msIlluminanceMeasurement: {
        oid: 'illuminance',
        rid: {
            "measuredValue": "sensorValue",
            "minMeasuredValue": "minRangeValue",
            "maxMeasuredValue": "maxRangeValue",
            "tolerance": null,
            "lightSensorType": null
        }
    },
    msTemperatureMeasurement: {
        oid: 'temperature',
        rid: {
            "measuredValue": "sensorValue",
            "minMeasuredValue": "minRangeValue",
            "maxMeasuredValue": "maxRangeValue",
            "tolerance": null,
            "minPercentChange": null,
            "minAbsoluteChange": null
        }
    },
    msPressureMeasurement: {
        oid: 'pressure',
        rid: {
            "measuredValue": "sensorValue",
            "minMeasuredValue": "minRangeValue",
            "maxMeasuredValue": "maxRangeValue",
            "tolerance": null
        }
    },
    msRelativeHumidity: {
        oid: 'humidity',
        rid: {
            "measuredValue": "sensorValue",
            "minMeasuredValue": "minRangeValue",
            "maxMeasuredValue": "maxRangeValue",
            "tolerance": null
        }
    },
    ssIasZone: {
        oid: 'generic',
        rid: {
            "zoneState": null,
            "zoneType": "sensorType",
            "zoneStatus": "sensorValue",
            "iasCieAddr": null,
            "zoneId": null,
            "numZoneSensitivityLevelsSupported": null,
            "currentZoneSensitivityLevel": null
        }
    },
    seMetering: {
        oid: 'power',
        rid: {
            "currentSummDelivered": "sensorValue",
            "unitOfMeasure": "units",
            "multiplier": null,
            "divisor": null,
            "summaFormatting": null
        }
    },
};
