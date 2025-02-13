class Synth {
    constructor() {
        // Defer AudioContext creation until user interaction.
        this.audioContext = null;
        this.voices = [];
        this.activeNotes = new Map();
        this.lastFrequency = 440;
        this.arpeggiatorActive = false;
        this.arpeggioNotes = [];
        this.arpeggioIndex = 0;
        this.arpeggiatorRate = 0.2;
        this.arpeggiatorOctaves = 1;
        this.arpeggiatorMode = 'up';

        // Setup the start button so that the AudioContext is created/resumed on a user gesture.
        this.initStartButton();
    }

    initStartButton() {
        const startButton = document.getElementById('startButton');
        const startContainer = document.getElementById('start-container');
        
        const initSynth = async () => {
            // Create the AudioContext only after a user gesture.
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioContext.state !== 'running') {
                await this.audioContext.resume();
            }
            
            // Now initialize the controls, keyboard, effects, and polyphony.
            this.initControls();
            this.createKeyboard();
            this.initEffects();
            this.updatePolyphony(parseInt(document.getElementById('polyphony').value));

            // Remove the start button container.
            startContainer.remove();
            
            // Enable controls that were disabled.
            document.querySelectorAll('input, select, button').forEach(el => {
                el.disabled = false;
            });
        };

        startButton.addEventListener('click', initSynth);
        startButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            initSynth();
        }, { passive: false });
    }

    initEffects() {
        this.delay = this.audioContext.createDelay(2.0);
        this.delay.delayTime.value = 0;
        this.delayFeedback = this.audioContext.createGain();
        this.delayFeedback.gain.value = 0;
        
        this.delay.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delay);
        this.delay.connect(this.audioContext.destination);
    }

    initControls() {
        // Oscillator type control
        document.getElementById('waveform').addEventListener('change', (e) => {
            this.voices.forEach(voice => voice.oscillator.type = e.target.value);
        });

        // ADSR controls: update displayed values on input.
        const adsrControls = ['attack', 'decay', 'sustain', 'release'];
        adsrControls.forEach(param => {
            const element = document.getElementById(param);
            element.addEventListener('input', (e) => {
                document.getElementById(`${param}-value`).textContent = e.target.value;
            });
        });

        // Filter controls: cutoff and resonance.
        document.getElementById('cutoff').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('cutoff-value').textContent = value;
            this.voices.forEach(voice => voice.filter.frequency.setValueAtTime(value, this.audioContext.currentTime));
        });

        document.getElementById('resonance').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('resonance-value').textContent = value;
            this.voices.forEach(voice => voice.filter.Q.setValueAtTime(value, this.audioContext.currentTime));
        });

        // Polyphony control.
        document.getElementById('polyphony').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('polyphony-value').textContent = value;
            this.updatePolyphony(value);
        });

        // Arpeggiator controls.
        document.getElementById('arpeggiator').addEventListener('change', (e) => {
            this.arpeggiatorActive = e.target.checked;
            if (this.arpeggiatorActive) {
                this.startArpeggiator();
            } else {
                this.stopArpeggiator();
            }
        });

        document.getElementById('arpeggiator-rate').addEventListener('input', (e) => {
            this.arpeggiatorRate = parseFloat(e.target.value);
            document.getElementById('arpeggiator-rate-value').textContent = e.target.value;
        });

        document.getElementById('arpeggiator-octaves').addEventListener('input', (e) => {
            this.arpeggiatorOctaves = parseInt(e.target.value);
            document.getElementById('arpeggiator-octaves-value').textContent = e.target.value;
        });

        document.getElementById('arpeggiator-mode').addEventListener('change', (e) => {
            this.arpeggiatorMode = e.target.value;
        });

        // Delay controls.
        document.getElementById('delay-time').addEventListener('input', (e) => {
            document.getElementById('delay-time-value').textContent = e.target.value;
            this.delay.delayTime.setValueAtTime(e.target.value, this.audioContext.currentTime);
        });

        document.getElementById('delay-feedback').addEventListener('input', (e) => {
            document.getElementById('delay-feedback-value').textContent = e.target.value;
            this.delayFeedback.gain.setValueAtTime(e.target.value, this.audioContext.currentTime);
        });
    }

    createKeyboard() {
        const keyboard = document.getElementById('keyboard');
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let whiteKeyCount = 0;

        // Create a 2-octave keyboard (e.g., C2 to C4)
        for (let octave = 2; octave <= 3; octave++) {
            notes.forEach((note, index) => {
                const isBlack = note.includes('#');
                const key = document.createElement('div');
                const midiNote = (octave * 12) + index + 12;
                const frequency = this.midiToFrequency(midiNote);

                key.className = `key ${isBlack ? 'black-key' : 'white-key'}`;
                key.dataset.note = frequency;
                key.style.left = isBlack ? 
                    `${whiteKeyCount * 28 - 9}px` : 
                    `${whiteKeyCount * 28}px`;

                if (!isBlack) whiteKeyCount++;

                key.addEventListener('mousedown', () => this.noteOn(frequency));
                key.addEventListener('mouseup', () => this.noteOff(frequency));
                key.addEventListener('mouseleave', () => this.noteOff(frequency));

                keyboard.appendChild(key);
            });
        }
    }

    midiToFrequency(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    updatePolyphony(maxVoices) {
        while (this.voices.length > maxVoices) {
            this.voices.pop().disconnect();
        }
        while (this.voices.length < maxVoices) {
            this.voices.push(this.createVoice());
        }
    }

    createVoice() {
        const now = this.audioContext.currentTime;
        const voice = {
            oscillator: this.audioContext.createOscillator(),
            filter: this.audioContext.createBiquadFilter(),
            gain: this.audioContext.createGain(),
            envelope: {
                attack: 0.1,
                decay: 0.3,
                sustain: 0.7,
                release: 0.2
            },
            active: false
        };

        voice.oscillator.type = document.getElementById('waveform').value;
        voice.filter.type = 'lowpass';
        voice.filter.frequency.value = document.getElementById('cutoff').value;
        voice.filter.Q.value = document.getElementById('resonance').value;

        voice.oscillator.connect(voice.filter);
        voice.filter.connect(voice.gain);
        voice.gain.connect(this.delay);
        voice.gain.connect(this.audioContext.destination);
        
        voice.oscillator.start();
        voice.gain.gain.setValueAtTime(0, now);
        return voice;
    }

    noteOn(frequency) {
        if (this.arpeggiatorActive) {
            if (!this.arpeggioNotes.includes(frequency)) {
                this.arpeggioNotes.push(frequency);
            }
            return;
        }

        const voice = this.getAvailableVoice();
        if (!voice) return;

        const portamentoTime = parseFloat(document.getElementById('portamento').value);
        const now = this.audioContext.currentTime;

        voice.oscillator.frequency.cancelScheduledValues(now);
        if (portamentoTime > 0) {
            voice.oscillator.frequency.exponentialRampToValueAtTime(frequency, now + portamentoTime);
        } else {
            voice.oscillator.frequency.setValueAtTime(frequency, now);
        }

        const attack = parseFloat(document.getElementById('attack').value);
        const decay = parseFloat(document.getElementById('decay').value);
        const sustain = parseFloat(document.getElementById('sustain').value);

        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(0, now);
        voice.gain.gain.linearRampToValueAtTime(1, now + attack);
        voice.gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);

        voice.active = true;
        this.activeNotes.set(frequency, voice);
        this.highlightKey(frequency, true);
    }

    noteOff(frequency) {
        if (this.arpeggiatorActive) {
            this.arpeggioNotes = this.arpeggioNotes.filter(f => f !== frequency);
            return;
        }

        const voice = this.activeNotes.get(frequency);
        if (!voice) return;

        const release = parseFloat(document.getElementById('release').value);
        const now = this.audioContext.currentTime;

        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.exponentialRampToValueAtTime(0.001, now + release);

        setTimeout(() => {
            voice.active = false;
        }, release * 1000);

        this.activeNotes.delete(frequency);
        this.highlightKey(frequency, false);
    }

