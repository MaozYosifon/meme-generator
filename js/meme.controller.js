'use strict';
var gElCanvas;
var gCtx;
var gStartPos;
var gCurrMemeLineIdx = 0;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function init() {
    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d');
    renderMainContent();
    addListeners();
}

function onImg(imgUrl, id) {
    setGMemeImgId(id);
    var elImgContainer = document.querySelector('.img-container');
    elImgContainer.style.display = 'none';
    var canvasContainer = document.querySelector('.main-canvas-container');
    canvasContainer.style.display = 'flex';
    loadImageToCanvas(imgUrl);
    setFirstMeme();
}

function getUserText() {
    var elInput = document.querySelector('.text-input');
    return elInput.value;
}

function onAddLine() {
    setAddLine();
    renderCanvas();
}

function onGallery() {
    var elImgContainer = document.querySelector('.img-container');
    elImgContainer.style.display = 'grid';
    var canvasContainer = document.querySelector('.main-canvas-container');
    canvasContainer.style.display = 'none';
}

function onAbout() {
    console.log('click on on About');
}

function onChangeText(text) {
    setText(text);
    renderCanvas();
}

function renderMainContent() {
    var strHTML = ``;
    var imgs = getImgs();
    imgs.forEach((img) => {
        strHTML += `<img onclick="onImg('${img.url}', ${img.id})" id="${img.id}" src="img/${img.url}" alt="">`;
    });

    var elImgContainer = document.querySelector('.img-container');
    elImgContainer.innerHTML = strHTML;
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    var meme = getMeme();
    if (meme) drawImage(meme.selectedImgId);
    meme.lines.forEach((line) => {
        gCtx.lineWidth = 1;
        gCtx.strokeStyle = line.colorStroke;
        gCtx.fillStyle = line.colorFill;
        gCtx.font = line.size + 'px ' + line.font;
        line.currentWidth = gCtx.measureText(line.txt).width;
        if (line.isSticker) {
            var img = new Image();
            img.src = line.src;
            img.onload = gCtx.drawImage(img, line.x, line.y, line.sizeWidth, line.sizeHeight);
        } else {
            gCtx.fillText(line.txt, line.x, line.y);
            gCtx.strokeText(line.txt, line.x, line.y);
        }
    });
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    //Listen for resize ev
    window.addEventListener('resize', () => {
        // resizeCanvas();
        renderCanvas();
    });
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function getClickPos(ev) {
    //Gets the offset pos , the default pos
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    };
    // Check if its a touch ev
    if (gTouchEvs.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault();
        //Gets the first touch point
        ev = ev.changedTouches[0];
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        };
    }
    return pos;
}

function getPressedMemeLineIdx(clickPos) {
    var meme = getMeme();
    return meme.lines.findIndex(
        (line) =>
            clickPos.x > line.rectSize.pos.x &&
            clickPos.x < line.rectSize.pos.x + line.rectSize.width &&
            clickPos.y > line.rectSize.pos.y &&
            clickPos.y < line.rectSize.pos.y + line.rectSize.height
    );
}

function onDown(ev) {
    //Get the ev pos from mouse or touch
    const pos = getClickPos(ev);
    var lineIdx = getPressedMemeLineIdx(pos);
    if (lineIdx == -1) return;
    var meme = getMeme();
    var currMemeLine = meme.lines[lineIdx];
    document.querySelector('.text-input').value = currMemeLine.txt;
    gCtx.beginPath();
    gCtx.rect(
        currMemeLine.rectSize.pos.x,
        currMemeLine.rectSize.pos.y,
        currMemeLine.rectSize.width,
        currMemeLine.rectSize.height
    );
    gCtx.stroke();
    meme.selectedLineIdx = lineIdx;
    document.body.style.cursor = 'grabbing';
    setLineDrag(true);
    gStartPos = pos;
}

function onMove(ev) {
    const meme = getMeme();
    const pos = getClickPos(ev);
    var lineIndex = getPressedMemeLineIdx(pos);
    if (lineIndex == -1) return;
    if (meme.lines[lineIndex].isDrag) {
        //Calc the delta , the diff we moved
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        moveLine(meme.lines[lineIndex], dx, dy);
        //Save the last pos , we remember where we`ve been and move accordingly
        gStartPos = pos;
        //The canvas is render again after every move
        renderCanvas();
    }
    gCurrMemeLineIdx = lineIndex;
}

