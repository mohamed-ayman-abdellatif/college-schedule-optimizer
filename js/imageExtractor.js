/**
 * imageExtractor.js
 * Visual schedule extractor for timetable photos and screenshots.
 * Uses HTML5 Canvas for table grid calibration, color-segmentation detection,
 * optional Tesseract.js OCR for Arabic/English text, and an interactive cell calibration editor.
 */

const ScheduleImageExtractor = (() => {
  const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  /**
   * Loads an image file into an Image object and Canvas.
   */
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Analyzes an image canvas to detect colored lecture/lab blocks.
   * In college schedules, empty cells are white or near-white, while classes
   * have distinct colored backgrounds (cyan, yellow, purple, pink, etc.).
   */
  function autoDetectColoredBlocks(canvas, gridBounds) {
    const ctx = canvas.getContext('2d');
    const { left, top, width, height } = gridBounds;

    const slotWidth = width / 16;
    const dayHeight = height / 7;

    const detectedBlocks = [];

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const day = DAYS[dayIdx];
      const dayY = top + dayIdx * dayHeight;

      let inBlock = false;
      let blockStartSlot = 1;
      let blockColor = null;

      for (let slot = 1; slot <= 16; slot++) {
        const slotX = left + (slot - 1) * slotWidth;

        // Sample center pixels of the cell
        const sampleX = Math.round(slotX + slotWidth * 0.5);
        const sampleY = Math.round(dayY + dayHeight * 0.5);

        // Safe bounds
        if (sampleX >= canvas.width || sampleY >= canvas.height) continue;

        const p = ctx.getImageData(sampleX, sampleY, 1, 1).data;
        const r = p[0], g = p[1], b = p[2];

        // Is it a colored block? (Not white, not very light gray, not black border)
        const isWhite = r > 240 && g > 240 && b > 240;
        const isDarkLine = r < 50 && g < 50 && b < 50;
        const isColored = !isWhite && !isDarkLine;

        if (isColored) {
          if (!inBlock) {
            inBlock = true;
            blockStartSlot = slot;
            blockColor = `rgb(${r},${g},${b})`;
          }
        } else {
          if (inBlock) {
            // Block ended
            detectedBlocks.push({
              day,
              startSlot: blockStartSlot,
              endSlot: slot - 1,
              duration: slot - blockStartSlot,
              color: blockColor,
              group: String.fromCharCode(65 + (detectedBlocks.length % 8)), // Default placeholder A, B, C...
              type: (slot - blockStartSlot) >= 2 ? 'Lect.' : 'Lab.',
              instructor: ''
            });
            inBlock = false;
          }
        }
      }

      if (inBlock) {
        detectedBlocks.push({
          day,
          startSlot: blockStartSlot,
          endSlot: 16,
          duration: 17 - blockStartSlot,
          color: blockColor,
          group: String.fromCharCode(65 + (detectedBlocks.length % 8)),
          type: 'Lect.',
          instructor: ''
        });
      }
    }

    return detectedBlocks;
  }

  /**
   * Runs OCR on a cropped cell canvas if Tesseract is available.
   */
  async function ocrCell(canvas, bbox) {
    if (typeof Tesseract === 'undefined') {
      return null;
    }
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = bbox.width;
      tempCanvas.height = bbox.height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(
        canvas,
        bbox.x, bbox.y, bbox.width, bbox.height,
        0, 0, bbox.width, bbox.height
      );

      // OCR with English + Arabic
      const result = await Tesseract.recognize(tempCanvas, 'ara+eng', {
        logger: () => {}
      });
      return result.data.text.trim();
    } catch (err) {
      console.warn('OCR cell failed:', err);
      return null;
    }
  }

  return {
    DAYS,
    loadImage,
    autoDetectColoredBlocks,
    ocrCell
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleImageExtractor;
}
