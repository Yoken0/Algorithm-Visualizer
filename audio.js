// Audio System for Algorithm Visualizer
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.isSoundEnabled = true;
        this.volume = 0.1;
        this.isComparisonMode = false;
    }

    // Initialize audio context on first user interaction
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Convert bar height to frequency (bigger bars = higher frequency)
    heightToFrequency(height, maxHeight) {
        const minFreq = 200;
        const maxFreq = 800;
        return minFreq + (height / maxHeight) * (maxFreq - minFreq);
    }

    // Play a tone for a given frequency and duration
    playTone(frequency, duration = 100) {
        if (!this.isSoundEnabled || !this.audioContext || this.isComparisonMode) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    // Play sound for bar comparison
    playComparisonSound(height1, height2, maxHeight) {
        const freq1 = this.heightToFrequency(height1, maxHeight);
        const freq2 = this.heightToFrequency(height2, maxHeight);
        
        this.playTone(freq1, 50);
        setTimeout(() => this.playTone(freq2, 50), 25);
    }

    // Play sound for bar swap
    playSwapSound(height, maxHeight) {
        const frequency = this.heightToFrequency(height, maxHeight);
        this.playTone(frequency, 80);
    }

    // Play musical sequence of the sorted array
    async playSortedSequence(array, bars, delay) {
        if (!this.isSoundEnabled || !this.audioContext || this.isComparisonMode) return;
        
        const maxHeight = Math.max(...array);
        
        // Highlight each bar as we play its note
        for (let i = 0; i < array.length; i++) {
            bars[i].classList.add('musical-highlight');
            const frequency = this.heightToFrequency(array[i], maxHeight);
            this.playTone(frequency, 200);
            
            await delay(150);
            bars[i].classList.remove('musical-highlight');
        }
        
        // Final chord - play all frequencies together
        await delay(200);
        const frequencies = array.map(height => this.heightToFrequency(height, maxHeight));
        this.playChord(frequencies, 1000);
    }

    // Play multiple frequencies as a chord
    playChord(frequencies, duration = 1000) {
        if (!this.isSoundEnabled || !this.audioContext || this.isComparisonMode) return;
        
        frequencies.forEach(frequency => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        });
    }

    // Set volume
    setVolume(vol) {
        this.volume = vol;
    }

    // Toggle sound
    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        return this.isSoundEnabled;
    }

    // Set comparison mode
    setComparisonMode(enabled) {
        this.isComparisonMode = enabled;
    }
}
