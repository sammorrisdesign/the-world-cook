var region = null;

module.exports = {
    init: function() {
        this.getRegion();
    },

    getRegion: function() {
        region = this.checkLocalStorage();

        if (region === null) {
            region = this.detectRegion();
        } else {
            this.detectRegion();
        }
    },

    checkLocalStorage: function() {
        return localStorage.getItem('region');
    },

    setRegion: function() {
        $('body').addClass(region);
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