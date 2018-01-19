var ingredients = require('../partials/ingredients');

var activeStep = -1,
    scrollTop = 0;

module.exports = {
    init: function() {
        this.bindings();
        this.onScroll();
        this.updateRecipeProgressLabel();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));

        $(window).resize(function() {
            this.onScroll();
        }.bind(this));

        $('.recipe-progress').click(function() {
            $('html, body').animate({
                scrollTop: $('.recipe-step--' + (activeStep + 1)).offset().top
            }, 400);

        }.bind(this));
    },

    onScroll: function() {
        this.updateScrollTop();
        this.setActiveStep();
        this.toggleRecipeProgress();
        ingredients.checkOffIngredients(activeStep);
    },

    updateScrollTop: function() {
        scrollTop = $(window).scrollTop();
    },

    setActiveStep: function() {
        $('.recipe-step').each(function(i, el) {
            if (scrollTop > $(el).offset().top - $(el).height() / 2) {
                activeStep = $(el).data('step');
            } else {
                return -1;
            }
        }.bind(this));
    },

    toggleRecipeProgress: function() {
        if (activeStep < 0 || activeStep == $('.recipe-step').length) {
            $('.recipe-progress').removeClass('is-active');
        } else {
            $('.recipe-progress').addClass('is-active');
            this.updateRecipeProgressLabel();
        }
    },

    updateRecipeProgressLabel: function() {
        var text = $('.recipe-step--' + (activeStep + 1)).data('detail');
        $('.recipe-progress__detail').text(text);
    }
}