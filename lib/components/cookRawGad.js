module.exports = function (gad, rawGad, callback) {
    var panelInfoObj = {
            profile: '',
            classId: '',
        },
        gadAttrsObj = {};

    gad.set('panel', panelInfoObj);
    gad.set('attrs', gadAttrsObj);

    callback(null, gad);
};
