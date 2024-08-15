document.getElementById('image-input').addEventListener('change', processImage);
document.getElementById('color-toggle').addEventListener('change', processImage);
document.getElementById('resolution-slider').addEventListener('input', function() {
    document.getElementById('resolution-value').textContent = this.value;
    processImage();
});
document.getElementById('inverse-toggle').addEventListener('change', processImage);

function processImage() {
    const file = document.getElementById('image-input').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const width = parseInt(document.getElementById('resolution-slider').value, 10);  // 사용자 지정 해상도
            const scaleFactor = width / img.width;
            const height = img.height * scaleFactor;

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);

            const isColorMode = document.getElementById('color-toggle').checked;
            const isInverseMode = document.getElementById('inverse-toggle').checked;

            const ascii = isColorMode ? 
                convertToColorASCII(imageData, isInverseMode) : 
                convertToGrayscaleASCII(imageData, isInverseMode);
                
            document.getElementById('ascii-output').innerHTML = ascii;
        };
    };

    reader.readAsDataURL(file);
}

function convertToGrayscaleASCII(imageData, inverse = false) {
    const chars = inverse ? ' .:-=+*#%@' : '@%#*+=-:. ';  // ASCII 캐릭터 세트 (역순)
    const pixels = imageData.data;
    let ascii = '';

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor(brightness / 255 * (chars.length - 1));
        ascii += chars[charIndex];

        if ((i / 4 + 1) % imageData.width === 0) {
            ascii += '\n';
        }
    }

    return ascii;
}

function convertToColorASCII(imageData, inverse = false) {
    const chars = inverse ? ' .:-=+*#%@' : '@%#*+=-:. ';  // ASCII 캐릭터 세트 (역순)
    const pixels = imageData.data;
    let ascii = '';

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor(brightness / 255 * (chars.length - 1));
        const char = chars[charIndex];

        ascii += `<span style="color: rgb(${r}, ${g}, ${b})">${char}</span>`;

        if ((i / 4 + 1) % imageData.width === 0) {
            ascii += '\n';
        }
    }

    return ascii;
}
