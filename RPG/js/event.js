
function addkeyEvent() {
    document.addEventListener('keydown', (event) => {
        if (!canWalk)
            return;
        switch (event.code) {
            case 'ArrowUp':
                player.y -= speed;
                drawRole();
                canWalk = false;
                setTimeout(() => {
                    canWalk = true;
                }, 20);
                break;
            case 'ArrowDown':
                player.y += speed;
                drawRole();
                canWalk = false;
                setTimeout(() => {
                    canWalk = true;
                }, 20);
                break;
            case 'ArrowLeft':
                player.x -= speed;
                drawRole();
                canWalk = false;
                setTimeout(() => {
                    canWalk = true;
                }, 20);
                break;
            case 'ArrowRight':
                player.x += speed;
                drawRole();
                canWalk = false;
                setTimeout(() => {
                    canWalk = true;
                }, 20);
                break;
        }
    })
}
