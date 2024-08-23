const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = [];
let currentSong = 'an';
let currentIndex = 0;
let source;
let isPlaying = false;
let isLoading = false; // Track loading state
let progressBarInterval;
let songOptions = {};
let currentSelectionIndex = 0; // Track current selection in the song selector
let nextTriggered = false; // Track if "NEXT" was triggered

// Fetch song data from the JSON file
async function fetchSongData() {
    try {
        const response = await fetch('songs/songs.json');
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
    }
}

async function loadAudioFiles(song) {
    if (isLoading) return; // Prevent loading if already in progress
    isLoading = true;
    disableControlButtons(); // Disable buttons during loading
    disableSongSelection(); // Disable song selection during loading

    audioBuffers.length = 0; 
    document.getElementById('line1').textContent = `LOADING...`;

    const { files, title } = songOptions[song];
    for (let i = 0; i < files.length; i++) {
        const response = await fetch(files[i]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.push(audioBuffer);
    }

    document.getElementById('line1').textContent = `SONG ${title} LOADED`;
    currentIndex = 0;
    updateScreen(currentIndex, true);
    isLoading = false;
    enableControlButtons(); // Re-enable buttons after loading
    enableSongSelection(); // Re-enable song selection after loading
}

function playAudio(index, when = 0) {
    if (source) {
        source.onended = null;
        source.stop();
    }
    source = audioContext.createBufferSource();
    source.buffer = audioBuffers[index];
    source.connect(audioContext.destination);
    source.onended = () => onAudioEnded(index);
    source.start(when);
    isPlaying = true;
    updateScreen(index);
    updateProgressBar(index);
    document.getElementById('playButton').classList.add('active');
}

function onAudioEnded(index) {
    clearInterval(progressBarInterval);
    document.getElementById('playButton').classList.remove('active');

    if (nextTriggered) {
        // If next was triggered, go to the next part
        nextTriggered = false; // Reset the trigger
        document.getElementById('nextButton').classList.remove('active');
        currentIndex++;
        if (currentIndex < audioBuffers.length) {
            playAudio(currentIndex, audioContext.currentTime); // Play next track seamlessly
        } else {
            isPlaying = false; // End of the sequence
            currentIndex = 0; // Reset to the beginning
            enableSongSelection();
        }
    } else if (songOptions[currentSong].loopFiles.includes(index) && isPlaying) {
        // Keep looping the current part
        playAudio(index, audioContext.currentTime); // Loop seamlessly
    } else if (isPlaying) {
        currentIndex++;
        if (currentIndex < audioBuffers.length) {
            playAudio(currentIndex, audioContext.currentTime); // Play next track seamlessly
        } else {
            isPlaying = false; // End of the sequence
            currentIndex = 0; // Reset to the beginning
            enableSongSelection();
        }
    }
}

function stopAudio() {
    if (source) {
        source.onended = null;
        source.stop();
        source = null;
    }
    isPlaying = false;
    currentIndex = 0;
    document.getElementById('playButton').classList.remove('active');
    document.getElementById('nextButton').classList.remove('active');
    updateScreen(currentIndex, true);
    clearInterval(progressBarInterval);
    document.getElementById('progressBar').style.width = '0%';
    enableSongSelection();
}

function updateScreen(index, isStopped = false) {
    document.getElementById('line2').textContent = isStopped
        ? '... '
        : `Now Playing: ${songOptions[currentSong].files[index].split('/').pop()}`;
    document.getElementById('line3').textContent = isStopped ? '' : (songOptions[currentSong].loopFiles.includes(index) ? 'LOOPING' : 'NOT LOOPING');
    document.getElementById('line3').style.color = songOptions[currentSong].loopFiles.includes(index) ? 'var(--orange)' : 'var(--white)';
}

function updateProgressBar(index) {
    const progressBar = document.getElementById('progressBar');
    let duration = audioBuffers[index].duration;
    let startTime = audioContext.currentTime;

    clearInterval(progressBarInterval); // Clear any previous interval
    
    progressBarInterval = setInterval(() => {
        let elapsedTime = audioContext.currentTime - startTime;
        let progress = (elapsedTime / duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        if (elapsedTime >= duration) {
            clearInterval(progressBarInterval); // Clear interval when duration is reached
        }
    }, 100); // Update every 100 milliseconds
}

function populateSongSelector() {
    const selector = document.getElementById('songSelector');
    selector.innerHTML = '';
    Object.keys(songOptions).forEach(key => {
        const option = document.createElement('div');
        option.classList.add('song-option');
        option.textContent = songOptions[key].title;
        option.addEventListener('click', () => {
            if (!isPlaying && !isLoading) {
                updateSongSelection(Object.keys(songOptions).indexOf(key));
                currentSong = key;
                loadAudioFiles(currentSong);
            }
        });
        selector.appendChild(option);
    });
    updateSongSelection(0); // Set the initial selection to the first song
}

function updateSongSelection(index) {
    const options = document.querySelectorAll('.song-option');
    options.forEach(el => el.classList.remove('active'));
    options[index].classList.add('active');
    currentSelectionIndex = index; // Update the current selection index
    
    // Scroll the selected song into view if it is out of the visible area
    options[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

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

document.getElementById('playButton').addEventListener('click', () => {
    if (!isPlaying && !isLoading) {
        playAudio(currentIndex, audioContext.currentTime);
        disableSongSelection();
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (isPlaying && songOptions[currentSong].loopFiles.includes(currentIndex) && !isLoading) {
        if (nextTriggered) {
            // Cancel the next action
            nextTriggered = false;
            document.getElementById('nextButton').classList.remove('active');
        } else {
            // Trigger the next action
            nextTriggered = true;
            document.getElementById('nextButton').classList.add('active');
        }
    }
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (!isLoading) {
        stopAudio();
    }
});

// UP, DOWN, and SELECT button functionality
document.getElementById('upButton').addEventListener('click', () => {
    if (!isPlaying && !isLoading) {
        currentSelectionIndex = (currentSelectionIndex - 1 + Object.keys(songOptions).length) % Object.keys(songOptions).length;
        updateSongSelection(currentSelectionIndex);
    }
});

document.getElementById('downButton').addEventListener('click', () => {
    if (!isPlaying && !isLoading) {
        currentSelectionIndex = (currentSelectionIndex + 1) % Object.keys(songOptions).length;
        updateSongSelection(currentSelectionIndex);
    }
});

document.getElementById('selectButton').addEventListener('click', () => {
    if (!isPlaying && !isLoading) {
        currentSong = Object.keys(songOptions)[currentSelectionIndex];
        loadAudioFiles(currentSong);
    }
});

// Initial load
fetchSongData();
