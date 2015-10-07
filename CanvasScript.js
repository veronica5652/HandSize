var originalImage;
var originalScaleFactor;

var click;

var upperX;
var upperY;

var points = new Array(null);

var ZOOM_FACTOR = 2.0;

var setUp = function() {
	setUpFileUpload();
}

/* TODO(vfgunn): Add actual results here when
 * you figure out what's actually going on.
 */
var calculateResult = function() {
	alert('Add results here');
}

/*
 * Adds another null element to the array 
 * to indicate that this is the first chance
 * for a given point.
 */
var continueToNextPhase = function() {
	if (points.length == 4) {
		calculateResult();
	} 
	points.push(null);
}

/*
 * Begins by checking to see if the image needs to be redrawn with new
 * points (a new point was clicked that replaces an old point).
 * Then adds the new point to the original canvas.
 */
var addPoint = function(e) {
	var lastPoint = points[points.length - 1];
	points.splice(points.length - 1, 1);
	if (lastPoint) {
		drawFullSizeImage(originalImage);
		drawZoomImage(click);
		for (var a = 0; a < points.length; a++) {
			drawPoint(points[a]);
		}
	}

	var xCoord = upperX + (e.offsetX / ZOOM_FACTOR);
	e.offsetX = xCoord / originalScaleFactor;

	var yCoord = upperY + (e.offsetY / ZOOM_FACTOR);
	e.offsetY = yCoord / originalScaleFactor;

	alert(e.offsetX + " " + e.offsetY);
	points.push(e);
	drawPoint(e);
}

/*
 * Draws a point centered at the coordinates stored in with a radius of 4
 */
var drawPoint = function(e) {
	var context = document.getElementById('canvas').getContext('2d');

	context.beginPath();
	context.arc(e.offsetX, e.offsetY, 4, 0, 2 * Math.PI, false);
	context.fill();
}

/*
 * Sets up the canvas that will hold the zoomed in image
 */
var setUpZoomCanvas = function(image) {
	makeZoomOptions();

	var canvas = $('<canvas/>', { id : 'zoomCanvas'});
	canvas.css('border', 'solid 1px black');
	$('#dynamicContent').append(canvas);

	var originalCanvas = document.getElementById('canvas');
	var zoomCanvas = document.getElementById('zoomCanvas');

	zoomCanvas.height = originalCanvas.height;
	zoomCanvas.width = originalCanvas.width;

	$('#canvas').on('click', drawZoomImage);

	$('#dynamicContent').append('<button type=\"button\" id=\"continueButton\">Continue</button>');
	$('#continueButton').on('click', continueToNextPhase);

	$('#zoomCanvas').on('click', addPoint);
}

/*
 * Creates radio buttons with the available zoom options and sets up listeners for each one.
 */
var makeZoomOptions = function() {
	$('#dynamicContent').append('<form id=\"zoomForm\"></form>');
	$('#zoomForm').append('<fieldset data-role=\"controlgroup\" data-type=\"horizontal\" data-mini=\"true\" id=\"fSet\"></fieldset>');
	$('#fSet').append('<input type=\"radio\" name=\"zoomOptions\" id=\"twoOption\" checked=\"checked\">');
	$('#fSet').append('<label for=\"twoOption\">x2</label>');
	$('#fSet').append('<input type=\"radio\" name=\"zoomOptions\" id=\"fiveOption\">');
	$('#fSet').append('<label for=\"fiveOption\">x5</label>');
	$('#fSet').append('<input type=\"radio\" name=\"zoomOptions\" id=\"tenOption\">');
	$('#fSet').append('<label for=\"tenOption\">x10</label>');
	$('#zoomForm').trigger('create');

	$('#twoOption').change(function() {
		ZOOM_FACTOR = 2.0;
		if (click) {
			drawZoomImage(click);
		}
	});

	$('#fiveOption').change(function() {
		ZOOM_FACTOR = 5.0
		if (click) {
			drawZoomImage(click);
		}
	});

	$('#tenOption').change(function() {
		ZOOM_FACTOR = 10.0;
		if (click) {
			drawZoomImage(click);
		}
	})
}

/*
 * Renders an image zoomed by ZOOM_FACTOR
 * e is the event associated with the click, which represents
 * the center of the new zoomed image.
 * If the point clicked would caused zooming to have empty parts
 * of the canvas, the point clicked is readjusted.
 */
var drawZoomImage = function(e) {

	click = e;

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

	upperX = xCorner;
	upperY = yCorner;

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
	click = null;
	ZOOM_FACTOR = 2.0;
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