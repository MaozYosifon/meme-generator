'use strict';

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'tramp'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dog'] },
    { id: 3, url: 'img/3.jpg', keywords: ['cute', 'baby Dog'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute', 'cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny', 'history'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny', 'man'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'obama'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny', 'kiss'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', 'we want you'] },
    { id: 13, url: 'img/13.jpg', keywords: ['funny', 'cheers'] },
    { id: 14, url: 'img/14.jpg', keywords: ['funny', 'man'] },
    { id: 15, url: 'img/15.jpg', keywords: ['funny', 'man'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'man'] },
    { id: 17, url: 'img/17.jpg', keywords: ['cute', 'putin'] },
    { id: 18, url: 'img/18.jpg', keywords: ['funny', 'toy story'] },
];

var gIdLine = 0;

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    startedLineIdx: 0,
    lines: [],
};

function addNewLineTxt(
    txt,
    textLocationHeight = document.querySelector('.canvas').height / 2,
    rectHeigh = document.querySelector('.canvas').height / 2 - 50
) {
    gIdLine++;
    gMeme.lines.push({
        id: gIdLine,
        txt: txt,
        size: 50,
        align: 'center',
        font: 'impact',
        colorFill: 'white',
        colorStroke: 'black',
        x: 10,
        y: textLocationHeight,
        rectSize: {
            pos: { x: 5, y: rectHeigh },
            height: 50,
            width: 490,
        },
        isDrag: false,
        isSticker: false,
    });
}

function getImgs() {
    return gImgs;
}

function getMeme() {
    return gMeme;
}

function setGMemeImgId(id) {
    gMeme.selectedImgId = id;
}

function setLineDrag(isDrag) {
    if (gMeme.selectedLineIdx === -1 || !gMeme.lines.length) return;
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag;
}

function setText(text) {
    if (gMeme.selectedLineIdx === -1 || gMeme.lines.length === 0) return;
    gMeme.lines[gMeme.selectedLineIdx].txt = text;
}

function setFont(font) {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function setIncreaseFont() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].size++;
}

function setDecreaseFont() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].size--;
}

function setFillColor(color) {
    if (gMeme.selectedLineIdx === -1) return;
    if (!color) color = 'white';
    gMeme.lines[gMeme.selectedLineIdx].colorFill = color;
}

function setStrokeColor(color) {
    if (gMeme.selectedLineIdx === -1) return;
    if (!color) color = 'black';
    gMeme.lines[gMeme.selectedLineIdx].colorStroke = color;
}

function setAlignLeft() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].x = 0;
}

function setAlignRight(canvasWidth) {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].x = canvasWidth - gMeme.lines[gMeme.selectedLineIdx].currentWidth;
}

function setAlignCenters(canvasWidth) {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].x = canvasWidth / 2 - gMeme.lines[gMeme.selectedLineIdx].currentWidth / 2;
}

function getMoveLine() {
    if (gMeme.selectedLineIdx === -1) gMeme.selectedLineIdx = 0;
    else if (gMeme.selectedLineIdx >= 0 && gMeme.selectedLineIdx !== gMeme.lines.length - 1) gMeme.selectedLineIdx++;
    else if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    return gMeme.lines[gMeme.selectedLineIdx].txt;
}

function setRemoveLine() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}

function addNewLineSticker(stickerSrc) {
    var elCanvas = getElCanvas();
    gIdLine++;
    gMeme.lines.push({
        id: gIdLine,
        txt: '',
        src: stickerSrc,
        size: 100,
        sizeWidth: 200,
        sizeHeight: 200,
        x: elCanvas.width / 2,
        y: elCanvas.height / 2,
        rectSize: {
            pos: { x: elCanvas.width / 2, y: elCanvas.height / 2 },
            height: 110,
            width: 110,
        },
        isDrag: false,
        isSticker: true,
    });
}
