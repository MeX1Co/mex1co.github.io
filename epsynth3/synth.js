// synth.js

// Add this at the top of synth.js
let audioContextStarted = false;

function startAudioContext() {
    if (!audioContextStarted) {
        synth.audioContext.resume().then(() => {
            audioContextStarted = true;
            console.log('AudioContext started successfully!');
        });
    }
}

// Add event listeners for user gestures
document.addEventListener('click', startAudioContext);
document.addEventListener('touchstart', startAudioContext);

// Initialize synth after the AudioContext is started
const synth = new Synth();

class Synth {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.voices = [];
        this.activeNotes = new Map();
        this.lastFrequency = 440;
        this.arpeggiatorActive = false;
        this.arpeggioNotes = [];
        this.arpeggioIndex = 0;
        this.arpeggiatorRate = 0.2;
        this.arpeggiatorOctaves = 1;
        this.arpeggiatorMode = 'up';

        this.initControls();
        this.createKeyboard();
        this.initEffects();
        this.updatePolyphony(5);
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
        // Oscillator
        document.getElementById('waveform').addEventListener('change', (e) => {
            this.voices.forEach(voice => voice.oscillator.type = e.target.value);
        });

        // ADSR
        const adsrControls = ['attack', 'decay', 'sustain', 'release'];
        adsrControls.forEach(param => {
            const element = document.getElementById(param);
            element.addEventListener('input', (e) => {
                document.getElementById(`${param}-value`).textContent = e.target.value;
            });
        });

        // Filter
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

        // Polyphony
        document.getElementById('polyphony').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('polyphony-value').textContent = value;
            this.updatePolyphony(value);
        });

        // Arpeggiator
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

        // Delay
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

        // Create 2 octaves (C2 to C4)
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
                this.noteOn(frequency);
                setTimeout(() => this.noteOff(frequency), 100);
                this.arpeggioIndex++;
            }
        }, this.arpeggiatorRate * 1000);
    }

    getArpeggioNotes() {
        let notes = [...this.arpeggioNotes];
        
        // Add octaves
        for (let octave = 1; octave < this.arpeggiatorOctaves; octave++) {
            notes = notes.concat(
                this.arpeggioNotes.map(f => f * Math.pow(2, octave))
            );
        }

        // Apply mode
        switch(this.arpeggiatorMode) {
            case 'down':
                return notes.reverse();
            case 'updown':
                return notes.concat([...notes].reverse().slice(1));
            case 'random':
                return notes.sort(() => Math.random() - 0.5);
            default: // up
                return notes;
        }
    }


    stopArpeggiator() {
        clearInterval(this.arpeggioInterval);
        this.arpeggioNotes.forEach(f => this.noteOff(f));
        this.arpeggioNotes = [];
    }
}

// Initialize synth
const synth = new Synth();

// Handle mobile touch events
document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });

