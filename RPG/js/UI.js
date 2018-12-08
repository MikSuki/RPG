function setcanvas() {
    bCanvas = document.getElementById("backCanvas");

    bCtx = bCanvas.getContext("2d");

    bCanvas.width = canvasW;
    bCanvas.height = canvasH;
}