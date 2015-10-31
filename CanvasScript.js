var originalImage;
var originalScaleFactor;

var click;

var upperX;
var upperY;

var points = new Array(null);

var ZOOM_FACTOR = 2.00;

var setUp = function() {
	setUpFileUpload();
}

var calculateResult = function() {
	var secondDigit = Math.pow(points[0].offsetX - points[1].offsetX, 2) + Math.pow(points[0].offsetY - points[1].offsetY, 2);
 	secondDigit = Math.sqrt(secondDigit);

	var fourthDigit = Math.pow(points[2].offsetX - points[3].offsetX, 2) + Math.pow(points[2].offsetY - points[3].offsetY, 2);
 	fourthDigit = Math.sqrt(fourthDigit); 	
 	displayResults(secondDigit / fourthDigit);
}

var displayResults = function(ratio) {
	clearCurrentPage();
	var dynamicDiv = $('<div/>', {id: 'dynamicContent'});
	$('#pageContent').append(dynamicDiv);

	for (var a = 0; a < studies.length; a++) {
		var thisDiv = $('<div/>', {id: studies[a].name});
		$('#dynamicContent').append(thisDiv);
		thisDiv = document.getElementById(studies[a].name);
		ratio = .964758;
		thisDiv.innerHTML = studies[a].getDisplayString(ratio);
	}
}

/*
 * Adds another null element to the array 
 * to indicate that this is the first chance
 * for a given point.
 */
var continueToNextPhase = function() {
	if (!points[points.length - 1]) {
		alert("Please select a point before moving on.");
		return;
	}
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
		drawFullSizeImage(originalImage, document.getElementById('canvas'));
		drawZoomImage(click);
		for (var a = 0; a < points.length; a++) {
			drawPoint(points[a]);
		}
	}

	e.offsetX = upperX + (e.offsetX / ZOOM_FACTOR);

	e.offsetY = upperY + (e.offsetY / ZOOM_FACTOR);

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

	zoomCanvas.getContext('2d').save();
	$('#zoomCanvas').on('click', addPoint);
}

/*
 * Creates radio buttons with the available zoom options and sets up listeners for each one.
 */
var makeZoomOptions = function() {
	$('#dynamicContent').append('<br>');
	$('#dynamicContent').append('<input type=\"range\" name=\"slider-fill\" id=\"slider-fill\" step=\".1\" value=\"2.0\" min=\"1.0\" max=\"10.0\" data-highlight=\"true\">');
	$('#slider-fill').change(function() {
		ZOOM_FACTOR = document.getElementById('slider-fill').value;
		if (click) {
			drawZoomImage(click);
		}
	});
	$('#dynamicContent').append('<br>');
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
	var context = zoomCanvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();
	context.save();

	context.save();
	var x = e.offsetX * originalScaleFactor - (canvas.width / 2 * originalScaleFactor / ZOOM_FACTOR);
	var y = e.offsetY * originalScaleFactor - (canvas.height / 2 * originalScaleFactor / ZOOM_FACTOR);

	x = Math.max(x, 0);
	y = Math.max(y, 0);

	var xMax = canvas.width * originalScaleFactor - (canvas.width * originalScaleFactor / ZOOM_FACTOR);
	var yMax = canvas.height * originalScaleFactor - (canvas.height * originalScaleFactor / ZOOM_FACTOR);

	x = Math.min(x, xMax);
	y = Math.min(y, yMax);

	upperX = x / originalScaleFactor;
	upperY = y / originalScaleFactor;

	context.drawImage(originalImage, x, y, canvas.width * originalScaleFactor / ZOOM_FACTOR, canvas.height * originalScaleFactor / ZOOM_FACTOR, 0, 0, canvas.width, canvas.height);
	context.restore();
}

/*
 * Creates the dynamic content div, the canvas, and draws the original image.
 */
var createCanvasAndDrawImage = function() {
	var dynamicDiv = $('<div/>', {id: 'dynamicContent'});
	$('#pageContent').append(dynamicDiv);

	
	var canvas = $('<canvas/>', { id: 'canvas'});
	canvas.css('border', 'solid 1px black');
	$('#dynamicContent').append(canvas);
	drawFullSizeImage(originalImage, document.getElementById('canvas'));

	setUpZoomCanvas();
}

/*
 * Determines a scale factor and draws the image
 */
var drawFullSizeImage = function(image, canvas) {
	var imageWidth = image.naturalWidth;
	var imageHeight = image.naturalHeight;

	var windowWidth = window.innerWidth * .9;
	var windowHeight = window.innerHeight * .4;
	
	var scaleFactor = calculateScaleFactor(imageWidth, imageHeight, windowWidth, windowHeight);
	originalScaleFactor = scaleFactor;
	imageWidth /= scaleFactor;
	imageHeight /= scaleFactor;
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
	if (originalImage)
		$(originalImage).off('load');
	originalImage = image;
	click = null;
	points = new Array(null);
	$(originalImage).load(createCanvasAndDrawImage);
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
		$(fileReader).off('load');
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