function onUp(ev) {
    setLineDrag(false);
    document.body.style.cursor = 'unset';
    const pos = getClickPos(ev);
    const meme = getMeme();
    meme.selectedLineIdx = getPressedMemeLineIdx(pos);
}

function drawImage(id) {
    if (!id) return;
    var elImg = document.getElementById(id);
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function moveLine(memeLine, dx, dy) {
    memeLine.x += dx;
    memeLine.y += dy;
    memeLine.rectSize.pos.x += dx;
    memeLine.rectSize.pos.y += dy;
}

function loadImageToCanvas(imgUrl) {
    var img = new Image();
    img.src = `img/${imgUrl}`;
    var meme = getMeme();
    meme.startedLineIdx++;
    img.onload = gCtx.drawImage(img, 0, 0);
}

function setFirstMeme() {
    addNewLineTxt('I sometimes eat Falafel', 50, 10);
    var memeLine = getMeme().lines[0];
    gCtx.lineWidth = 1;
    gCtx.strokeStyle = memeLine.colorStroke;
    gCtx.fillStyle = memeLine.colorFill;
    gCtx.font = memeLine.size + 'px ' + memeLine.font;
    gCtx.fillText(memeLine.txt, memeLine.x, memeLine.y);
    gCtx.strokeText(memeLine.txt, memeLine.x, memeLine.y);
}

function setAddLine() {
    var text = getUserText();
    addNewLineTxt(text);
    const meme = getMeme();
    var memeLine = meme.lines[meme.lines.length - 1];
    gCtx.lineWidth = 1;
    gCtx.strokeStyle = memeLine.colorStroke;
    gCtx.fillStyle = memeLine.colorFill;
    gCtx.font = memeLine.size + 'px ' + memeLine.font;
    gCtx.fillText(text, memeLine.x, memeLine.y);
    gCtx.strokeText(text, memeLine.x, memeLine.y);
    meme.startedLineIdx++;
}

function onFontChange(font) {
    setFont(font);
    renderCanvas();
}

function onAlignLeft() {
    setAlignLeft();
    renderCanvas();
}

function onAlignRight() {
    setAlignRight(gElCanvas.width);
    renderCanvas();
}

function onAlignCenter() {
    setAlignCenters(gElCanvas.width);
    renderCanvas();
}

function onIncreaseFont() {
    setIncreaseFont();
    renderCanvas();
}

function onDecreaseFont() {
    setDecreaseFont();
    renderCanvas();
}

function onSetFillColor(color) {
    setFillColor(color);
    renderCanvas();
}
function onSetStrokeColor(color) {
    setStrokeColor(color);
    renderCanvas();
}
function downloadCanvas(elLink) {
    //gets the canvas content and convert it to base64 data URL that can be save as an image
    const data = gElCanvas.toDataURL(); //method returns a data URL containing a representation of the image in the format specified by the type parameter.
    elLink.href = data; //put it on the link
    elLink.download = 'puski'; //can change the name of the file
}

function onShare() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg'); // Gets the canvas content as an image format
    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        //Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        //Create a link that on click will make a post in facebook with the image we uploaded
        document.querySelector('.share').innerHTML = `
      <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
         Share   
      </a>`;
    }
    //Send the image to the server
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {
    //Pack the image for delivery
    const formData = new FormData();
    formData.append('img', imgDataUrl);
    //Send a post req with the image to the server
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData,
    }) //Gets the result and extract the text/ url from it
        .then((res) => res.text())
        .then((url) => {
            console.log('Got back live url:', url);
            //Pass the url we got to the callBack func onSuccess, that will create the link to facebook
            onSuccess(url);
            document.querySelector('.btn').click();
        })
        .catch((err) => {
            console.error(err);
        });
}

function onMoveLine() {
    document.querySelector('.text-input').value = getMoveLine();
    renderCanvas();
}

function onRemoveLine() {
    setRemoveLine();
    document.querySelector('.text-input').value = '';
    renderCanvas();
}

function onAddSticker(stickerSrc) {
    addNewLineSticker(stickerSrc);
    renderCanvas();
}
function getElCanvas() {
    return gElCanvas;
}

function toggleMenu(elBtn) {
    document.body.classList.toggle('menu-open');
    document.body.classList.contains('menu-open') ? (elBtn.innerText = 'X') : (elBtn.innerText = '☰');
}
