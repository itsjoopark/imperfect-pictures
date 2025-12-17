# Imperfect Pictures

An interactive web-based portrait generator using p5.js and MediaPipe API (HandPose). Create unique, imperfect pictures by painting with your webcam or image slices that follow your mouse movements.

## How to 
Press 'H' key - enable handtracking control effects 
Press 'R' key - record video; Press again to stop recording and save to downloads  
Click anywhere on the canvas to save your imperfect picture and reset the board 
Note: Ensure you are in a well-lit environment for best results 

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (see setup options below)
- Optional: A webcam for live video mode

### Setup Instructions

1. **Clone or download this repository**

```bash
git clone <your-repo-url>
cd imperfect-pictures
```

2. **Add your default image** (optional)
   - Place an image named `joo.jpeg` in the `/assets` folder
   - Or update the `defaultImgPath` in `sketch.js` to point to your image

3. **Start a local server**

Choose one of these methods:

**Option A: Python (if installed)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Node.js (if installed)**
```bash
npx http-server -p 8000
```

**Option C: PHP (if installed)**
```bash
php -S localhost:8000
```

**Option D: VS Code Live Server Extension**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

4. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Allow webcam access when prompted (optional)

#### Video Recording Mode
- Press **R** to start recording your canvas
- Red "REC" indicator appears in top-left corner
- Press **R** again to stop and automatically save
- Saves as `friendswemade_recording.webm` to Downloads
- Records at 30fps with high quality (2.5 Mbps bitrate)
- WebM format (can be converted to MP4 using online tools if needed)

### Tips for Best Results

1. **Start with slow movements** to build up layers gradually
2. **Try different speeds** - fast movements create more chaotic patterns
3. **Toggle between modes** (W key) to mix webcam and static image
4. **The size of each slice** is determined by your cursor position or hand gesture
5. **Click to save** whenever you're happy with your creation
6. **Record your process** (R key) to capture the creation journey as a video

#### Hand Tracking Tips
1. **Good lighting is key** - make sure your hand is well-lit for better detection
2. **Show your palm** - camera should see your hand clearly with fingers visible
3. **Use your index finger** - point where you want to paint, fingertip controls the position
4. **Experiment with gestures** - move your hand in sweeping motions, circles, or quick dabs
5. **Distance matters** - being too close or too far can affect tracking accuracy
6. **One hand works best** - tracking is optimized for single hand detection
7. **The blue crosshair** shows where your index fingertip is detected
8. **Combine with mouse mode** - switch between hand and mouse for varied compositions

## Technologies Used

- [p5.js](https://p5js.org/) - Creative coding library
- [ml5.js](https://ml5js.org/) - Machine learning library for hand tracking
- [ml5.handPose](https://docs.ml5js.org/#/reference/handpose) - Real-time hand pose detection
- MediaRecorder API - Video recording
- HTML5 Canvas
- WebRTC (for webcam access)
- JavaScript ES6+

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (may require HTTPS for webcam)
- ⚠️ Mobile browsers (limited webcam support)

## Troubleshooting

### Webcam not working
- Make sure you've granted camera permissions
- Try using HTTPS (required by some browsers)
- Check if another application is using your webcam

### Hand tracking not working
- **Check camera permissions**: Hand tracking requires webcam access
- **Good lighting**: Ensure your hand is well-lit and clearly visible
- **Show your palm**: Make sure fingers are spread and visible to camera
- **Browser compatibility**: Works best in Chrome/Edge/Firefox
- **Console errors**: Press F12 and check for ml5.js loading errors
- **Distance**: Try adjusting your distance from the camera (arm's length is good)
- **One hand**: Use only one hand for best results
- **Wait for model**: ml5.js needs a moment to load the model on first run
- **Refresh**: Sometimes reloading the page helps initialize ml5.js

## Future Enhancements

Potential features to add:
- ✅ ~~Hand tracking control~~ (Implemented!)
- ✅ ~~Video recording~~ (Implemented!)
- Color mode toggle
- Adjustable brush size controls
- Multiple filter options
- Two-hand support for multi-point drawing
- Full body pose detection
- MP4 export option (currently WebM)
- GIF export feature (future)
- Touch support for mobile
- Gallery of saved portraits
- Collaborative portraits with multiple people

## License

MIT License - Feel free to use and modify for your own projects!

## Credits

Created with p5.js && Ml5.js - a JavaScript library that makes coding accessible for artists, designers, educators, and beginners.

**Enjoy creating your imperfect pictures! 🎨**
