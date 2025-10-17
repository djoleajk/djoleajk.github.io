// ============================================
// SISTEM ZA ZVUČNE NOTIFIKACIJE
// Web Audio API
// ============================================

class AudioNotificationManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3; // Jačina zvuka (0.0 - 1.0)
        
        // Učitaj postavke iz localStorage
        const savedEnabled = localStorage.getItem('audio_notifications_enabled');
        if (savedEnabled !== null) {
            this.enabled = savedEnabled === 'true';
        }
    }

    /**
     * Inicijalizuje Audio Context (samo kada je potreban)
     */
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Resume context ako je suspended (zbog browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        return this.audioContext;
    }

    /**
     * Reprodukuje prijatan ton - dva brza tona
     */
    playCompletionSound() {
        if (!this.enabled) {
            return;
        }

        try {
            const context = this.initAudioContext();
            
            // Prvi ton (viši)
            this.playTone(context, 800, 0, 0.15);
            // Drugi ton (niži)
            this.playTone(context, 600, 0.2, 0.15);
            
            console.log('✓ Zvučni signal reprodukovan');
        } catch (error) {
            console.error('Greška pri reprodukciji zvuka:', error);
        }
    }

    /**
     * Reprodukuje ton sa specifičnom frekvencijom
     */
    playTone(context, frequency, startDelay, duration) {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Tip talasa - 'sine' je najprijatniji
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Envelope za mekši zvuk (fade in/out)
        const now = context.currentTime + startDelay;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    /**
     * Reprodukuje upozoravajući zvuk (za polovinu vremena)
     */
    playMidpointSound() {
        if (!this.enabled) {
            return;
        }

        try {
            const context = this.initAudioContext();
            
            // Jedan kratak ton
            this.playTone(context, 700, 0, 0.1);
            
            console.log('✓ Zvučni signal (polovina) reprodukovan');
        } catch (error) {
            console.error('Greška pri reprodukciji zvuka:', error);
        }
    }

    /**
     * Reprodukuje tri tona za uspešnu kalkulaciju
     */
    playSuccessSound() {
        if (!this.enabled) {
            return;
        }

        try {
            const context = this.initAudioContext();
            
            // Tri uzlazna tona
            this.playTone(context, 523, 0, 0.12);      // C5
            this.playTone(context, 659, 0.15, 0.12);   // E5
            this.playTone(context, 784, 0.3, 0.25);    // G5
            
            console.log('✓ Zvučni signal (успех) reprodukovan');
        } catch (error) {
            console.error('Greška pri reprodukciji zvuka:', error);
        }
    }

    /**
     * Omogućava/onemogućava zvučne notifikacije
     */
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('audio_notifications_enabled', this.enabled.toString());
        
        // Sviraj test ton ako je omogućeno
        if (this.enabled) {
            this.playTone(this.initAudioContext(), 600, 0, 0.1);
        }
        
        return this.enabled;
    }

    /**
     * Postavlja jačinu zvuka
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // Ograniči na 0-1
        localStorage.setItem('audio_volume', this.volume.toString());
    }

    /**
     * Proverava da li su zvučne notifikacije omogućene
     */
    isEnabled() {
        return this.enabled;
    }
}

// Globalna instanca
const audioNotificationManager = new AudioNotificationManager();

// Auto-inicijalizacija - omogući audio context na prvi klik/touch
document.addEventListener('click', () => {
    if (audioNotificationManager.audioContext) {
        audioNotificationManager.audioContext.resume();
    }
}, { once: true });

