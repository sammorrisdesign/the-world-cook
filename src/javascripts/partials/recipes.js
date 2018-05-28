var ingredients = require('../partials/ingredients');
var steps = require('../partials/steps');

var activeStep = -1,
    totalSteps = 0,
    scrollTop = 0;

module.exports = {
    init: function() {
        this.bindings();
        this.setTotalSteps();
        this.updateScrollTop();
        this.setActiveStep();
        this.toggleRecipeProgress();
        ingredients.updateNonFixedIngredientsPosition(scrollTop);
        ingredients.setHeight();
        ingredients.checkIngredientsPosition(scrollTop, activeStep, totalSteps);
        ingredients.checkOffIngredients(activeStep);
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));

        $(window).resize(function() {
            ingredients.reset(scrollTop, activeStep, totalSteps);
            this.onScroll();
        }.bind(this));

        $(window).ready(function() {
            ingredients.reset(scrollTop, activeStep, totalSteps);
        }.bind(this));

        $('.recipe-progress').click(function() {
            this.scrollTo(activeStep + 1);
        }.bind(this));
    },

    setTotalSteps: function() {
        totalSteps = $('.recipe-step').length;
    },

    onScroll: function() {
        this.updateScrollTop();
        this.setActiveStep();
        this.toggleRecipeProgress();
        ingredients.checkIngredientsPosition(scrollTop, activeStep, totalSteps);
        ingredients.checkOffIngredients(activeStep);
    },

    scrollTo: function(step) {
        var offset = 56;

        $('html, body').animate({
            scrollTop: $('.recipe-step--' + step).offset().top - offset
        }, 400);
    },

    updateScrollTop: function() {
        scrollTop = $(window).scrollTop();
    },

    setActiveStep: function() {
        var step = -1;
        $('.recipe-step').each(function(i, el) {
            if (scrollTop > $(el).offset().top - $(el).height() / 2) {
                step = $(el).data('step');

                // check on last step if user has scrolled past the last step
                if (step === (totalSteps - 1)) {
                    if (scrollTop > $(el).offset().top + $(el).height() / 2 ) {
                        step++;
                    }
                }
            }
        }.bind(this));

        activeStep = step;
    },

    toggleRecipeProgress: function() {
        if (activeStep < 0 || activeStep + 1 >= totalSteps) {
            $('.recipe-progress').removeClass('is-active');
        } else {
            $('.recipe-progress').addClass('is-active');
            steps.updateRecipeProgressLabel(activeStep);
        }
    }
}