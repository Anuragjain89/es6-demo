var constants = require('./constants').constants;
var util = require('./utility_functions');
// ----------------------------------------------------------------------------------------------------------
// ABSTRACT CLASS : PLAYER
// The sub-classes need to implement the reset method.
// ----------------------------------------------------------------------------------------------------------
function Player(image, type, maxWidth, maxHeight, speed) {
    // Check abstract behavior.
    if (this.constructor === Player) { throw new TypeError("Cannot construct Abstract instances directly"); }
    this.image = image;
    this.type = type;
    this.speed = speed;
    this.x_coordinate = 0;
    this.y_coordinate = 0;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
}

Player.prototype.updatePosition = function (keysDown, deltaDuration) {
    keysDown = keysDown || util.mandatoryArg();
    deltaDuration = deltaDuration;

    if (this.type === constants.movable_type) {
        let keys = Object.keys(keysDown)
        if (keys.length) {
            if (keys.includes(constants.UP_KEY)) { this.y_coordinate -= (this.speed * deltaDuration / 1000); }
            if (keys.includes(constants.DOWN_KEY)) { this.y_coordinate += (this.speed * deltaDuration / 1000); }
            if (keys.includes(constants.LEFT_KEY)) { this.x_coordinate -= (this.speed * deltaDuration / 1000); }
            if (keys.includes(constants.RIGHT_KEY)) { this.x_coordinate += (this.speed * deltaDuration / 1000); }
        }
    }
}

Player.isTouching = function (player1, player2) {
    return player1.x_coordinate <= (player2.x_coordinate + constants.IMAGE_WIDTH) &&
        player2.x_coordinate <= (player1.x_coordinate + constants.IMAGE_WIDTH) &&
        player1.y_coordinate <= (player2.y_coordinate + constants.IMAGE_WIDTH) &&
        player2.y_coordinate <= (player1.y_coordinate + constants.IMAGE_WIDTH);
}


function Hero(image, maxWidth, maxHeight, speed) {
    speed = speed || 256;
    image = image || util.mandatoryArg();
    maxWidth = maxWidth || util.mandatoryArg();
    maxHeight = maxHeight || util.mandatoryArg();
    Player.call(this, image, constants.movable_type, maxWidth, maxHeight, speed);
    this.reset();
}

Hero.prototype.reset = function () {
    this.x_coordinate = this.maxWidth / 2;
    this.y_coordinate = this.maxHeight / 2;
}

Hero.prototype = $.extend(true, {}, Player.prototype, Hero.prototype);
Hero.prototype.constructor = Hero;

function Monster(image, maxWidth, maxHeight) {
    image = image || util.mandatoryArg();
    maxWidth = maxWidth || util.mandatoryArg();
    maxHeight = maxHeight || util.mandatoryArg();
    Player.call(this, image, constants.immovable_type, maxWidth, maxHeight, 0);
    this.reset();
}

Monster.prototype.reset = function () {
    this.x_coordinate = constants.IMAGE_WIDTH + (Math.random() * (this.maxWidth - (2 * constants.IMAGE_WIDTH)));
    this.y_coordinate = constants.IMAGE_WIDTH + (Math.random() * (this.maxHeight - (2 * constants.IMAGE_WIDTH)));
}

Monster.prototype = $.extend(true, {}, Player.prototype, Monster.prototype);
Monster.prototype.constructor = Monster;

module.exports.Player = Player;
module.exports.Hero = Hero;
module.exports.Monster = Monster;
