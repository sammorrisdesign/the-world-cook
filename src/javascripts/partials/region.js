var region = null;

module.exports = {
    init: function() {
        this.getRegion();
        this.bindings();
    },

    bindings: function() {
        $('.recipe-intro__detail-unit').click(function(e) {
            region = $(e.currentTarget).data('unit');
            this.enableAnimations();
            this.setRegion();
            this.storeRegionLocally();
        }.bind(this));
    },

    getRegion: function() {
        region = this.checkLocalStorage();

        if (region === null) {
            region = this.detectRegion();
        } else {
            this.detectRegion();
        }
    },

    enableAnimations: function() {
        $('.recipe-intro__detail-ball').addClass('is-animatable');
    },

    checkLocalStorage: function() {
        return localStorage.getItem('region');
    },

    setRegion: function() {
        $('body').removeClass('imperial metric').addClass(region);
    },

    detectRegion: function() {
        if (navigator.language === 'en-US') {
            region = 'imperial'
        } else {
            region = 'metric'
        }

        this.setRegion();
        this.storeRegionLocally();
    },

    storeRegionLocally: function() {
        localStorage.setItem('region', region);
    }
}