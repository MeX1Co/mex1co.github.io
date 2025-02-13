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

    // [Keep previous initEffects(), midiToFrequency(), updatePolyphony(), 
    // createVoice(), noteOn(), noteOff(), getAvailableVoice(), 
    // highlightKey() methods unchanged]

    initControls() {
        // [Keep previous control listeners unchanged]

        // Arpeggiator controls
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

    // [Keep rest of the class unchanged]
}

// Initialize synth
const synth = new Synth();

// Handle mobile touch events
document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
