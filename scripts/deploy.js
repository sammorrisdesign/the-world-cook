var deploy = require('sftp-sync-deploy').deploy;
var fs = require('fs-extra');
var server = require('../keys.json').server;

fs.writeFileSync('.build/robots.txt', 'User-agent: *\nDisallow: /');

deploy({
    host: server.host,
    port: parseInt(server.port),
    username: server.username,
    password: server.password,
    privateKey: server.privateKey,
    localDir: '.build',
    remoteDir: '/var/www/theworldcook.com/public_html/beta.theworldcook.com'
}, {
    dryRun: true
}).then(function() {
    console.log('success!');
}).catch(function(err) {
    console.log(err);
});
