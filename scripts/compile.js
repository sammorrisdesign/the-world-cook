var fs = require('fs-extra');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');
var handlebars = require('handlebars');
var deasync = require('deasync');
var browserify = require('browserify');

fs.removeSync('.build');
fs.mkdirsSync('.build');

var data = require('../scripts/data.json');

// HTML
var html = fs.readFileSync('src/templates/index.html', 'utf8');
var partials = glob.readdirSync('src/templates/**/*.html');

partials.forEach(function (partial) {
    var name = partial.replace('src/templates/', '').split('.')[0];
    var template = fs.readFileSync(partial, 'utf8');
    console.log(name);
    handlebars.registerPartial(name, template);
});

var template = handlebars.compile(html);
fs.writeFileSync('.build/index.html', template(data));

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
