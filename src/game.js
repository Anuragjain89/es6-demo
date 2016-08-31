var util      = require('./utility_functions');
var constants = require('./constants').constants;
var players   = require('./Player');
var Player    = players.Player;
var Hero      = players.Hero;
var Monster   = players.Monster;

function Game (width, height) {
    width              = width || 512;
    height             = height || 480;
    this.score         = 0;

    this.canvas        = document.createElement('canvas');
    this.canvas.width  = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    this.bgImage       = undefined;
    this.heroImage     = undefined;
    this.monsterImage  = undefined;
    this.hero          = undefined;
    this.monster       = undefined;
    this.keysDown      = {};
    this.then          = undefined;
}

Game.prototype.initialize = function () {
    var _this               = this;
    var initializationDefer = $.Deferred();
    var imageURLKeys        = ['bgImageURL', 'heroImageURL', 'monsterImageURL'];

    var promises = imageURLKeys.map(function(key) { return util.getImage(constants[key]); })
    $.when.apply($, promises)
    .then(function () {
          _this.bgImage      = arguments[0];
          _this.heroImage    = arguments[1];
          _this.monsterImage = arguments[2];
          _this.hero         = new Hero(_this.heroImage, _this.canvas.width, _this.canvas.height);
          _this.monster      = new Monster(_this.monsterImage, _this.canvas.width, _this.canvas.height);
          _this.render();
          _this.addEvents();
          initializationDefer.resolve(_this);
      });

    return initializationDefer.promise();
}

Game.prototype.render = function () {
    var canvasContext = this.canvas.getContext("2d");
    canvasContext.drawImage(this.bgImage, 0, 0);
    canvasContext.drawImage(this.heroImage, this.hero.x_coordinate, this.hero.y_coordinate);
    canvasContext.drawImage(this.monsterImage, this.monster.x_coordinate, this.monster.y_coordinate);
    canvasContext.fillStyle = "rgb(0, 0, 0)";
    canvasContext.font = "24px Helvetica";
    canvasContext.textAlign = "left";
    canvasContext.textBaseline = "top";
    canvasContext.fillText("Goblins caught: " + this.score, constants.IMAGE_WIDTH, constants.IMAGE_WIDTH);
}

Game.prototype.addEvents = function () {
    var _this = this;
    addEventListener("keydown", function (e) { _this.keysDown[e.keyCode] = true; }, false);
    addEventListener("keyup", function (e) { delete _this.keysDown[e.keyCode]; }, false);
}


Game.prototype.start = function () {
    var now = Date.now();
    this.then = this.then || Date.now();
    var deltaDuration = now - this.then;
    this.hero.updatePosition(this.keysDown, deltaDuration);
    if (Player.isTouching(this.hero, this.monster)) {
        this.score += 1;
        this.hero.reset();
        this.monster.reset();
    }
    this.render();
    this.then = now;
    requestAnimationFrame(this.start.bind(this));
}

module.exports.Game = Game;
