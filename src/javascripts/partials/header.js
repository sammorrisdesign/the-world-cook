var d3 = require('d3');
var planetaryjs = require('planetary.js');
var planetJSON = require('../../../node_modules/planetary.js/dist/world-110m.json');

var planet, canvas, width, height;

module.exports = {
    init: function() {
        this.setCanvasSize();
        this.createGlobe();
        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.setCanvasSize();
            this.createGlobe();
        }.bind(this));
    },

    setCanvasSize: function() {
        canvas = document.getElementsByClassName('home-header__canvas')[0];
        width = $('.home-header').width();
        height = $('.home-header').height() - 80;
    },

    createGlobe: function() {
        planet = planetaryjs.planet();
        planet.loadPlugin(planetaryjs.plugins.earth({
            topojson: { file: 'assets/data/world-110m.json' },
            oceans:   { fill:   'transparent', stroke: '#fff', lineWidth: 1 },
            land:     { fill:   'transparent', stroke: '#fff', lineWidth: 1 },
            borders:  { stroke: '#fff', lineWidth: 1 }
        }));

        planet.projection.scale(height / 2).translate([width / 2, height / 2]).rotate([0, -10, 0]);
        planet.loadPlugin(this.rotate(10));

        $('.home-header__canvas').attr('width', width).attr('height', height);
        planet.draw(canvas);
    },

    rotate: function(degPerSec) {
        return function(planet) {
          var lastTick = null;
          var paused = false;
          planet.plugins.autorotate = {
            pause:  function() { paused = true;  },
            resume: function() { paused = false; }
          };
          // ...and configure hooks into certain pieces of its lifecycle.
          planet.onDraw(function() {
            if (paused || !lastTick) {
              lastTick = new Date();
            } else {
              var now = new Date();
              var delta = now - lastTick;
              // This plugin uses the built-in projection (provided by D3)
              // to rotate the globe each time we draw it.
              var rotation = planet.projection.rotate();
              rotation[0] += degPerSec * delta / 1000;
              if (rotation[0] >= 180) rotation[0] -= 360;
              planet.projection.rotate(rotation);
              lastTick = now;
            }
          });
        };
    }
}