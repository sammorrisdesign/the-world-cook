module.exports = {
    updateRecipeProgressLabel: function(step) {
        var text = $('.recipe-step--' + (step + 1)).data('detail');
        $('.recipe-progress__detail').text(text);
    }
}
