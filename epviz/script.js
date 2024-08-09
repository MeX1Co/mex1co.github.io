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

    // Adjust the audio player position
    const audioPlayer = document.getElementById('audio');
    audioPlayer.style.bottom = '20px';
    audioPlayer.style.left = '50%';
    audioPlayer.style.transform = 'translateX(-50%)';
}

function setupVisualizer() {
    const audio = document.getElementById('audio');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSrc = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    audioSrc.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength);
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            ctx.fillStyle = '#6168d0';
            ctx.fillRect(x, canvas.height - barHeight * 0.8 - (canvas.height * 0.2), barWidth, barHeight * 0.8);

            x += barWidth + 1;
        }
    }

    audio.addEventListener('play', () => {
        audioContext.resume();
        draw();
    });
}

window.addEventListener('resize', adjustCanvasSize);
window.addEventListener('load', () => {
    adjustCanvasSize();
    setupVisualizer();
});
