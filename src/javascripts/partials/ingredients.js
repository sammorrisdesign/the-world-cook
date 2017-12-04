var scrollTop, ingredientsPosition, isFixed = true;

module.exports = {
    init: function() {
        this.bindings();
        this.updateScrollTop();
        this.updateNonFixedIngredientsPosition();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.updateScrollTop();
            this.checkIngredientsPosition();
        }.bind(this));

        $(window).resize(function() {
            this.updateNonFixedIngredientsPosition();
        }.bind(this));
    },

    updateScrollTop: function() {
        scrollTop = $(window).scrollTop();
    },

    updateNonFixedIngredientsPosition: function() {
        ingredientsPosition = $('.recipe-ingredients').offset().top;
    },

    checkIngredientsPosition: function() {
        if (scrollTop > ingredientsPosition) {
            $('.recipe-ingredients').addClass('is-fixed');
        } else {
            $('.recipe-ingredients').removeClass('is-fixed');
        }
    },

    checkOffIngredients: function(activeStep) {
        $('.recipe-ingredients__row.is-used').removeClass('is-used');
        $('.recipe-ingredients__row.is-active').removeClass('is-active');

        for (i = 0; activeStep + 1 > i ; i++) {
            var className = activeStep > i ? 'is-used' : 'is-active';
            $('.recipe-step--' + i).find('.recipe-step__ingredient').each(function() {
                var ingredientId = $(this).data('ingredient');
                $('.recipe-ingredients__row--' + ingredientId).addClass(className);
            })
        }
    }
}