var fs = require('fs-extra');
var deasync = require('deasync');
var gsjson = require('google-spreadsheet-to-json');

var isDone = false;
var data = {};

module.exports = function(options) {
    gsjson({
        spreadsheetId: '1i-wdm0_QJPuku8FTXIxDOyian3Drqz5KllnChMBjUCg',
        allWorksheets: true,
        credentials: require('../keys.json')
    }).then(function(result) {
        // organise response in a useable way
        for (var worksheet in result) {
            for (var worksheetTitle in result[worksheet]) {
                data[worksheetTitle] = result[worksheet][worksheetTitle];
            }
        }

        isDone = true;
    }).catch(function(err) {
        console.log(err.message);
        console.log(err.stack);
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

    return data;
}