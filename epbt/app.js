// Audio management
let audioContext;
let currentAudio = null;
let nextAudio = null;
let currentSource = null;
let nextSource = null;
let currentGain = null;
let nextGain = null;
let isPlaying = false;
let isLoading = false;
let currentSong = null;
let currentIndex = 0;
let nextTriggered = false;
let songOptions = {};
let currentSelectionIndex = 0;
let wakeLock = null;

// DOM elements
const elements = {
  line1: document.getElementById('line1'),
  line2: document.getElementById('line2'),
  line3: document.getElementById('line3'),
  playButton: document.getElementById('playButton'),
  nextButton: document.getElementById('nextButton'),
  progressBar: document.getElementById('progressBar'),
  songSelector: document.getElementById('songSelector')
};

// Initialize audio context
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Wake lock management
async function enableWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock active');
    } catch (err) {
      console.error('Wake Lock failed:', err);
    }
  }
}

function disableWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

// Fetch song data
async function fetchSongData() {
  try {
    const response = await fetch('songs/songs.json');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    songOptions = data.songs.reduce((acc, song) => {
      acc[song.name] = {
        title: song.title,
        files: song.parts.map(part => `songs/${song.name}/${part}`),
        loopFiles: song.loopable
      };
      return acc;
    }, {});
    
    populateSongSelector();
  } catch (error) {
    console.error('Error loading song data:', error);
    elements.line1.textContent = "SONG DATA ERROR";
  }
}

// Load song metadata
async function loadSong(song) {
  if (isLoading) return;
  
  isLoading = true;
  disableControlButtons();
  disableSongSelection();
  
  elements.line1.textContent = `LOADING ${songOptions[song].title}...`;
  
  try {
    currentSong = song;
    currentIndex = 0;
    
    // Initialize audio context
    initAudioContext();
    
    // Preload first track
    preloadNextTrack(0);
    
    elements.line1.textContent = `READY: ${songOptions[song].title}`;
    updateScreen(currentIndex, true);
  } catch (error) {
    console.error('Loading failed:', error);
    elements.line1.textContent = "LOAD FAILED";
  }
  
  isLoading = false;
  enableControlButtons();
  enableSongSelection();
}

// Preload next track
function preloadNextTrack(index) {
  if (!songOptions[currentSong] || !songOptions[currentSong].files[index]) return;
  
  // Create new audio element
  const audio = new Audio(songOptions[currentSong].files[index]);
  audio.preload = "auto";
  audio.load();
  
  if (index === currentIndex) {
    currentAudio = audio;
  } else if (index === currentIndex + 1) {
    nextAudio = audio;
  }
}

// Play audio with gapless transition
function playAudio(index) {
  initAudioContext();
  
  // Cleanup previous sources
  if (currentSource) {
    currentSource.disconnect();
    if (currentGain) currentGain.disconnect();
  }
  
  if (!currentAudio || currentAudio.src !== songOptions[currentSong].files[index]) {
    currentAudio = new Audio(songOptions[currentSong].files[index]);
  }
  
  // Create Web Audio nodes
  currentSource = audioContext.createMediaElementSource(currentAudio);
  currentGain = audioContext.createGain();
  currentSource.connect(currentGain);
  currentGain.connect(audioContext.destination);
  
  // Set playback properties
  const isLoopable = songOptions[currentSong].loopFiles.includes(index);
  currentAudio.loop = isLoopable && !nextTriggered;
  
  // Event listeners
  currentAudio.addEventListener('timeupdate', updateProgressBar);
  currentAudio.addEventListener('ended', () => onAudioEnded(index));
  currentAudio.addEventListener('error', handleAudioError);
  
  // Start playback
  currentAudio.play()
    .then(() => {
      isPlaying = true;
      updateScreen(index);
      elements.playButton.classList.add('active');
      enableWakeLock();
      
      // Preload next track during playback
      if (index < songOptions[currentSong].files.length - 1 && !nextAudio) {
        preloadNextTrack(index + 1);
      }
    })
    .catch(error => {
      console.error("Playback failed:", error);
      elements.line1.textContent = "PLAY ERROR";
      stopAudio();
    });
}

// Schedule next track for gapless transition
function scheduleNextTrack() {
  if (!nextAudio || !audioContext) return;
  
  // Create nodes for next track
  nextSource = audioContext.createMediaElementSource(nextAudio);
  nextGain = audioContext.createGain();
  nextSource.connect(nextGain);
  nextGain.connect(audioContext.destination);
  nextGain.gain.value = 0; // Start silent
  
  // Calculate transition time
  const now = audioContext.currentTime;
  const startTime = now + 0.1; // Start slightly in future
  
  // Set up crossfade
  currentGain.gain.setValueAtTime(1, now);
  currentGain.gain.linearRampToValueAtTime(0, startTime);
  
  nextGain.gain.setValueAtTime(0, now);
  nextGain.gain.linearRampToValueAtTime(1, startTime);
  
  // Play next track
  nextAudio.play()
    .then(() => {
      // Update state
      currentIndex++;
      currentAudio = nextAudio;
      currentSource = nextSource;
      currentGain = nextGain;
      
      // Reset next track
      nextAudio = null;
      nextSource = null;
      nextGain = null;
      
      updateScreen(currentIndex);
    })
    .catch(console.error);
}

// Handle audio errors
function handleAudioError() {
  if (currentAudio) {
    console.error("Audio error:", currentAudio.error);
    elements.line1.textContent = `ERROR: ${currentAudio.error.message}`;
  }
  stopAudio();
}

