// script.js

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const kit = [
    { name: 'kick', file: 'rock/kick.mp3' },
    { name: 'snare', file: 'rock/snare.mp3' },
    { name: 'hihat_closed', file: 'rock/hihat_closed.mp3' },
    { name: 'hihat_open', file: 'rock/hihat_open.mp3' }
];

const buffers = {};

function loadSample(name, file) {
    return fetch(file)
        .then(res => res.arrayBuffer())
        .then(data => audioCtx.decodeAudioData(data))
        .then(buffer => { buffers[name] = buffer; });
}

function playSound(name, volume = 1.0, time = 0) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[name];
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode).connect(audioCtx.destination);
    source.start(time);
}

Promise.all(kit.map(d => loadSample(d.name, d.file)))
    .then(() => console.log("All samples loaded"))
    .catch(err => console.error("Sample load error:", err));

const drumPatterns = {
    kick: [
        [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,1,0,0],
        [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
        [1,0,0,0, 0,1,0,0, 1,0,0,1, 0,1,0,0],
        [1,0,1,0, 0,0,1,0, 1,0,1,0, 0,0,1,0],
        [1,0,0,0, 1,0,1,0, 0,1,0,0, 1,0,0,1],
        [1,1,0,1, 0,1,0,0, 1,0,1,1, 0,0,1,0],
        [1,0,1,0, 1,0,1,0, 0,1,0,1, 0,1,0,1],
        [1,0,1,1, 0,1,0,1, 1,0,1,0, 0,1,1,0]
    ],
    snare: [
        [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0],
        [0,0,1,0, 1,0,0,0, 0,1,0,0, 1,0,0,0],
        [0,1,0,1, 0,1,0,0, 1,0,1,0, 0,0,1,0],
        [0,0,1,0, 1,0,1,0, 0,1,0,1, 0,1,0,0],
        [1,0,0,1, 0,1,0,1, 1,0,1,0, 0,1,1,0],
        [0,1,0,0, 1,0,1,0, 0,1,0,1, 1,0,1,0],
        [0,1,1,0, 1,0,1,1, 0,1,0,1, 1,1,0,1],
        [1,1,0,1, 1,0,1,0, 1,1,0,1, 1,0,1,0],
        [1,0,1,1, 0,1,0,1, 1,1,0,1, 0,1,1,0]
    ],
    hihat_closed: [
        [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        [1,1,1,1, 0,0,0,0, 1,1,1,1, 0,0,0,0],
        [1,1,2,1, 1,1,2,1, 1,1,2,1, 1,1,2,1],
        [1,1,2,0, 1,0,1,1, 2,0,1,1, 0,1,2,0],
        [2,0,1,1, 0,2,1,1, 0,1,2,0, 1,1,0,2],
        [1,1,1,2, 2,1,1,1, 1,1,2,1, 2,1,1,0],
        [2,1,2,1, 1,2,1,2, 2,1,2,1, 1,2,1,2],
        [1,1,1,2, 1,1,2,1, 2,1,1,1, 1,2,1,1],
        [2,2,1,2, 1,2,2,1, 2,1,2,2, 1,2,1,2]
    ]
};

let currentStep = 0;
let tempo = 120;
let isPlaying = false;
let nextNoteTime = 0.0;
let scheduleAheadTime = 0.1;
let lookahead = 25;

function scheduler() {
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        for (let name in drumPatterns) {
            const patterns = drumPatterns[name];
            const patternIndex = 0; // Could link to complexity/drag later
            const pattern = patterns[patternIndex];

            if (pattern && pattern[currentStep] !== 0) {
                let soundName = name;
                if (name === 'hihat_closed') {
                    soundName = pattern[currentStep] === 1 ? 'hihat_closed' : 'hihat_open';
                }
                playSound(soundName, 1.0, nextNoteTime);
            }
        }
        nextStep();
    }
    if (isPlaying) {
        setTimeout(scheduler, lookahead);
    }
}

function nextStep() {
    const secondsPerBeat = 60.0 / tempo;
    nextNoteTime += 0.25 * secondsPerBeat; // 16th notes
    currentStep = (currentStep + 1) % 16;
}

function start() {
    if (!isPlaying) {
        audioCtx.resume();
        isPlaying = true;
        currentStep = 0;
        nextNoteTime = audioCtx.currentTime;
        scheduler();
    }
}

function stop() {
    isPlaying = false;
}

// Example: start with a user click
document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("stopBtn").addEventListener("click", stop);
