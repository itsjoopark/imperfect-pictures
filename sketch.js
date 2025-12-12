let img;
let video;
let useWebcam = true;
let uploadInput;
let defaultImgPath = '/assets/joo.jpeg';

// Hand tracking variables
let useHandTracking = false;
let hands;
let handX = 0;
let handY = 0;
let handDetected = false;
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

  // Initialize MediaPipe Hand Tracking
  initHandTracking();
  
  // Set up UI
  setupUI();

  // Save button
  //let saveButton = createButton('Download Portrait');
  //saveButton.mousePressed(saveImage);

  // Upload input
  //uploadInput = createFileInput(handleFile);
  //uploadInput.position(10, 40);
}

function initHandTracking() {
  if (typeof Hands !== 'undefined') {
    hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    hands.onResults(onHandResults);
    console.log('MediaPipe Hand Tracking initialized!');
  } else {
    console.log('MediaPipe not loaded, hand tracking disabled');
  }
}

function onHandResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    handDetected = true;
    const landmarks = results.multiHandLandmarks[0];
    
    // Use index finger tip (landmark 8) for precise control
    const indexFingerTip = landmarks[8];
    
    // Map to canvas coordinates (flip X for mirror effect)
    handX = (1 - indexFingerTip.x) * width;
    handY = indexFingerTip.y * height;
  } else {
    handDetected = false;
  }
}

async function detectHand() {
  if (hands && videoElement && videoElement.readyState === 4) {
    await hands.send({image: videoElement});
  }
}

function setupUI() {
  // UI panel removed - hand tracking controlled via H key only
  console.log('Press H to toggle hand tracking, W to toggle webcam/image mode, Click to save');
}

function draw() {
  background(244, 243, 239, 2); // subtle trailing effect

  // Detect hand if hand tracking is enabled
  if (useHandTracking && frameCount % 2 === 0) {
    detectHand();
  }

  // Determine drawing position
  if (useHandTracking && handDetected) {
    drawX = handX;
    drawY = handY;
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
  
  // Visual feedback for hand tracking
  if (useHandTracking && handDetected) {
    push();
    noFill();
    stroke(100, 200, 255);
    strokeWeight(3);
    circle(handX, handY, 25);
    // Add crosshair for precision
    stroke(100, 200, 255);
    strokeWeight(2);
    line(handX - 15, handY, handX + 15, handY);
    line(handX, handY - 15, handX, handY + 15);
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
  
  // Toggle hand tracking
  if (key === 'h' || key === 'H') {
    toggleHandTracking();
  }
}

function toggleHandTracking() {
  if (!hands) {
    console.log("Hand tracking not available");
    return;
  }
  
  useHandTracking = !useHandTracking;
  
  if (useHandTracking) {
    cursor(); // Show cursor when in hand mode
    console.log('✅ Hand tracking enabled - point with your index finger to paint!');
  } else {
    noCursor();
    console.log('🖱️ Hand tracking disabled - using mouse control');
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

