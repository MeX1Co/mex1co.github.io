// Drum kit configuration
const kit = [
    { name: 'kick', file: 'kick.mp3' },
    { name: 'snare', file: 'snare.mp3' },
    { name: 'hihat_closed', file: 'hihat_closed.mp3' },
    { name: 'hihat_open', file: 'hihat_open.mp3' },
    { name: 'tom_high', file: 'tom_high.mp3' },
    { name: 'tom-low', file: 'tom-low.mp3' },
    { name: 'crash', file: 'crash.mp3' } // free slot for maracas or other
];

// Patterns per instrument
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
    ],
    tom1: [],
    tom2: [],
    perc: []
};

// Audio context and buffers
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};
let currentStep = 0;
let bpm = 120;

// Load samples
async function loadSamples() {
    for (let drum of kit) {
        const response = await fetch(`samples/${drum.file}`);
        const arrayBuffer = await response.arrayBuffer();
        buffers[drum.name] = await audioContext.decodeAudioData(arrayBuffer);
    }
}

// Play sound
function playSound(name, velocity = 1, time = 0) {
    const buffer = buffers[name];
    if (!buffer) return;
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = velocity;
    source.buffer = buffer;
    source.connect(gainNode).connect(audioContext.destination);
    source.start(time);
}

// Scheduler
function scheduler() {
    const now = audioContext.currentTime;
    const stepDuration = 60 / bpm / 4;

    for (let drum of kit) {
        let pattern = drumPatterns[drum.name]?.[0]; // will use complexity mapping later
        if (!pattern) continue;

        const stepValue = pattern[currentStep];
        if (stepValue !== 0) {
            let soundName = drum.name;
            if (drum.name === 'hihat_closed') {
                soundName = stepValue === 1 ? 'hihat_closed' : 'hihat_open';
            }
            playSound(soundName, 1, now + 0.05);
        }
    }

    currentStep = (currentStep + 1) % 16;
    setTimeout(scheduler, stepDuration * 1000);
}

// Start
async function start() {
    await audioContext.resume();
    await loadSamples();
    scheduler();
}
