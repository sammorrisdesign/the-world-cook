var ingredientsPosition,
    ingredientsHeight,
    stepsEndPoint;

module.exports = {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.recipe-ingredients__substitute').click(function(e) {
            this.substituteIngredient(e.currentTarget);
        }.bind(this));

        $('.recipe-ingredients__title').click(function() {
            this.toggleIngredients();
        }.bind(this));
    },

    toggleIngredients: function() {
        if ($('.recipe-ingredients').hasClass('is-expandable')) {
            if ($('.recipe-ingredients').hasClass('is-expanded')) {
                $('.recipe-ingredients').removeClass('is-expanded');
                $('body').removeClass('is-expanded');
            } else {
                $('.recipe-ingredients').addClass('is-expanded');
                $('body').addClass('is-expanded');
            }
        }
    },

    updateNonFixedIngredientsPosition: function(scrollTop) {
        ingredientsPosition = $('.recipe-ingredients').offset().top;
        ingredientsHeight = $('.recipe-ingredients').css('height','auto').height();
        stepsEndPoint = $('.recipe-steps').offset().top + $('.recipe-steps').height();
    },

    setHeight: function() {
        $('.recipe-ingredients').height(ingredientsHeight);
    },

    reset: function(scrollTop, activeStep, totalSteps) {
        $('.recipe-ingredients').removeClass('is-expandable is-ended is-ended--mobile is-fixed is-expanded');
        $('body').removeClass('is-expanded');
        this.updateNonFixedIngredientsPosition(scrollTop);
        this.setHeight();
        this.checkIngredientsPosition(scrollTop, activeStep, totalSteps);
    },

    checkIngredientsPosition: function(scrollTop, activeStep, totalSteps) {
        if (scrollTop > ingredientsPosition) {
            if (scrollTop > ingredientsPosition + ingredientsHeight) {
                $('.recipe-ingredients').addClass('is-expandable');
            } else {
                $('.recipe-ingredients').removeClass('is-expandable');
            }

            if (scrollTop > stepsEndPoint - ingredientsHeight) {
                $('.recipe-ingredients').addClass('is-ended');
            } else {
                $('.recipe-ingredients').removeClass('is-ended');
            }

            if (activeStep === totalSteps) {
                $('.recipe-ingredients').addClass('is-ended--mobile').removeClass('is-expanded');
            } else {
                $('.recipe-ingredients').removeClass('is-ended--mobile');
            }

            $('.recipe-ingredients').addClass('is-fixed');

        } else {
            $('.recipe-ingredients').removeClass('is-fixed');
        }
    },

    checkOffIngredients: function(activeStep) {
        $('.recipe-ingredients__row.is-used').removeClass('is-used');
        $('.recipe-ingredients__row.is-active').removeClass('is-active');

        for (i = 0; activeStep + 1 > i; i++) {
            var className = activeStep > i ? 'is-used' : 'is-active';
            $('.recipe-step--' + i).find('.recipe-step__ingredient').each(function(index, el) {
                var ingredientId = $(el).data('ingredient');

                $('.recipe-ingredients__row--' + ingredientId).addClass(className);

                if ($('.recipe-ingredients__row--' + ingredientId + ' .recipe-ingredients__amount-text--' + (i + 1)).length && className === 'is-used') {
                    $('.recipe-ingredients__row--' + ingredientId).removeClass('is-used');
                }
            }.bind(this));

            $('.recipe-ingredients__row--is-halfable').each(function(index, el) {
                if ($(el).find('.recipe-ingredients__amount-text--' + i).length) {
                    $(el).find('.recipe-ingredients__amount-text').addClass('is-hidden');
                    $(el).find('.recipe-ingredients__amount-text--' + i).removeClass('is-hidden');
                }
            }.bind(this));
        }
    },

    substituteIngredient: function(target) {
        var $ingredient = $(target).parent().find('.recipe-ingredients__ingredient-name span');
        var oldIngredient = $ingredient.text();
        var newIngredient = $(target).attr('data-substitute');

        $ingredient.text(newIngredient);
        $(target).attr('data-substitute', oldIngredient);

        // swap ingredients when mentioned in the steps...
    }
}
