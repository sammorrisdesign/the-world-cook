var fs = require('fs-extra');
var deasync = require('deasync');
var gsjson = require('google-spreadsheet-to-json');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var markdown = require('markdown').markdown;
var cheerio = require('cheerio');

var helpers = require('./helpers.js');

var isDone = false;
var data = {};

var sheetsToGet = [ 'recipes',
  'iranIngredients',
  'iranSteps',
  'senegalIngredients',
  'senegalSteps',
  'egyptIngredients',
  'egyptSteps',
  'icelandIngredients',
  'icelandSteps',
  'switzerlandIngredients',
  'switzerlandSteps',
  'belgiumIngredients',
  'belgiumSteps',
  'franceIngredients',
  'franceSteps',
  'denmarkIngredients',
  'denmarkSteps',
  'costa-ricaIngredients',
  'costa-ricaSteps',
  'germanyIngredients',
  'germanySteps',
  'south-koreaIngredients',
  'south-koreaSteps',
  'polandIngredients',
  'polandSteps',
  'saudi-arabiaIngredients',
  'saudi-arabiaSteps',
  'australiaIngredients',
  'australiaSteps',
  'nigeriaIngredients',
  'nigeriaSteps',
  'croatiaIngredients',
  'croatiaSteps',
  'japanIngredients',
  'japanSteps',
  'tunisiaIngredients',
  'tunisiaSteps',
  'englandIngredients',
  'englandSteps',
  'uruguayIngredients',
  'uruguaySteps',
  'panamaIngredients',
  'panamaSteps',
  'portugalIngredients',
  'portugalSteps',
  'brazilIngredients',
  'brazilSteps',
  'russiaIngredients',
  'russiaSteps',
  'spainIngredients',
  'spainSteps',
  'swedenIngredients',
  'swedenSteps',
  'serbiaIngredients',
  'serbiaSteps',
  'mexicoIngredients',
  'mexicoSteps',
  'colombiaSteps',
  'colombiaIngredients',
  'moroccoIngredients',
  'moroccoSteps',
  'argentinaIngredients',
  'argentinaSteps',
  'peruIngredients',
  'peruSteps' ];

function organiseIntoRecipe(data) {
    var organisedData = {};

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
                data[i].steps[step].instructions = data[i].steps[step].instructions.replace(/<a href="/g, '<span class=\'recipe-step__ingredient\' data-ingredient=\'').replace(/">/g, '\'>').replace(/<\/a>/g, '</span>');

                var $ = cheerio.load(data[i].steps[step].instructions);

                $('.recipe-step__ingredient').each(function(ingredientNum, el) {
                    if ($(el).attr('data-ingredient').indexOf(' ') >= 0) {
                        var string = $(el).attr('data-ingredient');
                        var ingredientName = string.substr(0, string.indexOf(' '));
                        var units = string.substr(string.indexOf(' ') + 1).split(':');
 
                        if (units.length == 2) {
                            $(el).attr('data-ingredient', ingredientName);

                            for (var ingredient in data[i].ingredients) {
                                if (data[i].ingredients[ingredient].ingredient.toUpperCase() === ingredientName.replace(/-/g, ' ').toUpperCase()) {
                                    data[i].ingredients[ingredient].isHalfable = true;

                                    if (typeof data[i].ingredients[ingredient].halfSteps != 'object') {
                                        data[i].ingredients[ingredient].halfSteps = [];
                                    }

                                    data[i].ingredients[ingredient].halfSteps.push({
                                        stepNum: parseInt(step) + 1,
                                        imperial: prettifyAmount(units[0]),
                                        metric: prettifyAmount(units[1])
                                    });
                                }
                            }

                        }
                    }
                }.bind(this));

                data[i].steps[step].instructions = $('p').html();
            }
        }
    }

    return data;
}


function convertTempsToHTML(data) {
    var regEx = RegExp(/[0-9]{3}F\/[0-9]{3}C/g);

    for (var i in data) {
        for (var step in data[i].steps) {
            var string = data[i].steps[step].instructions;
            var match;
            var matches = [];

            while ((match = regEx.exec(string)) != null) {
                matches.unshift(match.index);
            }

            matches.forEach(function(index) {
                var fahrenheit = string.substring(index, index + 3);
                var celsius = string.substring(index + 5, index + 8);

                string = string.substring(0, index) + '<span class=\'recipe-step__temp recipe-step__temp--fahrenheit\'>' + fahrenheit + '&deg;F</span><span class=\'recipe-step__temp recipe-step__temp--celsius\'>' + celsius + '&deg;C</span>' + string.substring(index + 9, string.length);
            });

            data[i].steps[step].instructions = string;
        }
    }

    return data;
}

