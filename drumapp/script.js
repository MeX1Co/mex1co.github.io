// script.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Main kit (draggables will be created for these)
const kit = [
    { name: 'kick', file: 'kick.mp3' },        // but1
    { name: 'snare', file: 'snare.mp3' },      // but2
    { name: 'hihat', file: 'hihat_closed.mp3' } // but3 (controls closed+open)
];

// Extra samples for special cases (open hihat)
const extraSamples = {
    hihat_open: 'hihat_open.mp3'
};

// helper for icon paths (place after your `kit` declaration)
const ICON_BASE = '/drumapp/drumicons';
const iconUrl = (name) => `${ICON_BASE}/${name}.png`;

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
    hihat: [
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

            // === ICON: replace button label with icon ===
            btn.textContent = ''; // remove the '1','2'... text
            const btnImg = document.createElement('img');
            btnImg.className = 'icon';
            btnImg.src = iconUrl(kit[i].name);
            btnImg.alt = kit[i].name;
            btn.appendChild(btnImg);
            btn.setAttribute('aria-label', kit[i].name);

            btn.addEventListener('click', () => {
                muteStates[i] = !muteStates[i];
                btn.classList.toggle('unmuted', muteStates[i]);

                // Find matching drum and update style (existing)
                const drumEl = document.querySelector(`.drum[data-index="${i}"]`);
                if (drumEl) {
                    drumEl.classList.toggle('muted', !muteStates[i]);
                }

                // optional: reflect icon dimming on button itself by toggling a class (CSS below handles appearance)
            });
        }
    
/*        if (i < kit.length) {
            // available instrument: enable button and set initial state
            btn.disabled = false;
            btn.classList.toggle('unmuted', muteStates[i]);
            btn.addEventListener('click', () => {
                muteStates[i] = !muteStates[i];
                btn.classList.toggle('unmuted', muteStates[i]);

                // Find matching drum and update style
                const drumEl = document.querySelector(`.drum[data-index="${i}"]`);
                if (drumEl) {
                drumEl.classList.toggle('muted', !muteStates[i]);
                }
            }); 

        } else {
            // no instrument assigned yet -> mark inactive
            btn.disabled = true;
            btn.classList.remove('unmuted');
            btn.style.opacity = '0.5';
        }  */
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
            // el.textContent = d.name.split('_')[0];

            // add icon inside the drum circle
el.textContent = ''; // make sure it's empty
const drumImg = document.createElement('img');
drumImg.className = 'icon';
drumImg.src = iconUrl(d.name);
drumImg.alt = d.name;
el.appendChild(drumImg);

// keep initial mute visuals in sync
if (!muteStates[i]) {
    el.classList.add('muted');
}

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

// Pattern lookup (maps X position to pattern index)
function getPattern(name, x) {
    const patterns = drumPatterns[name] || [];
    if (!patterns.length) return null;
    const available = gridSize - (gridSize * 0.12);
    let frac = x / available;
    frac = Math.max(0, Math.min(1, frac));
    let index = Math.floor(frac * patterns.length);
    if (index >= patterns.length) index = patterns.length - 1;
    return patterns[index];
}

function getLoudness(y) {
    return 1 - (y / (gridSize - (gridSize * 0.12)));
}

// Track open hihat node to stop it when closed plays
let openHihatNode = null;

function playSound(name, loudness, time = 0) {
    // Stop open hihat when closed plays
    if (name === 'hihat' && openHihatNode) {
        try { openHihatNode.stop(time); } catch (e) {}
        openHihatNode = null;
    }

    const src = audioCtx.createBufferSource();
    src.buffer = sounds[name];

    const g = audioCtx.createGain();
    g.gain.value = loudness;

    src.connect(g).connect(audioCtx.destination);
    src.start(time);

    if (name === 'hihat_open') {
        // remember to be able to choke it later
        openHihatNode = src;
        src.onended = () => {
            if (openHihatNode === src) openHihatNode = null;
        };
    }
}

// Scheduling loop (setInterval - same structure you used)
let currentStep = 0;
let schedulerInterval = null;

