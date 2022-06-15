var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGrid();
    console.log('noice');
}

function onImg(imgUrl) {
    console.log('click on img id', imgUrl);
    var elImgContainer = document.querySelector('.img-container');
    elImgContainer.style.display = 'none';
    var canvasContainer = document.querySelector('.canvas-container');
    canvasContainer.style.display = 'grid';
    loadImageToCanvas(imgUrl);
    // var elGeneratorContainer = document.querySelector('.generator-container');
    // elGeneratorContainer.style.display = 'block';
}

function loadImageToCanvas(imgUrl) {
    var img = new Image(); // Create a new html img element
    img.src = imgUrl; // Set the img src to the img file we read

    img.onload = gCtx.drawImage(img, 0, 0);
}

function onGallery() {
    console.log('click on gallery');
}
function onAbout() {
    console.log('click on on About');
}

function renderGrid() {
    var strHTML = ``;
    var imgs = getImgs();
    imgs.forEach((img) => {
        strHTML += `<img onclick="onImg('${img.url}')" src="/${img.url}" alt="">`;
    });

    var elImgContainer = document.querySelector('.img-container');
    elImgContainer.innerHTML = strHTML;
}
