module.exports = {
    handelise: function(string) {
        if (string) {
            return string.toLowerCase().replace(' ', '-').replace('/', '');
        }
    }
}