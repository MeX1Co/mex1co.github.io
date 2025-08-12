const kit = [
  { name: 'kick', file: 'kick.mp3' },
  { name: 'snare', file: 'snare.mp3' },
  { name: 'hihat_closed', file: 'hihat_closed.mp3' },
  { name: 'hihat_open', file: 'hihat_open.mp3' },
  { name: 'tom_low', file: 'tom_low.mp3' },
  { name: 'tom_high', file: 'tom_high.mp3' },
  { name: 'crash', file: 'crash.mp3' },
  { name: 'bell', file: 'bell.mp3' }
];

const grid = document.getElementById('grid');
const gridSize = 300;
let audioCtx;
const buffers = {};

let current16n = 0;
let bpm = 100;
let scheduleAheadTime = 0.1; // seconds ahead to schedule
let lookahead = 25; // ms between scheduler runs
let nextNoteTime = 0; // time of next note
let isPlaying = false;
let timerID;

function getComplexity(x) {
  return x / (gridSize - 40);
}

function getLoudness(y) {
  return 1 - (y / (gridSize - 40));
}

function nextNote() {
  // 16th note duration
  const secondsPerBeat = 60.0 / bpm;
  nextNoteTime += 0.25 * secondsPerBeat;
  current16n++;
}

function scheduler() {
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    playScheduledNotes(current16n, nextNoteTime);
    nextNote();
  }
  timerID = setTimeout(scheduler, lookahead);
}

function playScheduledNotes(noteIndex, time) {
  document.querySelectorAll('.drum').forEach(el => {
    const name = el.dataset.name;
    const x = parseFloat(el.style.left);
    const y = parseFloat(el.style.top);
    if (Math.random() < getComplexity(x)) {
      playSound(name, getLoudness(y), time);
    }
  });
}

function playSound(name, volume = 1, time = 0) {
  const source = audioCtx.createBufferSource();
  source.buffer = buffers[name];
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volume;
  source.connect(gainNode).connect(audioCtx.destination);
  source.start(time);
}

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
    x = Math.max(0, Math.min(gridSize - 40, x));
    y = Math.max(0, Math.min(gridSize - 40, y));
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

async function loadBuffer(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
}

async function preloadSounds() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  for (let d of kit) {
    buffers[d.name] = await loadBuffer(`/drumapp/rock/${d.file}`);
  }
  document.getElementById('status').textContent = "Ready!";
  document.getElementById('startBtn').disabled = false;
}

// Init drums visually
kit.forEach(d => {
  const el = document.createElement('div');
  el.className = 'drum';
  el.style.left = Math.random() * (gridSize - 40) + 'px';
  el.style.top  = Math.random() * (gridSize - 40) + 'px';
  el.textContent = d.name.split('_')[0];
  el.dataset.name = d.name;
  grid.appendChild(el);
  makeDraggable(el);
});

// Wait for a click to load audio (browser policy)
document.body.addEventListener('click', function initOnce() {
  preloadSounds();
  document.body.removeEventListener('click', initOnce);
}, { once: true });

document.getElementById('startBtn').onclick = () => {
  bpm = parseInt(document.getElementById('bpm').value);
  isPlaying = true;
  current16n = 0;
  nextNoteTime = audioCtx.currentTime + 0.05;
  scheduler();
  document.getElementById('stopBtn').disabled = false;
};

document.getElementById('stopBtn').onclick = () => {
  isPlaying = false;
  clearTimeout(timerID);
};
