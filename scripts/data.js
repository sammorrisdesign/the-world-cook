var fs = require('fs-extra');
var deasync = require('deasync');
var gsjson = require('google-spreadsheet-to-json');
var markdown = require('markdown').markdown;

var helpers = require('./helpers.js');

var isDone = false;
var data = {};

function organiseIntoRecipe(data) {
    var organisedData = {level: 'recipes'};

    for (var i in data.recipes) {
        organisedData[helpers.handlise(data.recipes[i].country)] = data.recipes[i];
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

function injectIngredientsIntoSteps(data) {
    for (var i in data) {
        if (data[i].steps) {
            for (var step in data[i].steps) {
                data[i].steps[step].instructions = markdown.toHTML(data[i].steps[step].instructions);
                data[i].steps[step].instructions = data[i].steps[step].instructions.replace('<a href="', '<span class=\'recipe-step__ingredient\' data-ingredient=\'').replace('">', '\'>').replace('</a>', '</span>');
            }
        }
    }

    return data;
}

module.exports = function(options) {
    var data = fs.readFileSync('.data/data.json');
    return JSON.parse(data);

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
        data = injectIngredientsIntoSteps(data);

        fs.writeFileSync('.data/data.json', JSON.stringify(data));

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