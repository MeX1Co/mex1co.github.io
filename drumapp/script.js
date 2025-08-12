const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Drum kit
const kit = [
    { name: 'kick', file: 'kick.mp3' },
    { name: 'snare', file: 'snare.mp3' },
    { name: 'hihat_closed', file: 'hihat_closed.mp3' }
];

// Extra sample for open hihat
const extraSamples = {
    'hihat_open': 'hihat_open.mp3'
};

// Patterns (0 = rest, 1 = closed hihat, 2 = open hihat for hihat track)
const drumPatterns = {
    kick: [
        [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,1,0],
        [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        [1,0,1,0, 1,1,1,0, 1,0,1,1, 1,0,1,0],
        [1,1,1,1, 1,0,1,1, 1,1,1,0, 1,1,1,1]
    ],
    snare: [
        [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        [0,0,1,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
        [0,1,0,1, 1,0,0,1, 0,1,0,1, 1,0,0,1],
        [0,1,1,0, 1,1,0,1, 0,1,1,0, 1,1,0,1],
        [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]
    ],
    hihat_closed: [
        [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        [1,1,1,0, 1,1,1,1, 1,1,1,0, 1,1,1,1],
        [2,0,1,1, 1,1,0,1, 2,0,1,1, 1,1,0,1],
        [1,2,1,2, 1,2,1,2, 1,2,1,2, 1,2,1,2]
    ]
};

const sounds = {};
const grid = document.getElementById('grid');
let gridSize;

// Adjusts based on element size in the DOM
function updateGridSize() {
    gridSize = grid.getBoundingClientRect().width;
}
window.addEventListener('resize', updateGridSize);
updateGridSize();

// Load sounds
async function loadSound(url) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return audioCtx.decodeAudioData(arrayBuffer);
}

async function preloadSounds() {
    // Load kit sounds
    for (let d of kit) {
        sounds[d.name] = await loadSound(`/drumapp/rock/${d.file}`);
        const el = document.createElement('div');
        el.className = 'drum';
        el.style.left = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
        el.style.top  = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
        el.textContent = d.name.split('_')[0];
        el.dataset.name = d.name;
        grid.appendChild(el);
        makeDraggable(el);
    }

    // Load extra samples
    for (let name in extraSamples) {
        sounds[name] = await loadSound(`/drumapp/rock/${extraSamples[name]}`);
    }

    document.getElementById('status').textContent = "Ready!";
    document.getElementById('startBtn').disabled = false;
}

// Draggable elements
function makeDraggable(el) {
    let offsetX, offsetY, dragging = false;
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag);
    function startDrag(e) {
        dragging = true;
        const rect = el.getBoundingClientRect();
        const evt = e.touches ? e.touches[0] : e;
        offsetX = evt.clientX - rect.left;
        offsetY = evt.clientY - rect.top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
    function drag(e) {
        if (!dragging) return;
        const evt = e.touches ? e.touches[0] : e;
        let x = evt.clientX - grid.getBoundingClientRect().left - offsetX;
        let y = evt.clientY - grid.getBoundingClientRect().top - offsetY;
        x = Math.max(0, Math.min(gridSize - (gridSize * 0.12), x));
        y = Math.max(0, Math.min(gridSize - (gridSize * 0.12), y));
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
    }
    function endDrag() {
        dragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    }
}

function getPattern(name, x) {
    const patterns = drumPatterns[name] || [];
    const index = Math.floor((x / (gridSize - (gridSize * 0.12))) * (patterns.length - 1));
    return patterns[index];
}

function getLoudness(y) {
    return 1 - (y / (gridSize - (gridSize * 0.12)));
}

// Scheduling variables
let currentStep = 0;
let nextNoteTime = 0.0;
let lookahead = 25.0; // ms
let scheduleAheadTime = 0.1; // seconds
let timerID;
let openHiHatSource = null;

// Play sound with optional stop of open hihat
function playSound(name, loudness, time) {
    if (name === 'hihat_closed' && openHiHatSource) {
        openHiHatSource.stop(time);
        openHiHatSource = null;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = sounds[name];

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = loudness;

    source.connect(gainNode).connect(audioCtx.destination);
    source.start(time);

    if (name === 'hihat_open') {
        openHiHatSource = source;
    }
}

// Schedule a single step
function scheduleStep(step, time) {
    document.querySelectorAll('.drum').forEach(el => {
        const name = el.dataset.name;
        const x = parseFloat(el.style.left);
        const y = parseFloat(el.style.top);
        const loudness = getLoudness(y);
        const pattern = getPattern(name, x);

        if (pattern) {
            if (name === 'hihat_closed') {
                if (pattern[step] === 1) {
                    playSound('hihat_closed', loudness, time);
                } else if (pattern[step] === 2) {
                    playSound('hihat_open', loudness, time);
                }
            } else {
                if (pattern[step] === 1) {
                    playSound(name, loudness, time);
                }
            }
        }
    });
}

// Advance step and set next time
function nextStep() {
    const bpm = parseInt(document.getElementById('bpm').value);
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += 0.25 * secondsPerBeat; // 16th note
    currentStep = (currentStep + 1) % 16;
}

// Scheduler loop
function scheduler() {
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleStep(currentStep, nextNoteTime);
        nextStep();
    }
    timerID = setTimeout(scheduler, lookahead);
}

// Start/stop
document.getElementById('startBtn').onclick = async () => {
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
    currentStep = 0;
    nextNoteTime = audioCtx.currentTime;
    scheduler();
    document.getElementById('stopBtn').disabled = false;
};

document.getElementById('stopBtn').onclick = () => {
    clearTimeout(timerID);
};

preloadSounds();
