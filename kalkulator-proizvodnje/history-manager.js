// ============================================
// SISTEM ZA UPRAVLJANJE ISTORIJOM KALKULACIJA
// LocalStorage + maksimalno 100 zapisa
// ============================================

class HistoryManager {
    constructor() {
        this.storageKey = 'production_calculator_history';
        this.maxRecords = 100;
    }

    /**
     * Dodaje novu kalkulaciju u istoriju
     */
    addCalculation(data) {
        const calculation = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            operation: data.operation,
            timePerPiece: data.timePerPiece,
            numberOfPieces: data.numberOfPieces,
            startTime: data.startTime,
            endTime: data.endTime,
            totalDuration: data.totalDuration,
            note: data.note || ''
        };

        const history = this.getHistory();
        history.unshift(calculation); // Dodaj na početak

        // Ograniči na maxRecords
        if (history.length > this.maxRecords) {
            history.length = this.maxRecords;
        }

        this.saveHistory(history);
        console.log('✓ Калкулација сачувана у историју');
        
        return calculation;
    }

    /**
     * Vraća kompletnu istoriju
     */
    getHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Грешка при читању историје:', error);
            return [];
        }
    }

    /**
     * Čuva istoriju u localStorage
     */
    saveHistory(history) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(history));
        } catch (error) {
            console.error('Грешка при чувању историје:', error);
            
            // Ako je disk pun, obriši najstarije zapise
            if (error.name === 'QuotaExceededError') {
                const reducedHistory = history.slice(0, 50);
                localStorage.setItem(this.storageKey, JSON.stringify(reducedHistory));
            }
        }
    }

    /**
     * Briše jednu kalkulaciju po ID-u
     */
    deleteCalculation(id) {
        const history = this.getHistory();
        const filtered = history.filter(calc => calc.id !== id);
        this.saveHistory(filtered);
        console.log('✓ Калкулација обрисана');
    }

    /**
     * Briše kompletnu istoriju
     */
    clearHistory() {
        localStorage.removeItem(this.storageKey);
        console.log('✓ Историја обрисана');
    }

    /**
     * Vraća istoriju filtiranu po operaciji
     */
    getHistoryByOperation(operation) {
        const history = this.getHistory();
        return history.filter(calc => calc.operation === operation);
    }

    /**
     * Vraća istoriju za određeni datum
     */
    getHistoryByDate(date) {
        const history = this.getHistory();
        const targetDate = new Date(date).toLocaleDateString('sr-RS');
        
        return history.filter(calc => {
            const calcDate = new Date(calc.timestamp).toLocaleDateString('sr-RS');
            return calcDate === targetDate;
        });
    }

    /**
     * Vraća statistiku
     */
    getStatistics() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            return {
                totalCalculations: 0,
                totalPieces: 0,
                totalTime: 0,
                byOperation: {}
            };
        }

        const stats = {
            totalCalculations: history.length,
            totalPieces: 0,
            totalTime: 0,
            byOperation: {}
        };

        history.forEach(calc => {
            stats.totalPieces += calc.numberOfPieces;
            stats.totalTime += calc.totalDuration;

            if (!stats.byOperation[calc.operation]) {
                stats.byOperation[calc.operation] = {
                    count: 0,
                    pieces: 0,
                    time: 0
                };
            }

            stats.byOperation[calc.operation].count++;
            stats.byOperation[calc.operation].pieces += calc.numberOfPieces;
            stats.byOperation[calc.operation].time += calc.totalDuration;
        });

        return stats;
    }

    /**
     * Export u JSON format
     */
    exportToJSON() {
        const history = this.getHistory();
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `proizvodnja-istorija-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('✓ Историја извезена у JSON');
    }

    /**
     * Export u CSV format
     */
    exportToCSV() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            alert('Нема података за извоз');
            return;
        }

        const headers = ['Датум', 'Време', 'Операција', 'Време/ком (сек)', 'Број комада', 'Почетак', 'Завршетак', 'Укупно трајање', 'Напомена'];
        const rows = history.map(calc => {
            const date = new Date(calc.timestamp);
            return [
                date.toLocaleDateString('sr-RS'),
                date.toLocaleTimeString('sr-RS'),
                calc.operation,
                calc.timePerPiece,
                calc.numberOfPieces,
                calc.startTime,
                calc.endTime,
                this.formatDuration(calc.totalDuration),
                calc.note || ''
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const BOM = '\uFEFF'; // UTF-8 BOM za pravilno prikazivanje ćirilice
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `proizvodnja-istorija-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('✓ Историја извезена у CSV');
    }

    /**
     * Formatira trajanje u čitljiv format
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}min ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}min ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }
}

// Globalna instanca
const historyManager = new HistoryManager();

