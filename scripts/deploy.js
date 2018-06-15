var deploy = require('sftp-sync-deploy').deploy;
var fs = require('fs-extra');
var server = require('../keys.json').server;

var isProduction = true;

if (isProduction) {
    var remoteDir = '/var/www/theworldcook.com/public_html/'
} else {
    var remoteDir = '/var/www/theworldcook.com/shannyzone.theworldcook.com';
    fs.writeFileSync('.build/robots.txt', 'User-agent: *\nDisallow: /');
}

deploy({
    host: server.host,
    port: parseInt(server.port),
    username: server.username,
    password: server.password,
    privateKey: server.privateKey,
    localDir: '.build',
    remoteDir: remoteDir
}, {
    dryRun: false,
    exclude: [
      '**/.DS_Store',
      'assets/images/recipes',
      'assets/images/recipes/**/*',
      'shannyzone.theworldcook.com/**/*'
    ],
    excludeMode: 'ignore',
    forceUpload: true
}).then(function() {
    console.log('success!');
}).catch(function(err) {
    console.log(err);
});
