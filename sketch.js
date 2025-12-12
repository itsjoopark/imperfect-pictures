let img;
let video;
let useWebcam = true;
let uploadInput;
let defaultImgPath = '/assets/joo.jpeg';

function preload() {
  // Optional: Load default image if it exists
  // Comment this out if you don't have a default image
  // img = loadImage(defaultImgPath);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(244, 243, 239);
  noCursor(); 

  // Initialize webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  // Optional: Load default image asynchronously (won't block if missing)
  loadImage(defaultImgPath, 
    (loadedImg) => {
      img = loadedImg;
      console.log('Default image loaded successfully!');
    },
    (err) => {
      console.log('No default image found. Webcam mode only.');
    }
  );

  // Save button
  //let saveButton = createButton('Download Portrait');
  //saveButton.mousePressed(saveImage);

  // Upload input
  //uploadInput = createFileInput(handleFile);
  //uploadInput.position(10, 40);
}

function draw() {
  background(244, 243, 239, 2); // subtle trailing effect

  let source = useWebcam ? video : img;

  // Check if source is ready and valid
  if (source && mouseX > 0 && mouseY > 0) {
    // For video, make sure it's loaded
    if (useWebcam && video.loadedmetadata) {
      let w = constrain(mouseX % 200, 10, 200);
      let h = constrain(mouseY % 200, 10, 200);
      image(source, mouseX, mouseY, w, h);
      filter(GRAY);
    } else if (!useWebcam && img) {
      // For image mode
      let w = constrain(mouseX % 200, 10, 200);
      let h = constrain(mouseY % 200, 10, 200);
      image(source, mouseX, mouseY, w, h);
      filter(GRAY);
    }
  }
}

function keyPressed() {
  // Toggle between webcam and image
  if (key === 'w' || key === 'W') {
    if (!useWebcam && !img) {
      console.log("Cannot switch to image mode: No image loaded");
      return;
    }
    useWebcam = !useWebcam;
    console.log(useWebcam ? "Switched to Webcam mode" : "Switched to Image mode");
  }
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      useWebcam = false; // Switch to image mode
      console.log('Image loaded successfully!');
    });
  } else {
    console.log('Not an image file.');
  }
}

function mouseClicked() {
  // This function is called when the mouse is clicked
  saveCanvas('selfportrait_camgirl', 'jpg'); // Saves the canvas as 'myCanvasImage.png'
}

