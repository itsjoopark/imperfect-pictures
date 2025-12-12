let img;
let video;
let useWebcam = true;
let uploadInput;
let defaultImgPath = '/assets/joo.jpeg';

function preload() {
  img = loadImage(defaultImgPath); // Load default image
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(244, 243, 239);
  noCursor(); 

  // Initialize webcam (hidden by default)
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Draw initial image slices
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    image(video, x, y, 10, 10);
  }

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

  if (source && mouseX > 0 && mouseY > 0) {
    let w = constrain(mouseX % 200, 10, 200);
    let h = constrain(mouseY % 200, 10, 200);
    image(source, mouseX, mouseY, w, h);
    filter(GRAY);
  }
}

function keyPressed() {
  // Toggle between webcam and image
  if (key === 'w' || key === 'W') {
    useWebcam = !useWebcam;
    console.log("Webcam mode:", useWebcam);
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

