# Imperfect Pictures

An interactive web-based portrait generator using p5.js. Create unique, glitchy artwork by painting with webcam or image slices that follow your mouse movements.

## Features

- 🎨 **Interactive Drawing**: Paint with image slices that follow your mouse or hand
- ✋ **Hand Tracking**: Use ml5.js hand tracking to control painting with your index finger
- 📹 **Webcam Integration**: Use your webcam as a live drawing source
- 🖼️ **Image Mode**: Toggle to use a static image instead
- 💾 **Save Your Work**: Click anywhere to save your creation as a JPEG
- 🎥 **Video Recording**: Record your creative process and save as WebM video
- 🎭 **Grayscale Filter**: Automatic grayscale effect for an artistic look
- ✨ **Trailing Effect**: Subtle fade creates a dreamy, layered appearance
- 🔄 **Dual Control Modes**: Switch seamlessly between mouse and hand tracking

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

## How to Use

### Controls

All controls are keyboard-based for a minimal, distraction-free experience:

- **Press H**: Toggle between mouse and hand tracking mode
- **Press W**: Toggle between webcam and image mode
- **Press R**: Start/Stop video recording (saves as WebM video)
- **Click Anywhere**: Save your portrait as a JPEG file (downloads automatically)

#### Mouse Mode (Default)
- Move your mouse to paint with image slices
- Slice size varies based on mouse position (10-200px)

#### Hand Tracking Mode (ml5.js)
- Press **H** to enable
- Point with your index finger to paint - your fingertip controls the brush
- Move your hand around in front of the camera to create your portrait
- Works best with one hand clearly visible to the camera
- ml5.js provides smooth, reliable hand tracking with minimal setup

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

## Customization

### Change Colors

Edit the background color in `sketch.js`:

```javascript
background(244, 243, 239); // RGB values
```

### Adjust Trailing Effect

Modify the alpha value (last parameter) in the draw function:

```javascript
background(244, 243, 239, 2); // Lower = stronger trails
```

### Change Slice Size Range

Adjust the constraints in the draw function:

```javascript
let w = constrain(mouseX % 200, 10, 200); // min: 10, max: 200
let h = constrain(mouseY % 200, 10, 200);
```

### Enable File Upload

Uncomment these lines in `index.html`:

```html
<!-- <input type="file" id="upload-input" accept="image/*"> -->
```

And in `sketch.js`:

```javascript
//uploadInput = createFileInput(handleFile);
//uploadInput.position(10, 40);
```

## Project Structure

```
imperfect-pictures/
├── index.html          # Main HTML file
├── sketch.js           # p5.js sketch code
├── style.css           # Styling
├── assets/             # Image assets
│   └── README.md       # Assets directory info
└── README.md           # This file
```

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

### Image not loading
- Verify the image exists in `/assets` folder
- Check the file name matches `defaultImgPath` in sketch.js
- Ensure you're running a local server (not opening file:// directly)

### Canvas not showing
- Make sure you're running a local server
- Check browser console for errors (F12)
- Try a different browser

### Performance issues
- Hand tracking runs every other frame to maintain performance
- Close other camera-using applications
- Try disabling hand tracking if experiencing lag

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

Created with p5.js - a JavaScript library that makes coding accessible for artists, designers, educators, and beginners.

---

**Enjoy creating your imperfect pictures! 🎨**
