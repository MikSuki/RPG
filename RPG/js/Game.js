// class Rectangle
(() => {
    function Rectangle(left, top, width, height) {
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    Rectangle.prototype.set = function (left, top, /*optional*/width, /*optional*/height) {
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    }

    // in or out of screen
    Rectangle.prototype.within = function (r) {
        return (r.left <= this.left &&
            r.right >= this.right &&
            r.top <= this.top &&
            r.bottom >= this.bottom);
    }
    Rectangle.prototype.overlaps = function (r) {
        return (this.left < r.right &&
            r.left < this.right &&
            this.top < r.bottom &&
            r.top < this.bottom);
    }

    // add class
    Game.Rectangle = Rectangle;
})();

// class Camera
(() => {
    // possibles axis to move the camera
    var AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    };

    function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        this.xView = xView || 0;
        this.yView = yView || 0;

        // distance from followed object to border before camera starts move
        this.xDeadZone = 0;
        this.yDeadZone = 0;

        this.wView = canvasWidth;
        this.hView = canvasHeight;

        // allow camera to move in vertical and horizontal axis
        this.axis = AXIS.BOTH;

        // object that should be followed
        this.followed = null;

        // rectangle that represents the viewport
        this.viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);

        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new Game.Rectangle(0, 0, worldWidth, worldHeight);

    }

    Camera.prototype.follow = function (Game, xDeadZone, yDeadZone) {
        this.followed = Game;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    }

    Camera.prototype.update = function () {
        // following......
        if (this.followed != null) {
            // horizontal
            if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
                if (this.followed.x - this.xView + this.xDeadZone > this.wView)
                    this.xView = this.followed.x - this.wView + this.xDeadZone;
                else if (this.followed.x - this.xView - this.xDeadZone < 0)
                    this.xView = this.followed.x - this.xDeadZone;

            }
            // vertical
            if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
                if (this.followed.y - this.yView + this.yDeadZone > this.hView)
                    this.yView = this.followed.y - this.hView + this.yDeadZone;
                else if (this.followed.y - this.yView - this.yDeadZone < 0)
                    this.yView = this.followed.y - this.yDeadZone;
            }
        }

        // update viewportRect
        this.viewportRect.set(this.xView, this.yView);

        // don't let camera leaves the world's boundary
        if (!this.viewportRect.within(this.worldRect)) {
            if (this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if (this.viewportRect.top < this.worldRect.top)
                this.yView = this.worldRect.top;
            if (this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if (this.viewportRect.bottom > this.worldRect.bottom)
                this.yView = this.worldRect.bottom - this.hView;
        }

    }

    // add class
    Game.Camera = Camera;

})();

// class Map
(() => {
    function Map(width, height) {
        this.width = width;
        this.height = height;

        // map texture
        this.image = null;
    }

    // generate a map
    Map.prototype.generate = function () {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;

        var rows = ~~(this.width / 44) + 1;
        var columns = ~~(this.height / 44) + 1;

        var color = "#66FF66";
        ctx.save();
        ctx.fillStyle = "#66FF66";
        for (var x = 0, i = 0; i < rows; x += 44, i++) {
            ctx.beginPath();
            for (var y = 0, j = 0; j < columns; y += 44, j++) {
                ctx.rect(x, y, 40, 40);
            }
            color = (color == "#66FF66" ? "#CC6600" : "#66FF66");
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();

        // store the generate map as this image texture
        this.image = new Image();
        this.image.src = ctx.canvas.toDataURL("image/png");

    }

    // draw map  to camera
    Map.prototype.draw = function (context, xView, yView) {

        var sx, sy, dx, dy;
        var sWidth, sHeight, dWidth, dHeight;

        sx = xView;
        sy = yView;
        sWidth = context.canvas.width;
        sHeight = context.canvas.height;

        // if cropped image is smaller than canvas we need to change the source dimensions
        if (this.image.width - sx < sWidth)
            sWidth = this.image.width - sx;
        if (this.image.height - sy < sHeight)
            sHeight = this.image.height - sy;

        dx = 0;
        dy = 0;
        dWidth = sWidth;
        dHeight = sHeight;

        context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }

    // add class
    Game.Map = Map;

})();

// class Player
(() => {
    function Player(x, y, w, h, imgSrc) {
        // (x, y) = center of object
        // and they are global pos not local pos !
        this.x = x;
        this.y = y;
        this.speed = 200;
        this.width = w;
        this.height = h;
        this.img = new Image();
        this.img.src = imgSrc;
    }

    Player.prototype.update = function (step, worldWidth, worldHeight) {

        // move 
        if (Game.controls.left)
            this.x -= this.speed * step;
        if (Game.controls.up)
            this.y -= this.speed * step;
        if (Game.controls.right)
            this.x += this.speed * step;
        if (Game.controls.down)
            this.y += this.speed * step;

        // can't out of map
        if (this.x - this.width / 2 < 0) {
            this.x = this.width / 2;
        }
        if (this.y - this.height / 2 < 0) {
            this.y = this.height / 2;
        }
        if (this.x + this.width / 2 > worldWidth) {
            this.x = worldWidth - this.width / 2;
        }
        if (this.y + this.height / 2 > worldHeight) {
            this.y = worldHeight - this.height / 2;
        }
    }

    Player.prototype.draw = function (context, xView, yView) {
        // before draw , convert global position to local position			
        context.drawImage(this.img, (this.x - this.width / 2) - xView, (this.y - this.height / 2) - yView, this.width, this.height);
    }

    // add class
    Game.Player = Player;

})();


// Game 
(() => {

    // set canvas
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    canvas.width = canvasW;
    canvas.height = canvasH;

    // set picture size
    for(var e in pictureSize) {
        pictureSize[e] *= 2;
    }

    // game settings:	
    var FPS = 60;
    var INTERVAL = 1000 / FPS; // milliseconds
    var STEP = INTERVAL / 1000 // seconds

    // setup an object that represents the room
    var room = {
        width: 5000,
        height: 3000,
        map: new Game.Map(5000, 3000)
    };

    // generate an image texture for the room
    room.map.generate();

    // setup player
    player = new Game.Player(50, 50, pictureSize.playerW, pictureSize.playerH, "picture/MikuStand1.png");

    // setup camera 
    camera = new Game.Camera(0, 0, canvasW, canvasH, room.width, room.height);
    camera.follow(player, canvasW / 2, canvasH / 2);
    // update function
    var update = () => {
        player.update(STEP, room.width, room.height);
        camera.update();
    }

    // draw function
    var draw = () => {
        // clear canvas
        context.clearRect(0, 0, canvasW, canvasH);

        // redraw all objects
        room.map.draw(context, camera.xView, camera.yView);
        player.draw(context, camera.xView, camera.yView);
    }

    // Game Loop
    var gameLoop = () => {
        update();
        draw();
    }

    var runningId = -1;

    Game.play = () => {
        if (runningId == -1) {
            runningId = setInterval(() => {
                gameLoop();
            }, INTERVAL);
        }
    }

    Game.pause = function () {
        if (runningId == -1) {
            Game.play();
        }
        else {
            clearInterval(runningId);
            runningId = -1;
        }
    }

})();

Game.controls = {
    left: false,
    up: false,
    right: false,
    down: false,
};



