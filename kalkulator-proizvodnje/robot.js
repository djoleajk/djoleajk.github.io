function formatTime(date) {
    return date.toLocaleTimeString('sr-RS', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

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

function createDateFromTime(timeString) {
    const now = atomicClock.getCurrentTime();
    const [hours, minutes] = timeString.split(':');
    const customDate = new Date(now);
    customDate.setHours(parseInt(hours, 10));
    customDate.setMinutes(parseInt(minutes, 10));
    customDate.setSeconds(0);
    customDate.setMilliseconds(0);
    
    return customDate;
}

function calculate() {
    const timePerPiece = parseInt(document.getElementById('timePerPiece').value);
    const numberOfPieces = parseInt(document.getElementById('numberOfPieces').value);
    const startTimeInput = document.getElementById('startTimeInput').value;

    if (!timePerPiece || timePerPiece <= 0) {
        alert('Молимо унесите валидно време по комаду!');
        return;
    }

    if (!numberOfPieces || numberOfPieces <= 0) {
        alert('Молимо унесите валидан број комада!');
        return;
    }

    let startTime;
    if (startTimeInput) {
        startTime = createDateFromTime(startTimeInput);
    } else {
        startTime = atomicClock.getCurrentTime();
    }

    const totalSeconds = timePerPiece * numberOfPieces;
    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);

    const startTimeStr = formatTime(startTime);
    const endTimeStr = formatTime(endTime);
    const durationStr = formatDuration(totalSeconds);

    document.getElementById('startTime').textContent = startTimeStr;
    document.getElementById('totalDuration').textContent = durationStr;
    document.getElementById('endTime').textContent = endTimeStr;
    document.getElementById('totalPieces').textContent = numberOfPieces + ' ком';

    document.getElementById('results').classList.remove('hidden');

    // Sačuvaj u istoriju
    if (typeof historyManager !== 'undefined') {
        historyManager.addCalculation({
            operation: 'Робот',
            timePerPiece: timePerPiece,
            numberOfPieces: numberOfPieces,
            startTime: startTimeStr,
            endTime: endTimeStr,
            totalDuration: totalSeconds
        });
    }

    // Zakazi notifikaciju za završetak
    if (typeof notificationManager !== 'undefined' && notificationManager.areNotificationsEnabled()) {
        const now = atomicClock.getCurrentTime();
        const delayMs = endTime.getTime() - now.getTime();
        
        if (delayMs > 0) {
            notificationManager.scheduleNotification(
                'calculation-complete',
                delayMs,
                '✅ Робот завршен!',
                {
                    body: `${numberOfPieces} комада успешно завршено`,
                    icon: '🤖',
                    tag: 'calculation-complete',
                    requireInteraction: true
                }
            );

            if (delayMs > 60000) {
                notificationManager.scheduleNotification(
                    'calculation-midpoint',
                    delayMs / 2,
                    '⏰ Половина времена',
                    {
                        body: `Робот: Још ${formatDuration(totalSeconds / 2)} до краја`,
                        icon: '⏰',
                        tag: 'calculation-midpoint'
                    }
                );
            }
        }
    }

}

document.getElementById('calculateBtn').addEventListener('click', calculate);

document.getElementById('timePerPiece').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('numberOfPieces').focus();
    }
});

document.getElementById('numberOfPieces').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('startTimeInput').focus();
    }
});

document.getElementById('startTimeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});