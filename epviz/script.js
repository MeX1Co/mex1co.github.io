function adjustCanvasSize() {
    const backgroundImage = document.getElementById('background-image');
    const canvas = document.getElementById('canvas');
    const logoImage = document.getElementById('logo-image');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imageAspectRatio = 1920 / 1080;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let scale = 1;

    if (viewportAspectRatio > imageAspectRatio) {
        // Black bars on the sides
        const imageHeight = viewportHeight;
        const imageWidth = imageHeight * imageAspectRatio;
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        scale = imageHeight / 1080;
    } else {
        // Image is clipped
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;
        scale = viewportHeight / 1080;
    }

    canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';

    // Scale and position the logo image within the canvas
    logoImage.style.width = 350 * scale + 'px';
    logoImage.style.top = canvas.style.top;
    logoImage.style.right = canvas.style.left;
}

window.addEventListener('resize', adjustCanvasSize);
window.addEventListener('load', adjustCanvasSize);
