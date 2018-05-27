module.exports = {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.home-recipes__filter').click(function(e) {
            filter = $(e.currentTarget).data('filter');
            console.log(filter);
            this.sortBy(filter);
        }.bind(this));
    },

    sortBy: function(filter) {
        $('.home-recipes').removeClass('regions groups').addClass(filter);
    }
}