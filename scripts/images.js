var fs = require('fs-extra');
var glob = require('glob-fs')({ gitignore: true });
var jimp = require('jimp');
var deasync = require('deasync');

fs.mkdirsSync('.images');

var data = fs.readFileSync('.data/images.json');
    data = JSON.parse(data);

var importedImage = process.argv.slice(2)[0];
var images = importedImage ? [importedImage] : glob.readdirSync('src/assets/images/recipes/**/*.jpg');

for (var i in images) {
    console.log(images[i]);
    var hasExported = false;

    jimp.read(images[i], function(err, image) {
        if (data[images[i]] !== image.hash() || importedImage) {
            console.log('resizing ' + images[i]);

            // add image hash to json file
            data[images[i]] = image.hash();
            fs.writeFileSync('.data/images.json', JSON.stringify(data));

            // get paths and sizes
            var dest = '.images/' + images[i].replace('src/assets/images/recipes/', '');
            var fileName = dest.substring(dest.lastIndexOf('/') + 1, dest.lastIndexOf('.jpg'));
                dest = dest.substring(0, dest.lastIndexOf('/') + 1);
            var sizes = getSizes(fileName);

            // create Twitter image
            if (fileName === 'header') {
                image.clone()
                    .cover(2000, 1000)
                    .quality(80)
                    .write(dest + 'twitter.jpg')
            }

            // convert image to sizes
            for (var s in sizes) {
                image.resize(sizes[s], jimp.AUTO)
                    .quality(80)
                    .write(dest + fileName + '--' + sizes[s] + '.jpg');
            }
        } else {
            console.log('skipped ' + images[i]);
        }

        hasExported = true;
    });

    deasync.loopWhile(function() {
        return !hasExported;
    });
}

fs.removeSync('.build/assets/images/recipes/');
fs.copySync('.images', '.build/assets/images/recipes/');

function getSizes(fileName) {
    if (fileName === 'header') {
        return [2600, 1300, 1040, 520, 260]
    } else if (fileName === 'home-header') {
        return [1024, 512, 256]
    } else {
        return [1520, 840, 760, 420]
    }
}