noteOnArpeggiated(frequency) {
    const voice = this.getAvailableVoice();
    if (!voice) return;
    const portamentoTime = parseFloat(document.getElementById('portamento').value);
    const now = this.audioContext.currentTime;
    voice.oscillator.frequency.cancelScheduledValues(now);
    if (portamentoTime > 0) {
        voice.oscillator.frequency.exponentialRampToValueAtTime(frequency, now + portamentoTime);
    } else {
        voice.oscillator.frequency.setValueAtTime(frequency, now);
    }
    const attack = parseFloat(document.getElementById('attack').value);
    const decay = parseFloat(document.getElementById('decay').value);
    const sustain = parseFloat(document.getElementById('sustain').value);
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(0, now);
    voice.gain.gain.linearRampToValueAtTime(1, now + attack);
    voice.gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
    voice.active = true;
    this.activeNotes.set(frequency, voice);
    this.highlightKey(frequency, true);
}

noteOffArpeggiated(frequency) {
    const voice = this.activeNotes.get(frequency);
    if (!voice) return;
    const release = parseFloat(document.getElementById('release').value);
    const now = this.audioContext.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.001, now + release);
    setTimeout(() => {
        voice.active = false;
    }, release * 1000);
    this.activeNotes.delete(frequency);
    this.highlightKey(frequency, false);
}


    
    getAvailableVoice() {
        return this.voices.find(voice => !voice.active);
    }

    highlightKey(frequency, active) {
        const keys = document.querySelectorAll(`[data-note="${frequency}"]`);
        keys.forEach(key => active ? 
            key.classList.add('active') : 
            key.classList.remove('active'));
    }

