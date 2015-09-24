var setUp = function() {
	setUpFileUpload();
}

/*
 * This function validates that a given file is a valid image
 * and then creates a new canvas and draws the image on the
 * canvas.
 * TODO(vfgunn): Finish implementation
 */
var handleUpload = function() {
	var fileReader = new FileReader();
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

    $(input).change(handleUpload);
}

window.onload = setUp;