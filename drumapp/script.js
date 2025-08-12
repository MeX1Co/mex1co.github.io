const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let bpm = 120;
let isPlaying = false;
let currentStep = 0;
let intervalId;
let startTime;
let loopCounter = 0;

const kit = {
    kick: 'rock/kick.mp3',
    snare: 'rock/snare.mp3',
    hihatClosed: 'rock/hihat_closed.mp3'
};

const extraSamples = {
    hihatOpen: 'rock/hihat_open.mp3'
};

const drumPatterns = {
    kick:    [[1,0,0,0, 1,0,0,0], [1,0,0,1, 0,1,0,0], [1,0,1,0, 1,0,1,0]],
    snare:   [[0,0,1,0, 0,0,1,0], [0,0,1,0, 0,1,0,1], [0,1,0,1, 0,1,0,1]],
    hihat:   [[1,1,1,1, 1,1,1,1], [1,0,1,0, 1,0,1,0], [2,0,1,0, 2,0,1,0]]
};

const muteState = {
    but1: true, // kick
    but2: true, // snare
    but3: true, // closed hihat
    but4: true, // open hihat
    but5: false,
    but6: false,
    but7: false,
    but8: false
};

const buffers = {};
const sourceTracker = {};

async function loadSample(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

async function loadKit() {
    document.getElementById('kitBtn').classList.remove('ready');
    const loadPromises = [];

    for (let key in kit) {
        loadPromises.push(loadSample(kit[key]).then(buffer => buffers[key] = buffer));
    }
    for (let key in extraSamples) {
        loadPromises.push(loadSample(extraSamples[key]).then(buffer => buffers[key] = buffer));
    }

    await Promise.all(loadPromises);
    document.getElementById('kitBtn').classList.add('ready');
}

function playSound(buffer, label) {
    if (label === 'hihatClosed' && sourceTracker['hihatOpen']) {
        sourceTracker['hihatOpen'].stop();
        delete sourceTracker['hihatOpen'];
    }
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    sourceTracker[label] = source;
}

function scheduler() {
    const stepDuration = (60 / bpm) / 2; // 8th notes
    const currentTime = audioContext.currentTime;

    for (let drum in drumPatterns) {
        let patternIndex = Math.min(loopCounter % drumPatterns[drum].length, drumPatterns[drum].length - 1);
        const pattern = drumPatterns[drum][patternIndex];
        const sound = drum === 'hihat' ? null : drum;
        const label = drum === 'hihat' ? null : drum;

        const hit = pattern[currentStep];

        if (drum === 'hihat') {
            if (hit === 1 && muteState['but3']) playSound(buffers.hihatClosed, 'hihatClosed');
            if (hit === 2 && muteState['but4']) playSound(buffers.hihatOpen, 'hihatOpen');
        } else {
            const btnId = drum === 'kick' ? 'but1' : 'but2';
            if (hit === 1 && muteState[btnId]) playSound(buffers[drum], drum);
        }
    }

    currentStep++;
    if (currentStep >= 8) {
        currentStep = 0;
        loopCounter++;
    }
}

function startPlaying() {
    if (isPlaying) return;
    isPlaying = true;
    document.getElementById('startBtn').classList.add('active');
    document.getElementById('stopBtn').classList.remove('active');
    currentStep = 0;
    loopCounter = 0;
    intervalId = setInterval(scheduler, (60 / bpm) * 500); // half note timing
}

function stopPlaying() {
    if (!isPlaying) return;
    isPlaying = false;
    document.getElementById('startBtn').classList.remove('active');
    document.getElementById('stopBtn').classList.add('active');
    clearInterval(intervalId);
}

document.getElementById('startBtn').addEventListener('click', startPlaying);
document.getElementById('stopBtn').addEventListener('click', stopPlaying);

document.getElementById('bpm').addEventListener('input', e => {
    bpm = parseInt(e.target.value);
});

document.querySelectorAll('.mute-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        muteState[btn.id] = !muteState[btn.id];
        btn.classList.toggle('unmuted', muteState[btn.id]);
    });
});

document.getElementById('kitBtn').addEventListener('click', loadKit);

// Load initial kit
loadKit();