startArpeggiator() {
    this.arpeggioInterval = setInterval(() => {
        if (this.arpeggioNotes.length > 0) {
            const notes = this.getArpeggioNotes();
            const frequency = notes[this.arpeggioIndex % notes.length];
            this.noteOnArpeggiated(frequency);
            // Duration of the note can be adjusted as needed.
            setTimeout(() => this.noteOffArpeggiated(frequency), 100);
            this.arpeggioIndex++;
        }
    }, this.arpeggiatorRate * 1000);
}

    getArpeggioNotes() {
        let notes = [...this.arpeggioNotes];
        
        // Add additional octaves if needed.
        for (let octave = 1; octave < this.arpeggiatorOctaves; octave++) {
            notes = notes.concat(
                this.arpeggioNotes.map(f => f * Math.pow(2, octave))
            );
        }

        // Apply the selected mode.
        switch(this.arpeggiatorMode) {
            case 'down':
                return notes.reverse();
            case 'updown':
                return notes.concat([...notes].reverse().slice(1));
            case 'random':
                return notes.sort(() => Math.random() - 0.5);
            default: // 'up'
                return notes;
        }
    }

    stopArpeggiator() {
        clearInterval(this.arpeggioInterval);
        this.arpeggioNotes.forEach(f => this.noteOff(f));
        this.arpeggioNotes = [];
    }
}

// On DOMContentLoaded, initialize the Synth instance.
// This will set up the start button, and audio-related initialization will occur on user interaction.
document.addEventListener('DOMContentLoaded', () => {
    const synth = new Synth();
    // Disable all controls until the start button is pressed.
    document.querySelectorAll('input, select, button').forEach(el => {
        if(el.id !== 'startButton') el.disabled = true;
    });
});

// Prevent mobile touch events from scrolling the page.
document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });


// Existing noteOn remains for manual (non-arpeggiator) playing:
noteOn(frequency) {
    if (this.arpeggiatorActive) {
        // When arpeggiator is active, add frequency to chord if not already present.
        if (!this.arpeggioNotes.includes(frequency)) {
            this.arpeggioNotes.push(frequency);
        }
        // Do not play immediately.
        return;
    }
    // Normal voice triggering when arpeggiator is off.
    const voice = this.getAvailableVoice();
    if (!voice) return;
    const portamentoTime = parseFloat(document.getElementById('portamento').value);
    const now = this.audioContext.currentTime;
    voice.oscillator.frequency.cancelScheduledValues(now);
    if (portamentoTime > 0) {
        voice.oscillator.frequency.exponentialRampToValueAtTime(frequency, now + portamentoTime);
    } else {
        voice.oscillator.frequency.setValueAtTime(frequency, now);
    }
    const attack = parseFloat(document.getElementById('attack').value);
    const decay = parseFloat(document.getElementById('decay').value);
    const sustain = parseFloat(document.getElementById('sustain').value);
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(0, now);
    voice.gain.gain.linearRampToValueAtTime(1, now + attack);
    voice.gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
    voice.active = true;
    this.activeNotes.set(frequency, voice);
    this.highlightKey(frequency, true);
}

// New functions for arpeggiated playback that bypass the arpeggiatorActive check.
noteOnArpeggiated(frequency) {
    const voice = this.getAvailableVoice();
    if (!voice) return;
    const portamentoTime = parseFloat(document.getElementById('portamento').value);
    const now = this.audioContext.currentTime;
    voice.oscillator.frequency.cancelScheduledValues(now);
    if (portamentoTime > 0) {
        voice.oscillator.frequency.exponentialRampToValueAtTime(frequency, now + portamentoTime);
    } else {
        voice.oscillator.frequency.setValueAtTime(frequency, now);
    }
    const attack = parseFloat(document.getElementById('attack').value);
    const decay = parseFloat(document.getElementById('decay').value);
    const sustain = parseFloat(document.getElementById('sustain').value);
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(0, now);
    voice.gain.gain.linearRampToValueAtTime(1, now + attack);
    voice.gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
    voice.active = true;
    this.activeNotes.set(frequency, voice);
    this.highlightKey(frequency, true);
}

noteOffArpeggiated(frequency) {
    const voice = this.activeNotes.get(frequency);
    if (!voice) return;
    const release = parseFloat(document.getElementById('release').value);
    const now = this.audioContext.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.001, now + release);
    setTimeout(() => {
        voice.active = false;
    }, release * 1000);
    this.activeNotes.delete(frequency);
    this.highlightKey(frequency, false);
}

// Modify the arpeggiator loop to use the new functions:
startArpeggiator() {
    this.arpeggioInterval = setInterval(() => {
        if (this.arpeggioNotes.length > 0) {
            const notes = this.getArpeggioNotes();
            const frequency = notes[this.arpeggioIndex % notes.length];
            this.noteOnArpeggiated(frequency);
            // Duration of the note can be adjusted as needed.
            setTimeout(() => this.noteOffArpeggiated(frequency), 100);
            this.arpeggioIndex++;
        }
    }, this.arpeggiatorRate * 1000);
}

