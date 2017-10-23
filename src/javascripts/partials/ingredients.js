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
    }
}