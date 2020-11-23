let filesDone = 0;
let filesToDo = 0;
let progressBar = document.getElementById("progress-bar");

// The first thing we need in the script is a reference to the drop area so we can attach some events to it:
let dropArea = document.getElementById("drop-area");

// Now let’s add some events. We’ll start off with adding handlers to all the events to prevent default behaviors and stop the events from bubbling up any higher than necessary:
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Now let’s add an indicator to let the user know that they have indeed dragged the item over the correct area by using CSS to change the color of the border color of the drop area. The styles should already be there under the #drop-area.highlight selector, so let’s use JS to add and remove that highlight class when necessary.

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("highlight");
}

dropArea.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
  console.log(e.target);
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function uploadFile(file) {
  let url = "/upload";
  let formData = new FormData();

  formData.append("file", file);

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      res.json().then((response) => {
        console.log(response);
        progressDone();
      });
      /* Done. Inform the user */
    })
    .catch((error) => {
      console.error(error);
      /* Error. Inform the user */
    });
}
// There are a couple of ways you could do this: you could wait until after the image has been uploaded and ask the server to send the URL of the image, but that means you need to wait and images can be pretty large sometimes. The alternative — which we’ll be exploring today — is to use the FileReader API on the file data we received from the drop event. This is asynchronous, and you could alternatively use FileReaderSync,
function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let img = document.createElement("img");
    img.src = reader.result;
    document.getElementById("gallery").appendChild(img);
  };
}

function handleFiles(files) {
  files = [...files];
  initializeProgress(files.length); // <- Add this line
  files.forEach(uploadFile);
  files.forEach(previewFile);
}
// When we start uploading, initializeProgress will be called to reset the progress bar. Then, with each completed upload, we’ll call progressDone to increment the number of completed uploads and update the progress bar to show the current progress.
function initializeProgress(numfiles) {
  progressBar.value = 0;
  filesDone = 0;
  filesToDo = numfiles;
}

function progressDone() {
  filesDone++;
  progressBar.value = (filesDone / filesToDo) * 100;
}
