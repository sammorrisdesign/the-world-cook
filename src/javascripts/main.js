window.$ = require('./vendors/jquery');

var region = require('./partials/region');

region.init();

if ($('body').attr('data-page-type') === 'recipe') {
    var recipes = require('./partials/recipes');
    var ingredients = require('./partials/ingredients');

    recipes.init();
    ingredients.init();
}
