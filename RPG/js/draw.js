function drawBack(){
}

function drawRole(){
    mCtx.clearRect(0, 0, canvasW, canvasH);
    mCtx.fillStyle = "#000000";
    mCtx.fillRect(player.x, player.y, player.w, player.h);
}
