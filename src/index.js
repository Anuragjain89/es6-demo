var Game = require('./game').Game;

// ----------------------------------------------------------------------------------------------------------
// HANDLE MULTIPLE BROWSERS
// ----------------------------------------------------------------------------------------------------------
var w = window;
var requestAnimationFrame = w.requestAnimationFrame ||
                            w.webkitRequestAnimationFrame ||
							w.msRequestAnimationFrame ||
							w.mozRequestAnimationFrame;

new Game().initialize().then((game) => setTimeout(game.start.bind(game), 0));
