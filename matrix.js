var scr;
var symbols;
var size = 20;
var lineDensity = 0.7;
var baseColor = [0, 127, 0]; // Green is dominant: R and B are never more than 80% of G.
// baseColor = [0, 127, 255]; // Try [255, 127, 255] or [0, 127, 255], etc, for nice variants
// baseColor = [255, 127, 255];
// baseColor = [255, 127, 0];
var baseColorVariation = [60, 60, 60];
var internalColorVariation = [20, 60, 60];
var framerate = 30;

function setup() {
    framerate = 30;

    frameRate(framerate);
    let cv = createCanvas(windowWidth, windowHeight);
    cv.position(0, 0);

    symbols = getSymbols(KATAKANA);

    redo();
}

function draw() {
    if(scr !== undefined) scr.draw();
}

function windowResized() {
    redo();
}

function doubleClicked() {
    fullscreen(!fullscreen());

    redo();
}

function redo() {
    resizeCanvas(windowWidth, windowHeight);
    let rows = Math.ceil(windowWidth/size);
    let cols = Math.ceil(windowHeight/size);
    background('black');
    scr = new Screen(cols, rows);
    for(let i = 0; i < Math.floor(lineDensity*rows); i++) scr.addLine();
}