function convertUnitsToHTML(data) {
    var regEx = RegExp(/\{[^}]*\}/g);

    for (var i in data) {
        for (var step in data[i].steps) {
            var string = data[i].steps[step].instructions;
            var match;
            var matches = [];

            while ((match = regEx.exec(string)) != null) {
                matches.unshift(match.index);
            }

            matches.forEach(function(index) {
                var endIndex = string.lastIndexOf('}');
                var bothUnits = string.substring(index, endIndex);
                var divide = string.lastIndexOf(':');
                var imperial = string.substring(index + 1, divide);
                var metric = string.substring(divide + 1, endIndex);

                string = string.substring(0, index) + '<span class=\'recipe-step__unit recipe-step__unit--imperial\'>' + imperial + '</span><span class=\'recipe-step__unit recipe-step__unit--metric\'>' + metric + '</span>' + string.substring(endIndex + 1, string.length);
            });

            data[i].steps[step].instructions = string;
        }
    }

    return data;
}

function convertDescriptionsToHTML(data) {
    for (var i in data) {
        if (data[i].description) {
            data[i].plainDescription = data[i].description;
            data[i].description = markdown.toHTML(data[i].description);
        }
    }

    return data;
}

function prettifyAmount(string) {
    if (string == '' || string == undefined) { return string; }
    string = string.toString();
    string = string.replace('1/2', '&frac12;');
    string = string.replace('1/4', '&frac14;');
    return string;
}

function cleanIngredientAmounts(data) {
    for (var i in data) {
        if (data[i].ingredients) {
            for (ingredient in data[i].ingredients) {
                data[i].ingredients[ingredient].metric = prettifyAmount(data[i].ingredients[ingredient].metric);
                data[i].ingredients[ingredient].imperial = prettifyAmount(data[i].ingredients[ingredient].imperial);
            }
        }
    }

    return data;
}


function createRelated(data) {
    for (var i in data) {
        var thisGroup = data[i].group;
        data[i].related = [];

        for (var sub in data) {
            if (thisGroup == data[sub].group) {
                var related = data[sub];

                data[i].related.push({
                    colour: related.colour,
                    recipe: related.recipe,
                    time: related.time,
                    additionalTime: related.additionalTime,
                    slug: related.slug,
                    country: related.country,
                    date: related.date,
                    isScheduled: related.isScheduled,
                    isBeta: related.isBeta
                });
            }
        }
    }

    return data;
}

function addScheduleStatus(data) {
    for (var i in data) {
//         var currentDate = new Date();
        var currentDate = new Date('June 22 2018');
        var publishDate = new Date('June ' + data[i].date + ' 2018');

        data[i].isScheduled = currentDate >= publishDate;
    }

    return data;
}

function getSheet(sheetName) {
    var hasSheet = false;
    var sheet;

    gsjson({
        spreadsheetId: '1i-wdm0_QJPuku8FTXIxDOyian3Drqz5KllnChMBjUCg',
        worksheet: sheetName,
        credentials: require('../keys.json').google
    }).then(function(result) {
        sheet = result;
        hasSheet = true;
    }).catch(function(err) {
        console.log(err.message);
        console.log(err.stack);
        isDone = true;

        return;
    });

    deasync.loopWhile(function() {
        return !hasSheet;
    });

    return sheet[sheetName];
}

function getData() {
    async.eachSeries(sheetsToGet, function(sheetName, callback) {
        console.log('fetching ' + sheetName);
        data[sheetName] = getSheet(sheetName);
        callback();
    }, function() {
        data = organiseIntoRecipe(data);
        data = injectIngredientsIntoSteps(data);
        data = convertTempsToHTML(data);
        data = convertUnitsToHTML(data)
        data = convertDescriptionsToHTML(data);
        data = cleanIngredientAmounts(data);
        data = addScheduleStatus(data);
        data = createRelated(data);

        fs.writeFileSync('.data/data.json', JSON.stringify(data));

        console.log('data updated');

        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });
}

getData();
