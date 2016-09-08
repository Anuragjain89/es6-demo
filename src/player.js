import {mandatoryArg} from './utility_functions';
import constants from './constants';

// ----------------------------------------------------------------------------------------------------------
// ABSTRACT CLASS : PLAYER
// The sub-classes need to implement the reset method.
// ----------------------------------------------------------------------------------------------------------
export class Player {
    constructor(image, type, maxWidth, maxHeight, speed) {

        // Check abstract behavior.
        if (this.constructor === Player) { throw new TypeError("Cannot construct Abstract instances directly"); }
        if (this.reset === undefined) { throw new Error("Mandatory method not implemented in sub-class"); }

        this.image        = image;
        this.type         = type;
        this.speed        = speed;
        this.maxWidth     = maxWidth;
        this.maxHeight    = maxHeight;
        this.x_coordinate = 0;
        this.y_coordinate = 0;

    }

    updatePosition(keysDown = mandatoryArg(), deltaDuration = mandatoryArg()) {
        if (this.type === constants.movable_type) {
            let keys = Object.keys(keysDown)
            if (keys.length) {
                if (keys.includes(constants.UP_KEY))    { this.y_coordinate -= (this.speed * deltaDuration / 1000); }
                if (keys.includes(constants.DOWN_KEY))  { this.y_coordinate += (this.speed * deltaDuration / 1000); }
                if (keys.includes(constants.LEFT_KEY))  { this.x_coordinate -= (this.speed * deltaDuration / 1000); }
                if (keys.includes(constants.RIGHT_KEY)) { this.x_coordinate += (this.speed * deltaDuration / 1000); }
            }
        }
    }

    static isTouching(player1, player2) {
        return player1.x_coordinate <= (player2.x_coordinate + constants.IMAGE_WIDTH) &&
               player2.x_coordinate <= (player1.x_coordinate + constants.IMAGE_WIDTH) &&
		       player1.y_coordinate <= (player2.y_coordinate + constants.IMAGE_WIDTH) &&
		       player2.y_coordinate <= (player1.y_coordinate + constants.IMAGE_WIDTH);
    }
}

export class Hero extends Player {
    constructor(image = mandatoryArg(), maxWidth = mandatoryArg(), maxHeight = mandatoryArg(), speed = 256) {
        super(image, constants.movable_type, maxWidth, maxHeight, speed);
        this.reset();
    }

    reset() {
        this.x_coordinate = this.maxWidth / 2;
        this.y_coordinate = this.maxHeight / 2;
    }
}

export class Monster extends Player {
    constructor(image = mandatoryArg(), maxWidth = mandatoryArg(), maxHeight = mandatoryArg()) {
        super(image, constants.immovable_type, maxWidth, maxHeight, 0);
        this.reset();
    }

    reset() {
        this.x_coordinate = constants.IMAGE_WIDTH + (Math.random() * (this.maxWidth - (2 * constants.IMAGE_WIDTH)));
        this.y_coordinate = constants.IMAGE_WIDTH + (Math.random() * (this.maxHeight - (2 * constants.IMAGE_WIDTH)));
    }
}