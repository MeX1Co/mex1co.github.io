// script.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const kit = [
    { name: 'kick', file: 'kick.mp3' },
    { name: 'snare', file: 'snare.mp3' },
    { name: 'hihat_closed', file: 'hihat_closed.mp3' } // single draggable lane for hi-hat
];

// We'll also load the open hi-hat sample (used when pattern value === 2)
const extraSamples = {
    hihat_open: 'hihat_open.mp3'
};

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

const sounds = {};
const grid = document.getElementById('grid');
let gridSize;

// compute grid size used for positioning (same calculation as your working code)
function updateGridSize() {
    gridSize = grid.getBoundingClientRect().width;
}
window.addEventListener('resize', updateGridSize);
updateGridSize();

// loader
async function loadSoundFile(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    const ab = await res.arrayBuffer();
    return await audioCtx.decodeAudioData(ab);
}

async function preloadSounds() {
    // load main kit (creates draggable elements)
    for (let d of kit) {
        sounds[d.name] = await loadSoundFile(`/drumapp/rock/${d.file}`);
        const el = document.createElement('div');
        el.className = 'drum';
        el.style.left = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
        el.style.top  = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
        el.textContent = d.name.split('_')[0];
        el.dataset.name = d.name;
        grid.appendChild(el);
        makeDraggable(el);
    }
    // load the open hi-hat sample (not a separate draggable)
    sounds['hihat_open'] = await loadSoundFile(`/drumapp/rock/${extraSamples.hihat_open}`);

    document.getElementById('status').textContent = "Ready!";
    document.getElementById('startBtn').disabled = false;
}

// draggable (same as your working code)
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

// pattern selection (maps X position to one of the 10 patterns)
function getPattern(name, x) {
    const patterns = drumPatterns[name] || [];
    if (patterns.length === 0) return null;
    const available = gridSize - (gridSize * 0.12); // same used for clamping
    let frac = x / available;
    if (frac < 0) frac = 0; if (frac > 1) frac = 1;
    let index = Math.floor(frac * patterns.length);
    if (index >= patterns.length) index = patterns.length - 1;
    return patterns[index];
}

function getLoudness(y) {
    return 1 - (y / (gridSize - (gridSize * 0.12)));
}

function playSound(name, loudness, time) {
    const src = audioCtx.createBufferSource();
    src.buffer = sounds[name];
    const g = audioCtx.createGain();
    g.gain.value = loudness;
    src.connect(g).connect(audioCtx.destination);
    src.start(time);
}

// scheduling variables
let currentStep = 0;
let schedulerInterval;

// scheduler called once every 16th note (via setInterval) — uses audioCtx.currentTime + small offset
function scheduler() {
    const bpm = parseInt(document.getElementById('bpm').value, 10) || 100;
    const now = audioCtx.currentTime;

    document.querySelectorAll('.drum').forEach(el => {
        const name = el.dataset.name; // 'kick', 'snare', 'hihat_closed'
        const x = parseFloat(el.style.left);
        const y = parseFloat(el.style.top);
        const loudness = getLoudness(y);
        const pattern = getPattern(name, x);

        if (!pattern) return;

        const stepVal = pattern[currentStep]; // 0 / 1 / (2 for hi-hat)
        if (name === 'hihat_closed') {
            if (stepVal === 1) playSound('hihat_closed', loudness, now + 0.05);
            else if (stepVal === 2) playSound('hihat_open', loudness, now + 0.05);
        } else {
            if (stepVal === 1) playSound(name, loudness, now + 0.05);
        }
    });

    currentStep = (currentStep + 1) % 16;
}

// Start / Stop handlers (same style as the working code)
document.getElementById('startBtn').onclick = async () => {
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
    const bpm = parseInt(document.getElementById('bpm').value, 10) || 100;
    const stepMs = (60 / bpm) / 4 * 1000; // ms per 16th
    // start interval scheduler
    clearInterval(schedulerInterval);
    schedulerInterval = setInterval(scheduler, stepMs);
    document.getElementById('stopBtn').disabled = false;
};

document.getElementById('stopBtn').onclick = () => {
    clearInterval(schedulerInterval);
    document.getElementById('stopBtn').disabled = true;
};

// preload and init
preloadSounds().catch(err => {
    console.error('Failed to preload sounds:', err);
    document.getElementById('status').textContent = 'Error loading sounds (see console)';
});
