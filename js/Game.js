// class: Rectangle
(() => {
    function Rectangle(left, top, w, h) {
        this.left = left || 0;
        this.top = top || 0;
        this.w = w || 0;
        this.h = h || 0;
        this.right = this.left + this.w;
        this.bottom = this.top + this.h;
    }

    Rectangle.prototype.set = function (left, top, /*optional*/w, /*optional*/h) {
        this.left = left;
        this.top = top;
        this.w = w || this.w;
        this.h = h || this.h
        this.right = (this.left + this.w);
        this.bottom = (this.top + this.h);
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

// class: Camera
(() => {
    // possibles axis to move the camera
    var AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    };

    function Camera(xView, yView, canvasw, canvash, worldw, worldh) {
        this.xView = xView || 0;
        this.yView = yView || 0;

        // distance from followed object to border before camera starts move
        this.xDeadZone = 0;
        this.yDeadZone = 0;

        this.wView = canvasw;
        this.hView = canvash;

        // allow camera to move in vertical and horizontal axis
        this.axis = AXIS.BOTH;

        // object that should be followed
        this.followed = null;

        // rectangle that represents the viewport
        this.viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);

        // rectangle that represents the world's boundary (map's boundary)
        this.worldRect = new Game.Rectangle(0, 0, worldw, worldh);

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
// class: Map
(() => {
    function Map(w, h) {
        this.w = w;
        this.h = h;

        // map texture
        this.image = new Image();
    }

    // generate a map
    Map.prototype.generate = function () {

        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = this.w;
        ctx.canvas.height = this.h;


        ctx.fillStyle = "#66FF66";
        ctx.rect(0, 0, this.w, this.h);
        ctx.fill();

        var backGround = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        ctx.beginPath();
        ctx.fillStyle = "#CC6600";
        for (var i = 0; i < backGround.length; ++i) {
            if (!backGround[i]) continue;
            ctx.rect((i % 20) * grid, ~~(i / 20) * grid, grid, grid);
        }
        ctx.fill();


        // setup house
        var house = new Game.Obj(canvasW - 100, canvasH - 100, pngSize.houseW, pngSize.houseH, "picture/house.png");
        house.img.setAttribute('crossOrigin', 'anonymous');
        house.img.onload = () => {

            ctx.drawImage(house.img, house.x, house.y, house.w, house.h);
            map.image.src = ctx.canvas.toDataURL("image/png");
        }
        house.img.src = "https://i.imgur.com/TbqD56q.png";


        objArr.push(house);









        /*
        // store the generate map as this image texture
        this.image = new Image();
        this.image.src = ctx.canvas.toDataURL("image/png");*/







        /*var i = 0, len1 = 0, len2 = 0;
        var counter1 = 0, counter2 = 0;
        var imgOk = false, AudOk = false;

        for (i in imgDic) {
            imgDic[i].addEventListener('load', incrementCounter1, false);
            ++len1;
        }
        
        function incrementCounter1() {
            ++counter1;
            if (counter1 === len1) {
                imgOk = true;
                console.log('All Image loaded!');
                if(imgOk && AudOk) display();
            }
        }
    
        */

    }

    // draw map  to camera
    Map.prototype.draw = function (context, xView, yView) {

        var sx, sy, dx, dy;
        var sw, sh, dw, dh;

        sx = xView;
        sy = yView;
        sw = canvasW;
        sh = canvasH;

        // if cropped image is smaller than canvas we need to change the source dimensions
        if (this.w - sx < sw)
            sw = this.w - sx;
        if (this.h - sy < sh)
            sh = this.h - sy;

        dx = 0;
        dy = 0;
        dw = sw;
        dh = sh;
        context.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh);

    }

    // add class
    Game.Map = Map;

})();

// class: Player
(() => {
    function Player(x, y, w, h, imgSrc0, imgSrc1, imgSrc2, imgSrc3, imgSrc4) {
        // (x, y) = center of object
        // and they are global position not local position !
        this.x = x;
        this.y = y;
        this.speed = 200;
        this.w = w;
        this.h = h;
        this.isBlink = false;
        this.imgArr = [];
        for (var i = 0; i < 5; ++i) {
            this.imgArr[i] = new Image();
            var src = eval("imgSrc" + i.toString());
            this.imgArr[i].src = src;
        }

        // initial direction (down)
        this.img = this.imgArr[1];

    }

    Player.prototype.update = function (step, worldw, worldh) {

        var lastX = this.x;
        var lastY = this.y;

        // move 
        if (Game.controls.left)
            this.x -= this.speed * step;
        if (Game.controls.up)
            this.y -= this.speed * step;
        if (Game.controls.right)
            this.x += this.speed * step;
        if (Game.controls.down)
            this.y += this.speed * step;

        // check if collision objects
        var x = (this.x - this.w / 2);
        var y = (this.y - this.h / 2);
        for (i in objArr) {
            if (((x > objArr[i].x && x < (objArr[i].x + objArr[i].w)) || ((x + this.w) > objArr[i].x && (x + this.w) < (objArr[i].x + objArr[i].w)))
                && ((y > objArr[i].y && y < (objArr[i].y + objArr[i].h)) || ((y + this.h) > objArr[i].y && (y + this.h) < (objArr[i].y + objArr[i].h)))) {
                this.x = lastX;
                this.y = lastY;
                return;
            }
        }

        // can't out of map
        if (this.x - this.w / 2 < 0) {
            this.x = this.w / 2;
        }
        if (this.y - this.h / 2 < 0) {
            this.y = this.h / 2;
        }
        if (this.x + this.w / 2 > worldw) {
            this.x = worldw - this.w / 2;
        }
        if (this.y + this.h / 2 > worldh) {
            this.y = worldh - this.h / 2;
        }
    }

    Player.prototype.draw = function (context, xView, yView) {
        // before draw , convert global position to local position			
        context.drawImage(this.img, (this.x - this.w / 2) - xView, (this.y - this.h / 2) - yView, this.w, this.h);
    }

    Player.prototype.rotate = function (dir) {
        // 0 -> up ;  1 -> down ;  3 -> left ;  4 -> right ;
        switch (dir) {
            case 1:
                this.img = this.imgArr[0];
                break;
            case 2:
                this.img = this.imgArr[1];
                break;
            case 3:
                this.img = this.imgArr[3];
                break;
            case 4:
                this.img = this.imgArr[4];
                break;
        }
    }

    Player.prototype.blink = function () {
        if (isBink) {

        } else {

        }
    }

    // add class
    Game.Player = Player;

})();

// class obj
(() => {
    function Obj(x, y, w, h, imgSrc) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = new Image();
        this.img.src = imgSrc;
    }


    Game.Obj = Obj;

})();

// Game settings:	
(() => {

    // set canvas
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    grid = ~~((canvasW + canvasH) / 40);
    canvas.width = canvasW;
    canvas.height = canvasH;


    /*
    // set picture size
    for (var e in pngSize) {
        pngSize[e] *= 2;
    }
    */

    // game settings:	
    var FPS = 60;
    var INTERVAL = 1000 / FPS; // milliseconds
    var STEP = INTERVAL / 1000 // seconds

    // setup an object that represents the map
    map = new Game.Map(1500, 1000)

    // generate an image texture for the map
    map.generate();

    // setup player
    player = new Game.Player(50, 50, pngSize.playerW, pngSize.playerH
        , "picture/MikuStandBack.png"
        , "picture/MikuStand1.png", "picture/MikuStand2.png"
        , "picture/MikuStandLeft.png", "picture/MikuStandRight.png");

    // setup camera 
    camera = new Game.Camera(0, 0, canvasW, canvasH, map.w, map.h);
    camera.follow(player, canvasW / 2, canvasH / 2);
    // update function
    var update = () => {
        player.update(STEP, map.w, map.h);
        camera.update();
    }

    // draw function
    var draw = () => {
        // clear canvas
        context.clearRect(0, 0, canvasW, canvasH);
        // redraw all objects
        map.draw(context, camera.xView, camera.yView);
        player.draw(context, camera.xView, camera.yView);
    }

    // Game Loop
    var gameLoop = () => {
        update();
        draw();
    }

    var runningId = -1;


    //---------------------------
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

