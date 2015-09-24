var setUp = function() {
	setUpFileUpload();
}

var createCanvasAndDrawImage = function() {
	alert("Called create canvas!");
}

var loadImage = function(fileReader) {
	var image = new Image();
	image.src = fileReader.result;
	$(image).load(createCanvasAndDrawImage);
}

/*
 * This function validates that a given file is a valid image
 * and then creates a new canvas and draws the image on the
 * canvas.
 * TODO(vfgunn): Finish implementation
 */
var handleUpload = function(fileInput) {
	var file = fileInput.files[0];
	if (!isValidImage(file)) {
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