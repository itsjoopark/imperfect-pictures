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
// Recording variables
let isRecording = false;
let mediaRecorder;
let recordedChunks = [];
let canvasStream;
// GIF recording variables
let isRecordingGif = false;
let gifEncoder;
let gifFrameCount = 0;
let gifMaxFrames = 150; // 10 seconds at 15fps
let gifFrameDelay = 66; // ~15fps (1000ms / 15)

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
  console.log('  R = Start/Stop video recording 🎥');
  console.log('  G = Start/Stop GIF recording 📸');
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
    // Wider range for more dramatic effect: 15-300 pixels
    imageSize = map(avgDistance, 80, 200, 15, 300);
    imageSize = constrain(imageSize, 15, 300);
    
    // Smooth the size changes (slightly faster for more responsiveness)
    smoothedSize = smoothedSize + (imageSize - smoothedSize) * 0.15;
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
  
  // Recording indicator
  if (isRecording) {
    push();
    fill(255, 0, 0);
    noStroke();
    circle(30, 30, 20);
    fill(255);
    textSize(12);
    textAlign(LEFT, CENTER);
    text('REC', 45, 30);
    pop();
  }
  
  // GIF recording indicator
  if (isRecordingGif) {
    push();
    fill(255, 100, 0);
    noStroke();
    circle(30, 60, 20);
    fill(255);
    textSize(11);
    textAlign(LEFT, CENTER);
    text('GIF ' + gifFrameCount + '/' + gifMaxFrames, 45, 60);
    pop();
  }
  
  // Capture frame for GIF if recording
  if (isRecordingGif && frameCount % Math.round(60 / 15) === 0) {
    captureGifFrame();
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
  
  // Toggle video recording
  if (key === 'r' || key === 'R') {
    toggleRecording();
  }
  
  // Toggle GIF recording
  if (key === 'g' || key === 'G') {
    toggleGifRecording();
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

function toggleRecording() {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
}

function startRecording() {
  // Get canvas stream
  const canvas = document.querySelector('canvas');
  canvasStream = canvas.captureStream(30); // 30 fps
  
  // Set up MediaRecorder
  const options = {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
  };
  
  // Fallback for browsers that don't support vp9
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options.mimeType = 'video/webm';
  }
  
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(canvasStream, options);
  
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  
  mediaRecorder.onstop = () => {
    saveRecording();
  };
  
  mediaRecorder.start();
  isRecording = true;
  console.log('🎥 Recording started! Press R again to stop.');
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    isRecording = false;
    console.log('⏹️ Recording stopped! Saving video...');
  }
}

function saveRecording() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'friendswemade_recording.webm';
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  console.log('💾 Video saved as friendswemade_recording.webm');
  console.log('   (Note: WebM format - can be converted to MP4 if needed)');
}

function toggleGifRecording() {
  if (!isRecordingGif) {
    startGifRecording();
  } else {
    stopGifRecording();
  }
}

function startGifRecording() {
  // Check if GIF library is available
  if (typeof GIF === 'undefined') {
    console.error('❌ GIF library not loaded! Cannot record GIF.');
    alert('GIF library failed to load. Please refresh the page and try again.');
    return;
  }
  
  try {
    // Initialize GIF encoder with quality settings for 15MB max
    gifEncoder = new GIF({
      workers: 2,
      quality: 10, // 1-30, lower = better quality but larger file
      width: width,
      height: height,
      workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js',
      debug: false
    });
    
    gifEncoder.on('finished', function(blob) {
      // Check file size
      const sizeMB = blob.size / (1024 * 1024);
      console.log(`📊 GIF size: ${sizeMB.toFixed(2)} MB`);
      
      if (sizeMB > 15) {
        console.log('⚠️ Warning: GIF exceeds 15MB. Consider recording shorter duration.');
      }
      
      // Save the GIF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'friendswemade.gif';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ GIF saved as friendswemade.gif to your Downloads folder!');
    });
    
    gifEncoder.on('progress', function(progress) {
      console.log(`🎬 Rendering GIF: ${Math.round(progress * 100)}%`);
    });
    
    gifFrameCount = 0;
    isRecordingGif = true;
    console.log('📸 GIF recording started! (Max 10 seconds at 15fps)');
    console.log('   Press G again to stop, or recording will auto-stop at max frames.');
  } catch (error) {
    console.error('❌ Error starting GIF recording:', error);
    alert('Failed to start GIF recording. Check console for details.');
  }
}

function stopGifRecording() {
  if (isRecordingGif && gifEncoder) {
    isRecordingGif = false;
    
    if (gifFrameCount === 0) {
      console.log('⚠️ No frames captured! GIF recording cancelled.');
      return;
    }
    
    console.log(`⏹️ GIF recording stopped! Captured ${gifFrameCount} frames.`);
    console.log('   Rendering GIF... This may take 10-30 seconds...');
    
    try {
      gifEncoder.render();
    } catch (error) {
      console.error('❌ Error rendering GIF:', error);
      alert('Failed to render GIF. Check console for details.');
    }
  }
}

function captureGifFrame() {
  if (!gifEncoder || !isRecordingGif) {
    return;
  }
  
  if (gifFrameCount >= gifMaxFrames) {
    // Auto-stop if max frames reached
    console.log('⏰ Max frames reached! Stopping recording...');
    stopGifRecording();
    return;
  }
  
  try {
    // Get canvas element and add frame to GIF
    const canvas = document.querySelector('canvas');
    if (canvas) {
      gifEncoder.addFrame(canvas, {
        delay: gifFrameDelay,
        copy: true
      });
      gifFrameCount++;
    }
  } catch (error) {
    console.error('❌ Error capturing GIF frame:', error);
  }
}
