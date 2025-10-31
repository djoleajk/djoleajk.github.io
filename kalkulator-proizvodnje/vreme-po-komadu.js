function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Gramatika za sate
    let hourText = '';
    if (hours === 1) {
        hourText = 'сат';
    } else if (hours >= 2 && hours <= 4) {
        hourText = 'сата';
    } else if (hours >= 5) {
        hourText = 'сати';
    }

    if (hours > 0) {
        return `${hours} ${hourText} ${minutes}мин ${secs}сек`;
    } else if (minutes > 0) {
        return `${minutes}мин ${secs}сек`;
    } else {
        return `${secs}сек`;
    }
}

function formatTimePerPiece(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round((seconds % 60) * 100) / 100; // Zaokruzivanje na 2 decimale za sekunde

    if (hours > 0) {
        return `${hours}${hourText(hours)} ${minutes}мин ${secs.toFixed(2)}сек`;
    } else if (minutes > 0) {
        return `${minutes}мин ${secs.toFixed(2)}сек`;
    } else {
        return `${secs.toFixed(2)}сек`;
    }
}

function hourText(hours) {
    if (hours === 1) return ' сат';
    if (hours >= 2 && hours <= 4) return ' сата';
    return ' сати';
}

function calculate() {
    const numberOfPieces = parseInt(document.getElementById('numberOfPieces').value);
    const totalHours = parseInt(document.getElementById('totalHours').value) || 0;
    const totalMinutes = parseInt(document.getElementById('totalMinutes').value) || 0;
    const totalSeconds = parseInt(document.getElementById('totalSeconds').value) || 0;

    // Validacija unosa
    if (!numberOfPieces || numberOfPieces <= 0) {
        alert('Молимо унесите валидан број комада!');
        return;
    }

    if (totalHours === 0 && totalMinutes === 0 && totalSeconds === 0) {
        alert('Молимо унесите валидно време (најмање минуте или секунде)!');
        return;
    }

    // Pretvori sve u sekunde
    const totalTimeInSeconds = (totalHours * 3600) + (totalMinutes * 60) + totalSeconds;

    // Izračunaj vreme po komadu
    const timePerPieceInSeconds = totalTimeInSeconds / numberOfPieces;

    // Prikaz rezultata
    document.getElementById('timePerPiece').textContent = formatTimePerPiece(timePerPieceInSeconds);
    document.getElementById('totalPieces').textContent = numberOfPieces + ' ком';
    document.getElementById('totalDuration').textContent = formatDuration(totalTimeInSeconds);

    document.getElementById('results').classList.remove('hidden');

    // Sačuvaj u istoriju
    if (typeof historyManager !== 'undefined') {
        const totalDurationStr = formatDuration(totalTimeInSeconds);
        historyManager.addCalculation({
            operation: 'Време по Комаду',
            numberOfPieces: numberOfPieces,
            totalDuration: totalDurationStr,
            timePerPiece: Math.round(timePerPieceInSeconds * 100) / 100
        });
    }
}

document.getElementById('calculateBtn').addEventListener('click', calculate);

// Enter key support
document.getElementById('numberOfPieces').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('totalHours').focus();
    }
});

document.getElementById('totalHours').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('totalMinutes').focus();
    }
});

document.getElementById('totalMinutes').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('totalSeconds').focus();
    }
});

document.getElementById('totalSeconds').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

