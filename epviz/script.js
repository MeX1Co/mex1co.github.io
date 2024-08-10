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
    logoImage.style.top = (canvas.style.top+5);
    logoImage.style.right = (canvas.style.left+5);

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

    function drawBars() {
        analyser.getByteFrequencyData(dataArray);
        
        const barWidth = canvas.width / bufferLength;
        let barHeight;
        let x = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height * 0.8);

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const heightPercent = barHeight / 255;

            ctx.fillStyle = `rgba(97, 104, 208, 0.5)`; // 50% opacity
            ctx.fillRect(x, canvas.height * 0.8 - (barHeight * heightPercent * 0.8), barWidth, barHeight * heightPercent * 0.8);

            x += barWidth;
        }
    }

    function drawCircles() {
        analyser.getByteFrequencyData(dataArray);

        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.4;
        const maxRadius = 215 * (canvas.height / 1080);
        const barWidth = maxRadius / bufferLength;
        const fadeDuration = 3; // Fade out duration in seconds
        const fadeStartTime = 193; // Start fading after 193 seconds
        const currentTime = audio.currentTime;

        let opacity = 0.10; // Default opacity
        if (currentTime > fadeStartTime) {
            // Calculate fade out opacity
            const fadeProgress = Math.min((currentTime - fadeStartTime) / fadeDuration, 1);
            opacity = 0.10 * (1 - fadeProgress);
        }

        for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i];
            const percent = value / 255;
            const radius = percent * maxRadius;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = barWidth;
            ctx.stroke();
        }
    }

    function draw() {
        requestAnimationFrame(draw);
        drawBars();
        if (audio.currentTime >= 138) {
            drawCircles();
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
