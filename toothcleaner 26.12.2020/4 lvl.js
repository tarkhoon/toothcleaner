'use strict;'

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var currentLevel = 0;

var player, obstacles, coins, invisObst;

var CANVAS_WIDTH = 1450;
var CANVAS_HEIGHT = 650;
var FPS = 60;

var then, now, elepsed, fpsInterval;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var setLevel = function (lvl) {
    player = {
        xPrev: 0,
        yPrev: 0,
        width: 32,
        height: 64,
        x: 150,
        y: 500,
        xVelocity: 0,
        yVelocity: 0,
        jumping: true,
        coins: 0
    };
    invisObst = [
        {
            width: 70,
            height: 5,
            x: 300,
            y: 350
        },
        {
            width: 500,
            height: 5,
            x: 500,
            y: 200
        }
    ];
    obstacles = [
        {
            width: 1500,
            height: 50,
            x: 0,
            y: 640
        },
        {
            width: 400,
            height: 300,
            x: 550,
            y: 500
        }
    ];
    coins = [
        {
            width: 25,
            height: 25,
            x: 1252,
            y: 350
        }
    ];
    pila = [
        {
            width: 50,
            height: 50,
            x: -100,
            y: 0
        }
    ];
    moveObst = [
        {
            width: 100,
            height: 20,
            x: -200,
            y: 200,
            xVelocity: 0,
            center: -200,
            speed: 0.05
        }
    ];
}

var controller = {
    left: false,
    right: false,
    up: false,
    KeyListener: function (evt) {
        var keyState = (evt.type == "keydown") ? true : false;
        switch (evt.keyCode) {
            case 37:
                controller.left = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
        }
    }
};

var startAnimation = function (fps) {
    setLevel(currentLevel);
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animation(then);
};

var animation = function (newTime) {
    window.requestAnimationFrame(animation);
    now = newTime;
    elepsed = now - then;
    if (elepsed > fpsInterval) {
        then = now - (elepsed % fpsInterval);
        update();
        draw();
    }
};

var isCollided = function (obst, obj) {
    if (obj.x + obj.width > obst.x
        && obj.x < obst.x + obst.width
        && obj.y < obst.y + obst.height
        && obj.y + obj.height > obst.y) {
        return true;
    } else {
        false;
    }
}

var collideHandler = function (obst, obj) {
    if (isCollided(obst, obj)) {
        if (obj.xPrev >= obst.x + obst.width) {
            obj.x = obst.x + obst.width;
            obj.xVelocity = 0;
        }
        if (obj.xPrev + obj.width <= obst.x) {
            obj.x = obst.x - obj.width;
            obj.xVelocity = 0;
        }
        if (obj.yPrev + obj.height <= obst.y) {
            obj.y = obst.y - obj.height;
            obj.yVelocity = 0;
            obj.jumping = false;
        }
        if (obj.yPrev >= obst.y + obst.height) {
            obj.y = obst.y + obst.height;
            obj.yVelocity = 0;
        }
    }
}

var coinHandler = function (coin, obj) {
    if (isCollided(coin, obj)) {
        coin.x = -25;
        document.location = ('5 lvl.html');
    }
}

var update = function () {

    player.xPrev = player.x;
    player.yPrev = player.y;

    if (controller.up && player.jumping === false) {
        player.yVelocity -= 20;
        player.jumping = true;

    }

    if (controller.left) {
        player.xVelocity -= 1.5;
    }

    if (controller.right) {
        player.xVelocity += 1.5;
    }

    player.yVelocity += 1;
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    player.xVelocity *= 0.8;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x > CANVAS_WIDTH - player.width) {
        player.x = CANVAS_WIDTH - player.width;
    }

    if (player.y > CANVAS_HEIGHT - player.height) {
        player.y = CANVAS_HEIGHT - player.height;
        player.yVelocity = 0;
        player.jumping = false;
    }

    for (var i = 0; i < obstacles.length; i++) {
        collideHandler(obstacles[i], player);
    }

    for (var i = 0; i < invisObst.length; i++) {
        collideHandler(invisObst[i], player);
    }

    for (var i = 0; i < coins.length; i++) {
        coinHandler(coins[i], player);
    }
};

var drawObject = function (obj, style) {
    context.fillStyle = style;
    context.fillRect(obj.x, obj.y, obj.width, obj.height);
}

var text = function (text) {
    context.fillStyle = '#0000ff';
    context.font = 'normal 30px Arial';
    context.fillText(text, 50, 100);
}

var draw = function () {
    //фон
    context.fillStyle = '#00ffff';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //игрок
    drawObject(player, '#ffff00')

    //препятствие
    for (var i = 0; i < obstacles.length; i++) {
        drawObject(obstacles[i], '#ff0000')
    };

    //монетки
    for (var i = 0; i < coins.length; i++) {
        drawObject(coins[i], '#ff00ff');
    }

    //невидимые препятствия
    for (var i = 0; i < invisObst.length; i++) {
        drawObject(invisObst[i], '#cccc99');
    }

    //количество монет
    context.fillStyle = '#0000ff';
    context.font = 'normal 25px Arial';
    context.fillText('Уровень 4', 20, 50);

    //Тексты
    text('Иногда в Якутии из-за тумана ничего не видно');
};

startAnimation(FPS);

window.addEventListener("keydown", controller.KeyListener);
window.addEventListener("keyup", controller.KeyListener);