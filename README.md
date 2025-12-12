# Imperfect Pictures

An interactive web-based portrait generator using p5.js. Create unique, glitchy artwork by painting with webcam or image slices that follow your mouse movements.

## Features

- 🎨 **Interactive Drawing**: Paint with image slices that follow your mouse
- 📹 **Webcam Integration**: Use your webcam as a live drawing source
- 🖼️ **Image Mode**: Toggle to use a static image instead
- 💾 **Save Your Work**: Click anywhere to save your creation as a JPEG
- 🎭 **Grayscale Filter**: Automatic grayscale effect for an artistic look
- ✨ **Trailing Effect**: Subtle fade creates a dreamy, layered appearance

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

- **Move Mouse**: Paint with image slices - size varies based on mouse position
- **Press W**: Toggle between webcam and image mode
- **Click Anywhere**: Save your portrait as a JPEG file (downloads automatically)

### Tips for Best Results

1. **Start with slow movements** to build up layers gradually
2. **Try different speeds** - fast movements create more chaotic patterns
3. **Toggle between modes** (W key) to mix webcam and static image
4. **The size of each slice** is determined by your mouse position (10-200px)
5. **Click to save** whenever you're happy with your creation

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
- HTML5 Canvas
- WebRTC (for webcam access)

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

### Image not loading
- Verify the image exists in `/assets` folder
- Check the file name matches `defaultImgPath` in sketch.js
- Ensure you're running a local server (not opening file:// directly)

### Canvas not showing
- Make sure you're running a local server
- Check browser console for errors (F12)
- Try a different browser

## Future Enhancements

Potential features to add:
- Color mode toggle
- Adjustable brush size controls
- Multiple filter options
- Recording/animation export
- Touch support for mobile
- Gallery of saved portraits

## License

MIT License - Feel free to use and modify for your own projects!

## Credits

Created with p5.js - a JavaScript library that makes coding accessible for artists, designers, educators, and beginners.

---

**Enjoy creating your imperfect pictures! 🎨**
