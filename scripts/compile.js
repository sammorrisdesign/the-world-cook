var fs = require('fs-extra');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');
var handlebars = require('handlebars');
var deasync = require('deasync');
var browserify = require('browserify');

fs.removeSync('.build');
fs.mkdirsSync('.build');
fs.mkdirsSync('.build/recipes');

// HTML
var partials = glob.readdirSync('src/templates/**/*.html');

partials.forEach(function(partial) {
    var name = partial.replace('src/templates/', '').split('.')[0];
    var template = fs.readFileSync(partial, 'utf8');

    handlebars.registerPartial(name, template);
});

handlebars.registerHelper('step', function(index) {
    return parseInt(index) + 1;
});

function buildHTMLFile(template, pageData = {}, dest = template) {
    var html = fs.readFileSync('src/templates/' + template + '.html', 'utf8');
    var template = handlebars.compile(html);
    var data = {
        'global': require('../data/global.json'),
        'page' : pageData
    }
    fs.writeFileSync('.build/' + dest + '.html', template(data));
}

var recipes = require('../data/recipes.json');

for (var i in recipes) {
    buildHTMLFile('recipes', require('../data/recipes/' + i + '.json'), 'recipes/' + recipes[i].slug)
}

buildHTMLFile('index');

// CSS
var css = sass.renderSync({
    file: 'src/sass/styles.scss'
}).css.toString('utf8');

fs.writeFileSync('.build/styles.css', css);

// JS
var isDone = false;
browserify('./src/javascripts/main.js').bundle(function(err, buf) {
    if (err) {
        console.log(err);
    }

    var compiled = buf.toString();
    fs.writeFileSync('.build/main.js', compiled);
    isDone = true;
});

deasync.loopWhile(function() {
    return !isDone;
});

fs.copySync('src/assets/', '.build/assets/');
