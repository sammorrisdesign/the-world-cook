var ga = require('ga-browser')();

module.exports = {
    init: function() {
        this.registerAnalytics();
    },

    registerAnalytics: function() {
        ga('create', 'UA-3361191-11', 'auto');
        ga('send', 'pageview', {
            'page': document.pathname,
            'title': document.title
        });
    }
}