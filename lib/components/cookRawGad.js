module.exports = function (gad, rawGad, callback) {
    var panelInfoObj = {
            profile: rawGad.profId,
            classId: rawGad.classId,
        },
        gadAttrsObj = rawGad.attrs;

    gad.set('panel', panelInfoObj);
    gad.set('attrs', gadAttrsObj);

    callback(null, gad);
};

// rawGad = {
//     profId: 'HA',
//     classId: 'actuation',
//     attrs: {
//         "onOff": 0,
//         "onTime": 0
//     }
// };
