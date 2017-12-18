module.exports = {
    handlise: function(string) {
        if (string) {
            return string.toLowerCase().replace(' ', '-').replace('/', '');
        }
    }
}