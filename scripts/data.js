var fs = require('fs-extra');
var deasync = require('deasync');
var gsjson = require('google-spreadsheet-to-json');
var helpers = require('./helpers.js');

var isDone = false;
var data = {};

function organiseIntoRecipe(data) {
    var organisedData = {level: 'recipes'};

    for (var i in data.recipes) {
        organisedData[helpers.handelise(data.recipes[i].country)] = data.recipes[i];
    }

    for (var i in organisedData) {
        organisedData[i].level = 'recipe';

        if (data[i + 'Steps']) {
            organisedData[i].steps = data[i + 'Steps'];
        }

        if (data[i + 'Ingredients']) {
            organisedData[i].ingredients = data[i + 'Ingredients'];
        }
    }

    return organisedData;
}

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

        data = organiseIntoRecipe(data);

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