function scheduler() {
    // guard bpm (avoid NaN)
    const bpmRaw = parseInt(document.getElementById('bpm').value, 10);
    const bpm = (Number.isFinite(bpmRaw) && bpmRaw > 0) ? bpmRaw : 120;
    const now = audioCtx.currentTime;

    document.querySelectorAll('.drum').forEach(el => {
        const kitIndex = parseInt(el.dataset.index, 10);

        // if this kit slot is muted or not available -> skip
        if (!muteStates[kitIndex]) return;

        const name = el.dataset.name;
        const x = parseFloat(el.style.left);
        const y = parseFloat(el.style.top);
        const loudness = getLoudness(y);
        const pattern = getPattern(name, x);

        if (!pattern) return;

        const stepVal = pattern[currentStep];

        if (name === 'hihat') {
            if (stepVal === 1) {
                playSound('hihat', loudness, now + 0.05);
            } else if (stepVal === 2) {
                playSound('hihat_open', loudness, now + 0.05);
            }
        } else {
            if (stepVal === 1) {
                playSound(name, loudness, now + 0.05);
            }
        }
    });

    currentStep = (currentStep + 1) % 16;
}

// Start / Stop handling
document.getElementById('startBtn').addEventListener('click', async () => {
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
    // prevent multiple intervals
    if (schedulerInterval) clearInterval(schedulerInterval);

    const bpmRaw = parseInt(document.getElementById('bpm').value, 10);
    const bpm = (Number.isFinite(bpmRaw) && bpmRaw > 0) ? bpmRaw : 120;
    const stepMs = (60 / bpm) / 4 * 1000;

    currentStep = 0;
    schedulerInterval = setInterval(scheduler, stepMs);
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('startBtn').disabled = true;
    startBtn.classList.add('active');
});

document.getElementById('stopBtn').addEventListener('click', () => {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
    }
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('startBtn').disabled = false;
    startBtn.classList.remove('active');
});

// kit button - used as loader indicator (in future it can switch kits)
const kitBtn = document.getElementById('kitBtn');
kitBtn.dataset.kitname = 'rock';
kitBtn.addEventListener('click', () => {
    // allow re-load if desired
    preloadSounds();
});

// Slider BPM display
const bpmSlider = document.getElementById("bpm");
const bpmValue = document.getElementById("bpmValue");
bpmValue.textContent = `${bpmSlider.value} BPM`;
bpmSlider.addEventListener("input", () => {
    bpmValue.textContent = `${bpmSlider.value} BPM`;
});

// --- MIDI export (per-drum NoteEvents so simultaneous hits stay simultaneous) ---
const drumNoteMap = {
  kick: 36,
  snare: 38,
  hihat: 42,
  hihat_open: 46
};

function exportPatternToMIDI() {
  if (typeof MidiWriter === 'undefined') {
    alert('MidiWriterJS not loaded. Please include it.');
    return;
  }

  const bpmRaw = parseInt(document.getElementById('bpm').value, 10);
  const bpm = (Number.isFinite(bpmRaw) && bpmRaw > 0) ? bpmRaw : 120;

  const track = new MidiWriter.Track();
  track.setTempo(bpm);

  const PPQ = 480;              // pulses per quarter note
  const sixteenthTicks = PPQ / 4;  // 32 ticks = one 16th

  const events = [];

  // Add a tiny initial rest of 1 tick to ensure proper first-step placement
  let initialOffset = 1;

  // for each of the 16 steps
  for (let step = 0; step < 16; step++) {
    const stepStartTick = initialOffset + step * sixteenthTicks;

    document.querySelectorAll('.drum').forEach(el => {
      const kitIndex = +el.dataset.index;
      if (!muteStates[kitIndex]) return;

      const name = el.dataset.name;
      const x = parseFloat(el.style.left);
      const y = parseFloat(el.style.top);
      const pattern = getPattern(name, x);
      if (!pattern) return;

      const val = pattern[step];
      let pitch = null;

      if (name === 'hihat') {
        if (val === 1) pitch = drumNoteMap.hihat;
        else if (val === 2) pitch = drumNoteMap.hihat_open;
      } else if (val === 1 && drumNoteMap[name] !== undefined) {
        pitch = drumNoteMap[name];
      }
      if (pitch !== null) {
        const vel = Math.max(1, Math.min(100, Math.round(getLoudness(y) * 100)));
        events.push(new MidiWriter.NoteEvent({
          pitch: [pitch],
          duration: '16',
          velocity: vel,
          channel: 10,
          tick: stepStartTick
        }));
      }
    });
  }

  track.addEvent(events);

  const writer = new MidiWriter.Writer(track);
  const blob = new Blob([writer.buildFile()], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'pattern.mid';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ensure hook
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) downloadBtn.addEventListener('click', exportPatternToMIDI);


// initialize UI + load kit once on page load
setupMuteButtons();
preloadSounds();
