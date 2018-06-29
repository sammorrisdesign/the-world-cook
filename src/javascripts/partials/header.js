var d3 = require('d3');
var planetaryjs = require('planetary.js');
var planetJSON = require('../../../node_modules/planetary.js/dist/world-110m.json');

var planet, canvas, width, height, context;

module.exports = {
    init: function() {
        this.setCanvasSize();
        this.createGlobe();
        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.setCanvasSize();
            this.resizeGlobe();
        }.bind(this));
    },

    setCanvasSize: function() {
        canvas = document.getElementsByClassName('home-header__canvas')[0];
        width = $('.home-header__canvas').width();
        height = $('.home-header__canvas').height();
        context = canvas.getContext('2d');
        context.scale(2, 2);
        $('.home-header__canvas').attr('width', width).attr('height', height);
    },

    resizeGlobe: function() {
        planet.projection.scale(height / 2).translate([width, height / 2]);
    },

    createGlobe: function() {
        planet = planetaryjs.planet();
        planet.loadPlugin(planetaryjs.plugins.earth({
            topojson: { file: 'assets/data/world-110m.json' },
            oceans:   { fill:   'transparent', stroke: '#e00f1b', lineWidth: 1 },
            land:     { fill:   'transparent', stroke: '#e00f1b', lineWidth: 1 },
            borders:  { stroke: '#e00f1b', lineWidth: 1 }
        }));

        planet.loadPlugin(this.drawBorder());
        planet.loadPlugin(this.drawGraticules());
        planet.loadPlugin(this.rotateToPoint(990));
        planet.projection.scale(height / 2).translate([width, height / 2]).rotate([0, -10, 0]);

        planet.draw(canvas);
        planet.onInit(function() {
            $('.home-header__canvas').addClass('is-init');
        });
    },

    drawBorder: function() {
        return function(planet) {
            planet.onDraw(function() {
                planet.withSavedContext(function(context) {
                    context.beginPath();
                    planet.path.context(context)({type: 'Sphere'});

                    context.strokeStyle = '#e00f1b';
                    context.lineWidth = 1;
                    context.stroke();
                });
            });
        }
    },

    drawGraticules: function() {
        return function(planet) {
            planet.onDraw(function() {
                planet.withSavedContext(function(context) {
                    var graticule = d3.geo.graticule().step([20, 20]);
                    context.beginPath();
                    planet.path.context(context)(graticule());
                    context.strokeStyle = '#e00f1b';
                    context.lineWidth = 1;
                    context.stroke();
                });
            });
        }
    },

    rotateToPoint: function(point) {
        return function(planet) {
            var lastTick = null;
            var currentRotation = null;

            planet.onDraw(function() {
                if (currentRotation === point || !lastTick) {
                    lastTick = new Date();
                } else {
                    var now = new Date();
                    var delta = now - lastTick;

                    // rotate other direction if this is better
                    var rotation = planet.projection.rotate();
                        rotation[0] += 10 * delta / 1000;
                    if (rotation[0] >= 180) rotation[0] -= 360;

                    currentRotation = Math.floor(rotation[0]);

                    planet.projection.rotate(rotation);
                    lastTick = now;
                }
            });
        }
    }
}