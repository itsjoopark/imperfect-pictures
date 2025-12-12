let img;
let video;
let useWebcam = true;
let uploadInput;
let defaultImgPath = '/assets/joo.jpeg';

// Hand tracking variables (ml5.js)
let useHandTracking = false;
let handPose;
let hands = [];
let handX = 0;
let handY = 0;
let handDetected = false;
let drawX = 0;
let drawY = 0;

function preload() {
  // Initialize ml5 handPose model
  handPose = ml5.handPose();
  
  // Optional: Load default image asynchronously
  // Commented out to avoid errors if file doesn't exist
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
  
  // Start hand detection with ml5
  handPose.detectStart(video, gotHands);
  
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
  
  // Set up UI
  setupUI();

  // Save button
  //let saveButton = createButton('Download Portrait');
  //saveButton.mousePressed(saveImage);

  // Upload input
  //uploadInput = createFileInput(handleFile);
  //uploadInput.position(10, 40);
}

function setupUI() {
  // UI panel removed - hand tracking controlled via H key only
  console.log('✋ Press H to toggle hand tracking, W to toggle webcam/image mode, Click to save');
}

// Callback function for when handPose detects hands
function gotHands(results) {
  hands = results;
  
  // Check if hand is detected
  if (hands.length > 0) {
    handDetected = true;
    let hand = hands[0];
    
    // Use index finger tip (keypoint 8) for precise control
    let indexFingerTip = hand.keypoints[8];
    
    // Update hand position
    handX = indexFingerTip.x;
    handY = indexFingerTip.y;
  } else {
    handDetected = false;
  }
}

function draw() {
  background(244, 243, 239, 2); // subtle trailing effect

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
  if (!handPose) {
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
