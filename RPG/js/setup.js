window.onload = () => {
    setcanvas();

    drawBack();

    player = new obj(Math.floor(canvasW / 2), Math.floor(canvasH / 2), 50, 50);
    addkeyEvent();
    drawRole();
}
