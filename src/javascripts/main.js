window.$ = require('./vendors/jquery');

var region = require('./partials/region');
var filter = require('./partials/filter');
var analytics = require('./partials/analytics');

region.init();
filter.init();
analytics.init();

var pageType = $('body').attr('data-page-type');

if (pageType === 'recipe') {
    var recipes = require('./partials/recipes');
    var ingredients = require('./partials/ingredients');

    recipes.init();
    ingredients.init();
}