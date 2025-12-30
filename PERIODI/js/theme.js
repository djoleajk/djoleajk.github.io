// Upravljanje Temom

PeriodTracker.prototype.initTheme = function() {
    const savedTheme = localStorage.getItem('periodi_theme') || 'light';
    this.setTheme(savedTheme);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    });
};

PeriodTracker.prototype.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('periodi_theme', theme);

    // Update theme toggle button
    const toggleBtn = document.getElementById('theme-toggle');
    if (theme === 'dark') {
        toggleBtn.title = 'Prebaci na svetlu temu';
    } else {
        toggleBtn.title = 'Prebaci na tamnu temu';
    }
};

