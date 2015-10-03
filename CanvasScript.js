var originalImage;
var originalScaleFactor;

var ZOOM_FACTOR = 2.0;

var setUp = function() {
	setUpFileUpload();
}

var setUpZoomCanvas = function(image) {
	var canvas = $('<canvas/>', { id : 'zoomCanvas'});
	canvas.css('border', 'solid 1px black');
	$('#dynamicContent').append(canvas);

	var originalCanvas = document.getElementById('canvas');
	var zoomCanvas = document.getElementById('zoomCanvas');

	zoomCanvas.height = originalCanvas.height;
	zoomCanvas.width = originalCanvas.width;

	$('#canvas').on('click', drawZoomImage);
}

/*
 * Renders an image zoomed by ZOOM_FACTOR
 * e is the event associated with the click, which represents
 * the center of the new zoomed image.
 * If the point clicked would caused zooming to have empty parts
 * of the canvas, the point clicked is readjusted.
 */
var drawZoomImage = function(e) {

	var zoomCanvas = document.getElementById('zoomCanvas');
	var xCoord = e.offsetX;
	var yCoord = e.offsetY;
	xCoord = xCoord * originalScaleFactor * ZOOM_FACTOR;
	yCoord = yCoord * originalScaleFactor * ZOOM_FACTOR;
	var xCorner = xCoord - (zoomCanvas.width * .5);
	var yCorner = yCoord - (zoomCanvas.height * .5);
	xCorner /= ZOOM_FACTOR;
	yCorner /= ZOOM_FACTOR;
	xCorner = Math.max(xCorner, 0);
	yCorner = Math.max(yCorner, 0);

	var maxX = ((zoomCanvas.width * originalScaleFactor * ZOOM_FACTOR) - (zoomCanvas.width )) / ZOOM_FACTOR;
	var maxY = ((zoomCanvas.height * originalScaleFactor * ZOOM_FACTOR) - (zoomCanvas.height)) / ZOOM_FACTOR;

	xCorner = Math.min(xCorner, maxX);
	yCorner = Math.min(yCorner, maxY);
	
	var newXHeight = originalImage.naturalWidth / originalScaleFactor * ZOOM_FACTOR;
	var newYHeight = originalImage.naturalHeight / originalScaleFactor * ZOOM_FACTOR;

	var context = zoomCanvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(originalImage, xCorner, yCorner, canvas.width, canvas.height, 0, 0, newXHeight, newYHeight);
}

/*
 * Creates the dynamic content div, the canvas, and draws the original image.
 */
var createCanvasAndDrawImage = function(image) {
	var dynamicDiv = $('<div/>', {id: 'dynamicContent'});
	$('#pageContent').append(dynamicDiv);

	
	var canvas = $('<canvas/>', { id: 'canvas'});
	canvas.css('border', 'solid 1px black');
	$('#dynamicContent').append(canvas); 

	drawFullSizeImage(image);

	setUpZoomCanvas();
}

/*
 * Determines a scale factor and draws the image
 */
var drawFullSizeImage = function(image) {
	var imageWidth = image.naturalWidth;
	var imageHeight = image.naturalHeight;

	var windowWidth = window.innerWidth * .9;
	var windowHeight = window.innerHeight * .5;
	
	var scaleFactor = calculateScaleFactor(imageWidth, imageHeight, windowWidth, windowHeight);
	originalScaleFactor = scaleFactor;
	imageWidth /= scaleFactor;
	imageHeight /= scaleFactor;
	canvas = document.getElementById('canvas');
	canvas.width = imageWidth;
	canvas.height = imageHeight;
	var context = canvas.getContext('2d');
	context.drawImage(image, 0, 0, imageWidth, imageHeight);
}

/*
 * This function calculates the scale factor for the image. It tries first to choose
 * based on screen ratio, then if that doesn't work it chooses based on image
 * ratio
 */
var calculateScaleFactor = function(imageWidth, imageHeight, windowWidth, windowHeight) {
	if (windowHeight >= windowWidth) {
		var scale = imageWidth / windowWidth;
		if (imageHeight / scale > windowHeight) {
			scale = imageHeight / windowHeight;
		}
	} else {
		var scale = imageHeight / windowHeight;
		if (imageWidth / scale > windowWidth) {
			scale = imageWidth / windowWidth;
		}
	}
	return scale;
}

var loadImage = function(fileReader) {
	var image = new Image();
	image.src = fileReader.result;
	originalImage = image;
	$(image).load(createCanvasAndDrawImage(image));
}

var clearCurrentPage = function() {
	$('#dynamicContent').remove();
}

/*
 * This function validates that a given file is a valid image
 * and then creates a new canvas and draws the image on the
 * canvas.
 */
var handleUpload = function(fileInput) {
	clearCurrentPage();
	var file = fileInput.files[0];
	if (!file || !isValidImage(file)) {
		return;
	}
	var fileReader = new FileReader();

	fileReader.readAsDataURL(file);

	// Remove an already existing listener if one is set
	$(fileReader).off("load");
	$(fileReader).load(function() {
		loadImage(fileReader);
	});
}

/*
 * Returns true if a given file is an image.
 * If a given file is not an image, alerts
 * the user and prompts for an image
 */
var isValidImage = function(file) {
	if (!file.type.match(/image.*/)) {
		alert("Please upload an image file!");
		return false;
	}
	return true;
}

/*
 * This function is called when the window is loaded
 * to setup the file input section.
 */
var setUpFileUpload = function() {
    var input = document.createElement("input");
    input.type = "file";
    input.id = "fileUploadBox";
    $("#pageContent").append(input);

    $(input).change(function() {
    	handleUpload(input);
    });
}

window.onload = setUp;