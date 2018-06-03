module.exports = {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.home-recipes__filter').click(function(e) {
            filter = $(e.currentTarget).data('filter');
            this.enableAnimations();
            this.sortBy(filter);
        }.bind(this));
    },

    sortBy: function(filter) {
        $('.home-recipes').removeClass('regions groups').addClass(filter);
    },

    enableAnimations: function() {
        $('.home-recipes__filter-ball').addClass('is-animatable');
    },
}