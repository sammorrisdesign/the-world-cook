var ingredients = require('../partials/ingredients');

var activeStep = 0,
    scrollTop = 0;

module.exports = {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));

        $(window).resize(function() {
            this.onScroll();
        }.bind(this));
    },

    onScroll: function() {
        this.updateScrollTop();
        this.setActiveStep();
        ingredients.checkOffIngredients(activeStep);
    },

    updateScrollTop: function() {
        scrollTop = $(window).scrollTop();
    },

    setActiveStep: function() {
        $('.recipe-step').each(function(i, el) {
            if (scrollTop > $(el).offset().top - $(el).height() / 2) {
                activeStep = $(el).data('step');
            }
        }.bind(this));
    }
}