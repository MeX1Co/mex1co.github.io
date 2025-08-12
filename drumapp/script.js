// script.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Main kit (draggables will be created for these)
const kit = [
    { name: 'kick', file: 'kick.mp3' },        // but1
    { name: 'snare', file: 'snare.mp3' },      // but2
    { name: 'hihat_closed', file: 'hihat_closed.mp3' } // but3 (controls closed+open)
];

// Extra samples for special cases (open hihat)
const extraSamples = {
    hihat_open: 'hihat_open.mp3'
};

// Patterns (exactly as you supplied)
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
    // hi-hat lane uses 0/1/2 (0 nothing, 1 closed, 2 open)
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

// Mute states for but1..but8 (true = unmuted/active). first 3 default to unmuted
const muteStates = [true, true, true, false, false, false, false, false];

// Setup mute buttons (but1..but8). but1..but3 map to kit indices 0..2
function setupMuteButtons() {
    for (let i = 0; i < 8; i++) {
        const btn = document.getElementById(`but${i + 1}`);
        if (!btn) continue;
        if (i < kit.length) {
            // available instrument: enable button and set initial state
            btn.disabled = false;
            btn.classList.toggle('unmuted', muteStates[i]);
            btn.addEventListener('click', () => {
                muteStates[i] = !muteStates[i];
                btn.classList.toggle('unmuted', muteStates[i]);
            });
        } else {
            // no instrument assigned yet -> mark inactive
            btn.disabled = true;
            btn.classList.remove('unmuted');
            btn.style.opacity = '0.5';
        }
    }
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
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return audioCtx.decodeAudioData(arrayBuffer);
}

// Preload sounds and create draggable elements
async function preloadSounds() {
    const kitBtn = document.getElementById('kitBtn');
    const startBtn = document.getElementById('startBtn');

    // prevent double-load
    kitBtn.disabled = true;
    kitBtn.classList.remove('ready');
    kitBtn.textContent = 'loading...';
    startBtn.disabled = true;

    // remove any existing drums in grid (reloading)
    document.querySelectorAll('#grid .drum').forEach(n => n.remove());

    try {
        // load kit (and create draggable elements)
        for (let i = 0; i < kit.length; i++) {
            const d = kit[i];
            const url = `/drumapp/rock/${d.file}`;
            sounds[d.name] = await loadSound(url);

            // create draggable visual
            const el = document.createElement('div');
            el.className = 'drum';
            // position relative to current gridSize
            el.style.left = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
            el.style.top  = Math.random() * (gridSize - (gridSize * 0.12)) + 'px';
            el.textContent = d.name.split('_')[0];
            el.dataset.name = d.name;
            el.dataset.index = i; // index in kit array
            grid.appendChild(el);
            makeDraggable(el);
        }

        // load extra samples (open hihat)
        for (const [name, file] of Object.entries(extraSamples)) {
            const url = `/drumapp/rock/${file}`;
            sounds[name] = await loadSound(url);
        }

        // indicate ready
        kitBtn.classList.add('ready');
        kitBtn.textContent = kitBtn.dataset.kitname || 'rock';
        startBtn.disabled = false;
        console.log('All samples loaded.');
    } catch (err) {
        console.error('Error loading samples:', err);
        kitBtn.textContent = 'load failed';
        kitBtn.disabled = false;
        // keep start disabled on failure
    }
}

// Draggable behavior (same as your last working code)
function makeDraggable(el) {
    let offsetX, offsetY, dragging = false;
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, {passive:false});
    function startDrag(e) {
        e.preventDefault && e.preventDefault();
        dragging = true;
        const rect = el.getBoundingClientRect();
        const evt = e.touches ? e.touches[0] : e;
        offsetX = evt.clientX - rect.left;
        offsetY = evt.clientY - rect.top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, {passive:false});
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
    function drag(e) {
        if (!dragging) return;
        const evt = e.touches ? e
