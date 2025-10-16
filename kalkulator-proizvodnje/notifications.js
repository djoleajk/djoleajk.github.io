// ============================================
// SISTEM ZA PUSH NOTIFIKACIJE
// Web Notifications API + Service Worker
// ============================================

class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.timers = new Map(); // Aktivni tajmeri
    }

    /**
     * Proverava da li su notifikacije podržane
     */
    isSupported() {
        return 'Notification' in window && 'serviceWorker' in navigator;
    }

    /**
     * Traži dozvolu za notifikacije
     */
    async requestPermission() {
        if (!this.isSupported()) {
            console.warn('Notifikacije nisu podržane u ovom pretraživaču');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                console.log('✓ Дозвола за нотификације одобрена');
                
                // Čuvaj u localStorage
                localStorage.setItem('notifications_enabled', 'true');
                
                // Prikaži test notifikaciju
                this.showNotification('Нотификације укључене', {
                    body: 'Бићете обавештени када се калкулација заврши',
                    icon: '🔔',
                    tag: 'welcome'
                });
                
                return true;
            } else {
                console.log('Дозвола за нотификације одбијена');
                localStorage.setItem('notifications_enabled', 'false');
                return false;
            }
        } catch (error) {
            console.error('Грешка при захтеву за дозволу:', error);
            return false;
        }
    }

    /**
     * Prikazuje notifikaciju
     */
    async showNotification(title, options = {}) {
        if (!this.isSupported() || this.permission !== 'granted') {
            console.log('Notifikacije nisu omogućene');
            return;
        }

        const defaultOptions = {
            badge: '🏭',
            icon: options.icon || '🔔',
            vibrate: [200, 100, 200],
            requireInteraction: false,
            silent: false
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            // Pokušaj sa Service Worker-om prvo
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(title, finalOptions);
            } else {
                // Fallback na obične notifikacije
                new Notification(title, finalOptions);
            }
            
            console.log('✓ Нотификација приказана:', title);
        } catch (error) {
            console.error('Грешка при приказивању нотификације:', error);
        }
    }

    /**
     * Postavlja tajmer za notifikaciju
     */
    scheduleNotification(id, delayMs, title, options = {}) {
        // Otkaži postojeći tajmer ako postoji
        if (this.timers.has(id)) {
            clearTimeout(this.timers.get(id));
        }

        const timerId = setTimeout(() => {
            this.showNotification(title, options);
            this.timers.delete(id);
        }, delayMs);

        this.timers.set(id, timerId);
        console.log(`✓ Нотификација заказана за ${Math.round(delayMs / 1000)}s`);
    }

    /**
     * Otkazuje zakazanu notifikaciju
     */
    cancelNotification(id) {
        if (this.timers.has(id)) {
            clearTimeout(this.timers.get(id));
            this.timers.delete(id);
            console.log('✓ Нотификација отказана');
        }
    }

    /**
     * Otkazuje sve notifikacije
     */
    cancelAllNotifications() {
        this.timers.forEach((timerId) => clearTimeout(timerId));
        this.timers.clear();
        console.log('✓ Све нотификације отказане');
    }

    /**
     * Notifikacija za završetak kalkulacije
     */
    notifyCalculationComplete(operation, numberOfPieces) {
        this.showNotification('✅ Производња завршена!', {
            body: `${operation}: ${numberOfPieces} комада завршено`,
            icon: '✅',
            tag: 'calculation-complete',
            requireInteraction: true
        });
    }

    /**
     * Notifikacija za upozorenje (npr. polovina vremena prošla)
     */
    notifyMidpoint(operation, remainingTime) {
        this.showNotification('⏰ Половина времена прошла', {
            body: `${operation}: Још ${remainingTime} до краја`,
            icon: '⏰',
            tag: 'midpoint-warning'
        });
    }

    /**
     * Proverava da li su notifikacije omogućene
     */
    areNotificationsEnabled() {
        return this.permission === 'granted' || 
               localStorage.getItem('notifications_enabled') === 'true';
    }

    /**
     * Prikazuje dijalog za omogućavanje notifikacija
     */
    showEnableDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'notification-dialog';
        dialog.innerHTML = `
            <div class="notification-dialog-content">
                <div class="notification-dialog-icon">🔔</div>
                <h3>Омогући нотификације</h3>
                <p>Желите ли да добијате обавештења када се калкулација заврши?</p>
                <div class="notification-dialog-buttons">
                    <button id="enableNotifications" class="btn-primary">Омогући</button>
                    <button id="dismissNotifications" class="btn-secondary">Не сада</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        document.getElementById('enableNotifications').addEventListener('click', async () => {
            await this.requestPermission();
            dialog.remove();
        });

        document.getElementById('dismissNotifications').addEventListener('click', () => {
            localStorage.setItem('notification_dialog_dismissed', 'true');
            dialog.remove();
        });
    }

    /**
     * Auto-prikaži dijalog ako notifikacije nisu omogućene
     */
    autoShowDialog() {
        const dismissed = localStorage.getItem('notification_dialog_dismissed');
        
        if (!this.areNotificationsEnabled() && !dismissed && this.isSupported()) {
            // Prikaži nakon 5 sekundi
            setTimeout(() => {
                this.showEnableDialog();
            }, 5000);
        }
    }
}

// Globalna instanca
const notificationManager = new NotificationManager();

// Auto-inicijalizacija
if (notificationManager.isSupported()) {
    notificationManager.permission = Notification.permission;
    
    // Auto-prikaži dijalog nakon učitavanja stranice
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            notificationManager.autoShowDialog();
        });
    } else {
        notificationManager.autoShowDialog();
    }
}

