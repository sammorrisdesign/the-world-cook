window.$ = require('./vendors/jquery');

if ($('body').attr('data-page-type') === 'recipe') {
    var ingredients = require('./partials/ingredients');

    ingredients.init();
}
