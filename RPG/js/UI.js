function setcanvas() {
    mCanvas = document.getElementById("mainCanvas");
    bCanvas = document.getElementById("backCanvas");

    mCtx = mCanvas.getContext("2d");
    bCtx = bCanvas.getContext("2d");

    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    mCanvas.width = canvasW;
    bCanvas.width = canvasW;
    mCanvas.height = canvasH;
    bCanvas.height = canvasH;
}