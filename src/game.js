import {getImage, mandatoryArgument} from './utility_functions';
import constants from './constants';
import {Player, Hero, Monster} from './Player';

export class Game {
    constructor(width = 512, height = 480) {
        this.score         = 0;
        this.canvas = document.createElement('canvas');
        this.canvas.width  = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);
        [this.bgImage, this.heroImage, this.monsterImage] = [undefined, undefined, undefined];
        [this.hero, this.monster] = [undefined, undefined];
        this.keysDown = {};
        this.then = undefined;
    }

    initialize() {
        let imageURLKeys = ['bgImageURL', 'heroImageURL', 'monsterImageURL'];
        return new Promise((resolve, reject) => {
            Promise.all(imageURLKeys.map((key) => getImage(constants[key])))
                .then(images => {
                    [this.bgImage, this.heroImage, this.monsterImage] = images;
                    this.hero    = new Hero(this.heroImage, this.canvas.width, this.canvas.height);
                    this.monster = new Monster(this.monsterImage, this.canvas.width, this.canvas.height);
                    setTimeout(this.render.bind(this), 0);
                    this.addEvents();
                    resolve(this);
                })
        })

    }

    render() {
        let canvasContext = this.canvas.getContext("2d");
		canvasContext.drawImage(this.bgImage, 0, 0);
		canvasContext.drawImage(this.heroImage, this.hero.x_coordinate, this.hero.y_coordinate);
		canvasContext.drawImage(this.monsterImage, this.monster.x_coordinate, this.monster.y_coordinate);
        canvasContext.fillStyle = "rgb(0, 0, 0)";
        canvasContext.font = "24px Helvetica";
        canvasContext.textAlign = "left";
        canvasContext.textBaseline = "top";
        canvasContext.fillText(`Goblins caught: ${this.score}`, constants.IMAGE_WIDTH, constants.IMAGE_WIDTH);
    }

    addEvents() {
        var that = this
        addEventListener("keydown", (e) => that.keysDown[e.keyCode] = true , false);
        addEventListener("keyup", (e) => delete that.keysDown[e.keyCode], false);
    }

    start() {
        let now = Date.now();
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
}