// Audio ended handler
function onAudioEnded(index) {
  elements.playButton.classList.remove('active');

  if (nextTriggered || !songOptions[currentSong].loopFiles.includes(index)) {
    nextTriggered = false;
    elements.nextButton.classList.remove('active');
    
    currentIndex++;
    if (currentIndex < songOptions[currentSong].files.length) {
      // Use gapless transition if possible
      if (nextAudio && audioContext) {
        scheduleNextTrack();
      } else {
        playAudio(currentIndex);
      }
    } else {
      stopAudio();
    }
  } else {
    // Continue looping
    playAudio(index);
  }
}

// Stop audio
function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (nextAudio) {
    nextAudio.pause();
    nextAudio = null;
  }
  
  if (currentSource) {
    currentSource.disconnect();
    currentSource = null;
  }
  
  if (currentGain) {
    currentGain.disconnect();
    currentGain = null;
  }
  
  isPlaying = false;
  currentIndex = 0;
  nextTriggered = false;
  
  elements.playButton.classList.remove('active');
  elements.nextButton.classList.remove('active');
  elements.progressBar.style.width = '0%';
  
  updateScreen(currentIndex, true);
  enableSongSelection();
  disableWakeLock();
}

// Update display
function updateScreen(index, isStopped = false) {
  if (!songOptions[currentSong]) return;
  
  elements.line2.textContent = isStopped
    ? 'SELECTED: '
    : `PLAYING: ${songOptions[currentSong].files[index].split('/').pop()}`;
    
  elements.line3.textContent = isStopped 
    ? '' 
    : (songOptions[currentSong].loopFiles.includes(index) ? 'LOOPING' : '');
  
  elements.line3.style.color = songOptions[currentSong].loopFiles.includes(index) 
    ? 'var(--color)' 
    : 'var(--white)';
}

// Progress bar
function updateProgressBar() {
  if (!currentAudio || !currentAudio.duration) return;
  
  const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
  elements.progressBar.style.width = `${progress}%`;
}

// Populate song selector
function populateSongSelector() {
  elements.songSelector.innerHTML = '';
  
  Object.keys(songOptions).forEach((key, index) => {
    const option = document.createElement('div');
    option.classList.add('song-option');
    option.textContent = songOptions[key].title;
    option.dataset.songKey = key;
    
    option.addEventListener('click', () => {
      if (!isPlaying && !isLoading) {
        updateSongSelection(index);
        loadSong(key);
      }
    });
    
    elements.songSelector.appendChild(option);
  });
  
  updateSongSelection(0);
}

// Update song selection
function updateSongSelection(index) {
  const options = document.querySelectorAll('.song-option');
  options.forEach(el => el.classList.remove('active'));
  
  if (options[index]) {
    options[index].classList.add('active');
    currentSelectionIndex = index;
    options[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Disable/enable controls
function disableSongSelection() {
  document.querySelectorAll('.song-option').forEach(el => {
    el.classList.add('disabled');
  });
}

function enableSongSelection() {
  document.querySelectorAll('.song-option').forEach(el => {
    el.classList.remove('disabled');
  });
}

function disableControlButtons() {
  document.querySelectorAll('.control-button').forEach(button => {
    button.disabled = true;
  });
}

function enableControlButtons() {
  document.querySelectorAll('.control-button').forEach(button => {
    button.disabled = false;
  });
}

// Event listeners
document.getElementById('playButton').addEventListener('click', () => {
  if (!isPlaying && !isLoading && currentSong) {
    playAudio(currentIndex);
    disableSongSelection();
  }
});

document.getElementById('nextButton').addEventListener('click', handleNextButton);
document.addEventListener('keydown', (e) => e.key === '1' && handleNextButton());

function handleNextButton() {
  if (isPlaying && songOptions[currentSong].loopFiles.includes(currentIndex)) {
    nextTriggered = !nextTriggered;
    elements.nextButton.classList.toggle('active', nextTriggered);
    
    // If currently looping, force transition
    if (nextTriggered && currentAudio.loop) {
      currentAudio.loop = false;
    }
  }
}

document.getElementById('stopButton').addEventListener('click', () => {
  if (!isLoading) stopAudio();
});

// Navigation controls
document.getElementById('upButton').addEventListener('click', () => {
  if (!isPlaying && !isLoading) {
    currentSelectionIndex = Math.max(0, currentSelectionIndex - 1);
    updateSongSelection(currentSelectionIndex);
  }
});

document.getElementById('downButton').addEventListener('click', () => {
  if (!isPlaying && !isLoading) {
    currentSelectionIndex = Math.min(
      Object.keys(songOptions).length - 1, 
      currentSelectionIndex + 1
    );
    updateSongSelection(currentSelectionIndex);
  }
});

document.getElementById('selectButton').addEventListener('click', () => {
  if (!isPlaying && !isLoading) {
    const songKey = Object.keys(songOptions)[currentSelectionIndex];
    loadSong(songKey);
  }
});

// Auto-resume audio when tab becomes visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (currentAudio && isPlaying) {
      currentAudio.pause();
    }
    disableWakeLock();
  } else if (isPlaying && currentAudio) {
    currentAudio.play().catch(console.error);
    enableWakeLock();
  }
});

// Initialize
fetchSongData();

// Resume audio context on interaction
document.body.addEventListener('click', () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
});
