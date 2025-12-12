let img;
let video;
let useWebcam = true;
let uploadInput;
let defaultImgPath = '/assets/joo.jpeg';

// Face tracking variables
let useFaceTracking = false;
let faceDetection;
let faceX = 0;
let faceY = 0;
let faceDetected = false;
let videoElement;
let drawX = 0;
let drawY = 0;

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
  
  // Get the underlying video element for MediaPipe
  videoElement = video.elt;
  
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

  // Initialize MediaPipe Face Detection
  initFaceDetection();
  
  // Set up UI button
  setupUI();

  // Save button
  //let saveButton = createButton('Download Portrait');
  //saveButton.mousePressed(saveImage);

  // Upload input
  //uploadInput = createFileInput(handleFile);
  //uploadInput.position(10, 40);
}

function initFaceDetection() {
  if (typeof FaceDetection !== 'undefined') {
    faceDetection = new FaceDetection({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
      }
    });
    
    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.5
    });
    
    faceDetection.onResults(onFaceResults);
    console.log('MediaPipe Face Detection initialized!');
  } else {
    console.log('MediaPipe not loaded, face tracking disabled');
  }
}

function onFaceResults(results) {
  if (results.detections && results.detections.length > 0) {
    faceDetected = true;
    const detection = results.detections[0];
    const bbox = detection.boundingBox;
    
    // Get center of face
    const centerX = bbox.xCenter;
    const centerY = bbox.yCenter;
    
    // Map to canvas coordinates
    faceX = centerX * width;
    faceY = centerY * height;
  } else {
    faceDetected = false;
  }
}

async function detectFace() {
  if (faceDetection && videoElement && videoElement.readyState === 4) {
    await faceDetection.send({image: videoElement});
  }
}

function setupUI() {
  // UI panel removed - face tracking controlled via F key only
  console.log('Press F to toggle face tracking, W to toggle webcam/image mode, Click to save');
}

function draw() {
  background(244, 243, 239, 2); // subtle trailing effect

  // Detect face if face tracking is enabled
  if (useFaceTracking && frameCount % 2 === 0) {
    detectFace();
  }

  // Determine drawing position
  if (useFaceTracking && faceDetected) {
    drawX = faceX;
    drawY = faceY;
  } else {
    drawX = mouseX;
    drawY = mouseY;
  }

  let source = useWebcam ? video : img;

  // Check if source is ready and valid
  if (source && drawX > 0 && drawY > 0) {
    // For video, make sure it's loaded
    if (useWebcam && video.loadedmetadata) {
      let w = constrain(drawX % 200, 10, 200);
      let h = constrain(drawY % 200, 10, 200);
      image(source, drawX, drawY, w, h);
      filter(GRAY);
    } else if (!useWebcam && img) {
      // For image mode
      let w = constrain(drawX % 200, 10, 200);
      let h = constrain(drawY % 200, 10, 200);
      image(source, drawX, drawY, w, h);
      filter(GRAY);
    }
  }
  
  // Visual feedback for face tracking
  if (useFaceTracking && faceDetected) {
    push();
    noFill();
    stroke(100, 200, 100);
    strokeWeight(2);
    circle(faceX, faceY, 30);
    pop();
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
  
  // Toggle face tracking
  if (key === 'f' || key === 'F') {
    toggleFaceTracking();
  }
}

function toggleFaceTracking() {
  if (!faceDetection) {
    console.log("Face detection not available");
    return;
  }
  
  useFaceTracking = !useFaceTracking;
  
  if (useFaceTracking) {
    cursor(); // Show cursor when in face mode
    console.log('✅ Face tracking enabled - move your face to paint!');
  } else {
    noCursor();
    console.log('🖱️ Face tracking disabled - using mouse control');
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

