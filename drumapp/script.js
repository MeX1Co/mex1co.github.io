const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Main kit
const kit = [
    { name: 'kick', file: 'kick.mp3' },        // but1
    { name: 'snare', file: 'snare.mp3' },      // but2
    { name: 'hihat_closed', file: 'hihat_closed.mp3' } // but3
];

// Extra samples for special cases (open hihat)
const extraSamples = {
    hihat_open: 'hihat_open.mp3'
};


// Patterns
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
    // hi-hat lane uses 0/1/2
    hihat_closed: [
        [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        [1,0,1,0, 1,0,1,2, 1,0,1,0, 1,0,1,2],
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

const sounds = {};
const grid = document.getElementById('grid');
let gridSize;

// Mute states for but1, but2, but3
const muteStates = [false, false, false];

// Set up mute button events
for (let i = 0; i < muteStates.length; i++) {
    const btn = document.getElementById(`but${i + 1}`);
    btn.addEventListener('click', () => {
        muteStates[i] = !muteStates[i];
        btn.textContent = muteStates[i] ? `Unmute ${i + 1}` : `Mute ${i + 1}`;
    });
}

// Adjust grid size dynamically
function updateGridSize() {
    gridSize = grid.getBoundingClientRect().width;
}
window.addEventListener('resize', updateGridSize);
updateGridSize();

// Load sound helper
async function loadSound(url) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return audioCtx.decodeAudioData(arrayBuffer);
}

async function preloadSounds() {
    for (let i = 0; i < kit.length; i++) {
        const d = kit[i];
        sounds[d.name] = await loadSound(`/drumapp/rock/${d.file}`);
        const el = document.createElement('div');
        el.className = 'drum';
        el.style.left = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
        el.style.top  = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
        el.textContent = d.name.split('_')[0];
        el.dataset.name = d.name;
        el.dataset.index = i; // store kit index
        grid.appendChild(el);
        makeDraggable(el);
    }
    // Load extra samples
    for (const [name, file] of Object.entries(extraSamples)) {
        sounds[name] = await loadSound(`/drumapp/rock/${file}`);
    }
    document.getElementById('status').textContent = "Ready!";
    document.getElementById('startBtn').disabled = false;
}

// Draggable behavior
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

// Track open hihat node to stop it
let openHihatNode = null;

function playSound(name, loudness, time) {
    // Stop open hihat when closed plays
    if (name === 'hihat_closed' && openHihatNode) {
        openHihatNode.stop(time);
        openHihatNode = null;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = sounds[name];

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = loudness;

    source.connect(gainNode).connect(audioCtx.destination);
    source.start(time);

    if (name === 'hihat_open') {
        openHihatNode = source;
    }
}

// Scheduling loop
let currentStep = 0;
let schedulerInterval;
function scheduler() {
    const bpm = parseInt(document.getElementById('bpm').value);
    const stepTime = (60 / bpm) / 4; // 16th notes
    const now = audioCtx.currentTime;

    document.querySelectorAll('.drum').forEach(el => {
        const kitIndex = parseInt(el.dataset.index);
        if (muteStates[kitIndex]) return; // skip if muted

        const name = el.dataset.name;
        const x = parseFloat(el.style.left);
        const y = parseFloat(el.style.top);
        const loudness = getLoudness(y);
        const pattern = getPattern(name, x);

        if (pattern) {
            if (name === 'hihat_closed') {
                if (pattern[currentStep] === 1) {
                    playSound('hihat_closed', loudness, now + 0.05);
                } else if (pattern[currentStep] === 2) {
                    playSound('hihat_open', loudness, now + 0.05);
                }
            } else {
                if (pattern[currentStep] === 1) {
                    playSound(name, loudness, now + 0.05);
                }
            }
        }
    });

    currentStep = (currentStep + 1) % 16;
}

// Start/stop
document.getElementById('startBtn').onclick = async () => {
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
    const bpm = parseInt(document.getElementById('bpm').value);
    schedulerInterval = setInterval(scheduler, (60 / bpm) / 4 * 1000);
    document.getElementById('stopBtn').disabled = false;
};

document.getElementById('stopBtn').onclick = () => {
    clearInterval(schedulerInterval);
};

preloadSounds();
