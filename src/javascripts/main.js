window.$ = require('./vendors/jquery');

var region = require('./partials/region');
var filter = require('./partials/filter');

region.init();
filter.init();

var pageType = $('body').attr('data-page-type');

var header = require('./partials/header');
var recipes = require('./partials/recipes');
var ingredients = require('./partials/ingredients');

if (pageType === 'recipe') {
    recipes.init();
    ingredients.init();
} else if (pageType === 'home') {
    header.init();
}