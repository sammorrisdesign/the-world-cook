module.exports = {
    init: function() {
        // this.sortCards('group');
    },

    sortCards: function(sortBy) {
        $('.cards .card').each(function(i, el) {
            var $el = $(el);
            var value = $el.data(sortBy);
            var target = '.card-group--' + value;

            if ($(target).length === 0) {
                $('.cards').append('<div class=\'card-group card-group--' + value + '\'><h2 class=\'card-group__title\'>' + (sortBy == 'group' ? 'Group ' : '') + value + '</h2></div>');
            }

            $(target).append($el);
        });
    }
}