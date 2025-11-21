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
    const startTimeInput = document.getElementById('startTimeInput').value;
    const endTimeInput = document.getElementById('endTimeInput').value;

    if (!timePerPiece || timePerPiece <= 0) {
        alert('Молимо унесите валидно време по комаду!');
        return;
    }

    if (!startTimeInput) {
        alert('Молимо унесите време почетка рада!');
        return;
    }

    if (!endTimeInput) {
        alert('Молимо унесите време краја рада!');
        return;
    }

    const startTime = createDateFromTime(startTimeInput);
    const endTime = createDateFromTime(endTimeInput);

    // Ako je endTime pre startTime, dodaj dan
    if (endTime <= startTime) {
        endTime.setDate(endTime.getDate() + 1);
    }

    // Izračunaj razliku u sekundama
    const availableSeconds = Math.floor((endTime - startTime) / 1000);

    if (availableSeconds <= 0) {
        alert('Крај рада мора бити после почетка рада!');
        return;
    }

    // Izračunaj broj komada
    const numberOfPieces = Math.floor(availableSeconds / timePerPiece);

    if (numberOfPieces <= 0) {
        alert('Нема довољно времена за производњу ниједног комада!');
        return;
    }

    const startTimeStr = formatTime(startTime);
    const endTimeStr = formatTime(endTime);
    const availableTimeStr = formatDuration(availableSeconds);

    document.getElementById('startTime').textContent = startTimeStr;
    document.getElementById('endTime').textContent = endTimeStr;
    document.getElementById('availableTime').textContent = availableTimeStr;
    document.getElementById('numberOfPieces').textContent = numberOfPieces + ' ком';
    document.getElementById('timePerPieceDisplay').textContent = timePerPiece + ' сек';

    document.getElementById('results').classList.remove('hidden');

    // Sačuvaj u istoriju
    if (typeof historyManager !== 'undefined') {
        historyManager.addCalculation({
            operation: 'Колико Комада',
            timePerPiece: timePerPiece,
            numberOfPieces: numberOfPieces,
            startTime: startTimeStr,
            endTime: endTimeStr,
            totalDuration: availableSeconds
        });
    }
}

document.getElementById('calculateBtn').addEventListener('click', calculate);

document.getElementById('timePerPiece').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('startTimeInput').focus();
    }
});

document.getElementById('startTimeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('endTimeInput').focus();
    }
});

document.getElementById('endTimeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

