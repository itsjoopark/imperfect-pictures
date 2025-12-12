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
// Smoothing variables
let smoothedHandX = 0;
let smoothedHandY = 0;
let smoothing = 0.15; // Lower = smoother/slower, higher = more responsive
// Hand size variables
let handOpenness = 0;
let imageSize = 100; // Default image size
let smoothedSize = 100;

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
  console.log('✋ Controls:');
  console.log('  H = Toggle hand tracking');
  console.log('  W = Toggle webcam/image');
  console.log('  Click = Save as friendswemade.jpg');
  console.log('  Open hand = Bigger images 🖐️');
  console.log('  Close fist = Smaller images ✊');
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
    
    // Update hand position with smoothing
    // Mirror X coordinate so hand moves in same direction as image
    let targetX = width - indexFingerTip.x;
    let targetY = indexFingerTip.y;
    
    // Apply exponential smoothing for fluid motion
    smoothedHandX = smoothedHandX + (targetX - smoothedHandX) * smoothing;
    smoothedHandY = smoothedHandY + (targetY - smoothedHandY) * smoothing;
    
    handX = smoothedHandX;
    handY = smoothedHandY;
    
    // Calculate hand openness based on finger spread
    // Measure average distance from wrist (keypoint 0) to fingertips
    let wrist = hand.keypoints[0];
    let thumbTip = hand.keypoints[4];
    let indexTip = hand.keypoints[8];
    let middleTip = hand.keypoints[12];
    let ringTip = hand.keypoints[16];
    let pinkyTip = hand.keypoints[20];
    
    // Calculate distances
    let d1 = dist(wrist.x, wrist.y, thumbTip.x, thumbTip.y);
    let d2 = dist(wrist.x, wrist.y, indexTip.x, indexTip.y);
    let d3 = dist(wrist.x, wrist.y, middleTip.x, middleTip.y);
    let d4 = dist(wrist.x, wrist.y, ringTip.x, ringTip.y);
    let d5 = dist(wrist.x, wrist.y, pinkyTip.x, pinkyTip.y);
    
    // Average distance (normalized)
    let avgDistance = (d1 + d2 + d3 + d4 + d5) / 5;
    
    // Map to image size (open hand = bigger, closed hand = smaller)
    // Typical range: 100-300 pixels, adjust based on camera distance
    imageSize = map(avgDistance, 80, 200, 30, 180);
    imageSize = constrain(imageSize, 30, 180);
    
    // Smooth the size changes
    smoothedSize = smoothedSize + (imageSize - smoothedSize) * 0.1;
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
    // Determine image dimensions
    let w, h;
    
    if (useHandTracking && handDetected) {
      // Use hand openness to control size
      w = smoothedSize;
      h = smoothedSize;
    } else {
      // Use mouse position for size (original behavior)
      w = constrain(drawX % 200, 10, 200);
      h = constrain(drawY % 200, 10, 200);
    }
    
    // For video, make sure it's loaded
    if (useWebcam && video.loadedmetadata) {
      image(source, drawX, drawY, w, h);
    } else if (!useWebcam && img) {
      // For image mode
      image(source, drawX, drawY, w, h);
    }
  }
  
  // No visual feedback - clean interface
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
  // Save the canvas
  saveCanvas('friendswemade', 'jpg');
  console.log('💾 Saved as friendswemade.jpg');
  
  // Reset canvas to blank after saving
  background(244, 243, 239);
  console.log('🎨 Canvas reset - ready for new portrait!');
}
