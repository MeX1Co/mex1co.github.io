let currentAudio = null;
let nextAudio = null;
let isPlaying = false;
let isLoading = false;
let currentSong = null;
let currentIndex = 0;
let nextTriggered = false;
let songOptions = {};
let currentSelectionIndex = 0;

// DOM elements cache
const elements = {
  line1: document.getElementById('line1'),
  line2: document.getElementById('line2'),
  line3: document.getElementById('line3'),
  playButton: document.getElementById('playButton'),
  nextButton: document.getElementById('nextButton'),
  progressBar: document.getElementById('progressBar'),
  songSelector: document.getElementById('songSelector')
};

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

// Load song metadata (no audio preloading)
async function loadSong(song) {
  if (isLoading) return;
  
  isLoading = true;
  disableControlButtons();
  disableSongSelection();
  
  elements.line1.textContent = `LOADING ${songOptions[song].title}...`;
  
  try {
    currentSong = song;
    currentIndex = 0;
    
    // Preload first track in background
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
  audio.preload = "metadata";
  audio.load();
  
  // Store for future use
  if (index === currentIndex) {
    currentAudio = audio;
  } else if (index === currentIndex + 1) {
    nextAudio = audio;
  }
}

// Play audio
function playAudio(index) {
  if (!currentAudio || currentAudio.src !== songOptions[currentSong].files[index]) {
    currentAudio = new Audio(songOptions[currentSong].files[index]);
  }
  
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
      // Use preloaded audio if available
      if (currentIndex === currentIndex + 1 && nextAudio) {
        currentAudio = nextAudio;
        nextAudio = null;
      }
      playAudio(currentIndex);
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
  
  isPlaying = false;
  currentIndex = 0;
  nextTriggered = false;
  
  elements.playButton.classList.remove('active');
  elements.nextButton.classList.remove('active');
  elements.progressBar.style.width = '0%';
  
  updateScreen(currentIndex, true);
  enableSongSelection();
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

// Initialize
fetchSongData();

// Auto-suspend audio when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden && currentAudio) {
    currentAudio.pause();
  }
});
