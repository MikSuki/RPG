window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 37: // left arrow
            Game.controls.left = true;
            Game.controls.right = false;
            player.rotate(3);
            break;
        case 38: // up arrow
            Game.controls.up = true;
            Game.controls.down = false;
            player.rotate(1);
            break;
        case 39: // right arrow
            Game.controls.right = true;
            Game.controls.left = false;
            player.rotate(4);
            break;
        case 40: // down arrow
            Game.controls.down = true;
            Game.controls.up = false;
            player.rotate(2);
            break;
    }
}, false);

window.addEventListener("keyup", (e) => {
    switch (e.keyCode) {
        case 37: // left arrow
            Game.controls.left = false;
            break;
        case 38: // up arrow
            Game.controls.up = false;
            break;
        case 39: // right arrow
            Game.controls.right = false;
            break;
        case 40: // down arrow
            Game.controls.down = false;
            break;
        case 80: // key P pauses the game
            //Game.togglePause();
            break;
    }
}, false);
