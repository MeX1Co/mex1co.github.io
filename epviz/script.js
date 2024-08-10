function adjustCanvasSize() {
    const canvas = document.getElementById('canvas');
    const logoImage = document.getElementById('logo-image');
    const gifImage = document.getElementById('animated-gif');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imageAspectRatio = 1920 / 1080;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let scale = 1;

    if (viewportAspectRatio > imageAspectRatio) {
        // Width is greater relative to height, so the image will have black bars on the sides
        const imageHeight = viewportHeight;
        const imageWidth = imageHeight * imageAspectRatio;
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        scale = imageHeight / 1080;
    } else {
        // Height is greater relative to width, so the image will be clipped on top and bottom
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;
        scale = viewportHeight / 1080;
    }

    canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';

    logoImage.style.width = 350 * scale + 'px';
    logoImage.style.top = canvas.style.top;
    logoImage.style.right = canvas.style.left;

    gifImage.style.width = 300 * scale + 'px';

    const audioPlayer = document.getElementById('audio');
    audioPlayer.style.bottom = '20px';
    audioPlayer.style.left = '50%';
    audioPlayer.style.transform = 'translateX(-50%)';
}

function setupVisualizer() {
    const audio = document.getElementById('audio');
    const canvas = document.getElementById('canvas');
    const gifImage = document.getElementById('animated-gif');
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
        const centerY = canvas.height * 0.40; // Adjusted center position
        const maxRadius = 215 * (canvas.height / 1080); // Adjusted max radius
        const barWidth = maxRadius / bufferLength;
        const fadeDuration = 4; // Fade out duration in seconds
        const fadeStartTime = 193; // Start fading after 193 seconds
        const currentTime = audio.currentTime;

        let opacity = 0.35; // Initial opacity 35%
        if (currentTime > fadeStartTime) {
            const fadeProgress = Math.min((currentTime - fadeStartTime) / fadeDuration, 1);
            opacity = 0.35 * (1 - fadeProgress);
        }

        for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i];
            const percent = value / 255;
            const radius = percent * maxRadius;

            let color;
            if (i < bufferLength * 0.25) {
                color = `rgba(255, 255, 0, ${opacity})`; // Yellow
            } else if (i < bufferLength * 0.5) {
                color = `rgba(57, 255, 20, ${opacity})`; // Neon Green
            } else if (i < bufferLength * 0.75) {
                color = `rgba(255, 0, 255, ${opacity})`; // Magenta
            } else {
                color = `rgba(0, 255, 255, ${opacity})`; // Cyan
            }

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.strokeStyle = color;
            ctx.lineWidth = barWidth;
            ctx.stroke();
        }
    }

    function animateGIF() {
        const currentTime = audio.currentTime;
        const gifStartTime = 76;
        const gifEndTime = audio.duration;
        const gifFadeStartTime = gifEndTime - 5; // Fade out over the last 5 seconds
        const gifWidthStart = 300 * (canvas.height / 1080);
        const gifWidthEnd = gifWidthStart / 2;

        if (currentTime >= gifStartTime && currentTime <= gifEndTime) {
            gifImage.style.display = 'block';
            const elapsed = currentTime - gifStartTime;
            const progress = Math.min(elapsed / (gifEndTime - gifStartTime), 1);

            const startX = canvas.width / 2 - 400 * (canvas.height / 1080);
            const endX = canvas.width / 2;
            const startY = -gifWidthStart;
            const endY = canvas.height * 0.4 - gifWidthEnd / 2;

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            const currentWidth = gifWidthStart - (gifWidthStart - gifWidthEnd) * progress;

            gifImage.style.width = currentWidth + 'px';
            gifImage.style.left = currentX + 'px';
            gifImage.style.top = currentY + 'px';

            if (currentTime > gifFadeStartTime) {
                const fadeProgress = Math.min((currentTime - gifFadeStartTime) / 5, 1);
                gifImage.style.opacity = 1 - fadeProgress;
            } else {
                gifImage.style.opacity = 1;
            }
        } else {
            gifImage.style.display = 'none';
        }
    }

    function draw() {
        requestAnimationFrame(draw);
        drawBars();
        if (audio.currentTime >= 138) {
            drawCircles();
        }
        animateGIF();
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
