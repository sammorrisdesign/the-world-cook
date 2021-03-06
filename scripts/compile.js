var fs = require('fs-extra');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');
var handlebars = require('handlebars');
var deasync = require('deasync');
var browserify = require('browserify');
var helpers = require('../scripts/helpers.js');

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

handlebars.registerHelper('handlise', function(string) {
    return helpers.handlise(string);
})

handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

handlebars.registerHelper('suffix', function(date) {
    if (date === 21) {
        return 'st'
    } else if (date === 22) {
        return 'nd'
    } else if (date === 23) {
        return 'rd'
    } else {
        return 'th'
    }
});

handlebars.registerHelper('difficulty', function(value) {
    if (value === 3) {
        return 'World Class'
    } else if (value === 2) {
        return 'Professional'
    } else {
        return 'Semi-Pro'
    }
});

var data = fs.readFileSync('.data/data.json');
    data = JSON.parse(data);

function buildHTMLFile(template, pageData = {}, dest = template) {
    var html = fs.readFileSync('src/templates/' + template + '.html', 'utf8');
    var template = handlebars.compile(html);

    fs.writeFileSync('.build/' + dest + '.html', template(pageData));
}

for (var i in data) {
    if (data[i].steps && data[i].isScheduled) {
        buildHTMLFile('recipes',  data[i], 'recipes/' + data[i].slug)
    }
}

data.level = 'home';
buildHTMLFile('index', data);

data.level = 'about';
buildHTMLFile('about', data);

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
fs.copySync('.images', '.build/assets/images/recipes/');