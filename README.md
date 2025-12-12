# Imperfect Pictures

An interactive web-based portrait generator using p5.js. Create unique, glitchy artwork by painting with webcam or image slices that follow your mouse movements.

## Features

- 🎨 **Interactive Drawing**: Paint with image slices that follow your mouse or face
- 👤 **Face Tracking**: Use MediaPipe face detection to control painting with your face movements
- 📹 **Webcam Integration**: Use your webcam as a live drawing source
- 🖼️ **Image Mode**: Toggle to use a static image instead
- 💾 **Save Your Work**: Click anywhere to save your creation as a JPEG
- 🎭 **Grayscale Filter**: Automatic grayscale effect for an artistic look
- ✨ **Trailing Effect**: Subtle fade creates a dreamy, layered appearance
- 🔄 **Dual Control Modes**: Switch seamlessly between mouse and face tracking

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

- **Press F**: Toggle between mouse and face tracking mode
- **Press W**: Toggle between webcam and image mode
- **Click Anywhere**: Save your portrait as a JPEG file (downloads automatically)

#### Mouse Mode (Default)
- Move your mouse to paint with image slices
- Slice size varies based on mouse position (10-200px)

#### Face Tracking Mode
- Press **F** to enable
- Move your face to paint - the center of your face controls the brush
- Green circle appears when your face is detected
- Move closer/farther, tilt, or turn your head for different effects

### Tips for Best Results

1. **Start with slow movements** to build up layers gradually
2. **Try different speeds** - fast movements create more chaotic patterns
3. **Toggle between modes** (W key) to mix webcam and static image
4. **The size of each slice** is determined by your cursor position (10-200px)
5. **Click to save** whenever you're happy with your creation

#### Face Tracking Tips
1. **Good lighting is key** - make sure your face is well-lit for better detection
2. **Position yourself** at a comfortable distance from the camera
3. **Experiment with head movements** - tilts, turns, and forward/backward motions create different effects
4. **Combine with mouse mode** - switch between face and mouse for varied compositions
5. **The green circle** shows where your face center is detected

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
- [MediaPipe Face Detection](https://google.github.io/mediapipe/solutions/face_detection.html) - Real-time face tracking
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

### Face tracking not working
- **Check camera permissions**: Face tracking requires webcam access
- **Good lighting**: Ensure your face is well-lit and visible
- **Browser compatibility**: Works best in Chrome/Edge
- **Console errors**: Press F12 and check for MediaPipe loading errors
- **Distance**: Try adjusting your distance from the camera
- **Refresh**: Sometimes reloading the page helps initialize MediaPipe

### Image not loading
- Verify the image exists in `/assets` folder
- Check the file name matches `defaultImgPath` in sketch.js
- Ensure you're running a local server (not opening file:// directly)

### Canvas not showing
- Make sure you're running a local server
- Check browser console for errors (F12)
- Try a different browser

### Performance issues
- Face detection runs every other frame to maintain performance
- Close other camera-using applications
- Try disabling face tracking if experiencing lag

## Future Enhancements

Potential features to add:
- ✅ ~~Face tracking control~~ (Implemented!)
- Color mode toggle
- Adjustable brush size controls
- Multiple filter options
- Hand tracking for gestures
- Full body pose detection
- Recording/animation export
- Touch support for mobile
- Gallery of saved portraits
- Multiple face tracking (collaborative portraits)

## License

MIT License - Feel free to use and modify for your own projects!

## Credits

Created with p5.js - a JavaScript library that makes coding accessible for artists, designers, educators, and beginners.

---

**Enjoy creating your imperfect pictures! 🎨**
