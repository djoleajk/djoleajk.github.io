// OMDb API Configuration
const OMDB_API_KEY = '3e097319';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Cache object to store movie data
const movieCache = {};

// Current survey data
let surveyData = {
    genres: [],
    period: '2020-2025',
    mood: ''
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Set default period
    document.getElementById('period-modern').checked = true;
    
    // Initialize theme
    loadTheme();
    
    // Set current year dynamically
    setCurrentYear();
    
    // Add event listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Add genre checkbox listeners
    const genreCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="genre-"]');
    genreCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateGenres);
    });
    
    console.log('FilmFinder aplikacija inicijalizovana!');
}

// Set current year in footer
function setCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        themeIcon.classList.remove('bi-sun-fill');
        themeIcon.classList.add('bi-moon-fill');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('themeIcon');
    
    // Dark mode je podrazumevani
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-moon-fill');
    } else {
        // Dark mode - set sun icon da se prebaci na light
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
    }
}

// Survey Navigation
function nextStep(step) {
    // Validate current step
    if (step === 2) {
        const checkedGenres = document.querySelectorAll('input[type="checkbox"][id^="genre-"]:checked');
        if (checkedGenres.length === 0) {
            alert('Molimo izaberite bar jedan žanr!');
            return;
        }
    }
    
    if (step === 3) {
        const selectedPeriod = document.querySelector('input[name="period"]:checked');
        if (!selectedPeriod) {
            alert('Molimo izaberite period!');
            return;
        }
        surveyData.period = selectedPeriod.value;
    }
    
    // Hide all steps
    document.querySelectorAll('.survey-step').forEach(s => s.classList.add('d-none'));
    
    // Show current step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    // Update progress bar
    const progress = (step / 3) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

function previousStep(step) {
    // Hide all steps
    document.querySelectorAll('.survey-step').forEach(s => s.classList.add('d-none'));
    
    // Show previous step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    // Update progress bar
    const progress = (step / 3) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Update genres array
function updateGenres() {
    const checkedGenres = document.querySelectorAll('input[type="checkbox"][id^="genre-"]:checked');
    surveyData.genres = Array.from(checkedGenres).map(cb => cb.value);
}

// Main Function: Find Movie
async function findMovie() {
    // Get mood from desktop cards or mobile dropdown
    let mood = '';
    
    // Check if on mobile (dropdown)
    const moodSelectMobile = document.getElementById('moodSelectMobile');
    if (window.innerWidth < 768) {
        if (!moodSelectMobile.value) {
            alert('Molimo izaberite raspoloženje!');
            return;
        }
        mood = moodSelectMobile.value;
    } else {
        // Desktop - check radio buttons
        const selectedMood = document.querySelector('input[name="mood"]:checked');
        if (!selectedMood) {
            alert('Molimo izaberite raspoloženje!');
            return;
        }
        mood = selectedMood.value;
    }
    
    surveyData.mood = mood;
    
    // Validate all inputs
    if (surveyData.genres.length === 0) {
        alert('Molimo izaberite bar jedan žanr!');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        // Generate search query based on survey data
        const searchQuery = generateSearchQuery(surveyData);
        
        // Search for movies
        const searchResults = await searchMovies(searchQuery);
        
        if (!searchResults || searchResults.length === 0) {
            throw new Error('Nažalost, nismo pronašli film koji odgovara tvojim kriterijumima. Pokušaj ponovo sa drugim opcijama!');
        }
        
        // Get first movie details
        const movie = await getMovieDetails(searchResults[0].imdbID);
        
        // Display movie
        displayMovie(movie);
        
    } catch (error) {
        showError(error.message);
        console.error('Greška:', error);
    }
}

// Generate search query based on survey data
function generateSearchQuery(data) {
    const queries = {
        action: ['terminator', 'john wick', 'mad max', 'avengers', 'matrix', 'die hard'],
        comedy: ['hangover', 'superbad', 'bridesmaids', 'tropic thunder', 'step brothers'],
        drama: ['shawshank', 'forrest gump', 'goodfellas', 'departed', 'fight club'],
        horror: ['conjuring', 'insidious', 'sinister', 'it', 'hereditary', 'midsommar'],
        'sci-fi': ['interstellar', 'inception', 'blade runner', 'arrival', 'dune', 'tenet'],
        thriller: ['gone girl', 'prisoners', 'zodiac', 'knives out', 'nightcrawler']
    };
    
    // Pick a random genre from selected genres
    const randomGenre = data.genres[Math.floor(Math.random() * data.genres.length)];
    const genreQueries = queries[randomGenre] || queries['action'];
    
    // Pick a random movie from that genre
    const query = genreQueries[Math.floor(Math.random() * genreQueries.length)];
    
    return query;
}

// Search movies using OMDb API
async function searchMovies(query) {
    try {
        // Check cache first
        const cacheKey = `search_${query}`;
        if (movieCache[cacheKey]) {
            console.log('Korišćenje cache-a za pretragu:', query);
            return movieCache[cacheKey];
        }
        
        // Sanitize and encode query
        const sanitizedQuery = sanitizeInput(query);
        const url = `${OMDB_BASE_URL}?s=${encodeURIComponent(sanitizedQuery)}&type=movie&apikey=${OMDB_API_KEY}`;
        
        console.log('Pretraga filmova:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Greška pri komunikaciji sa OMDb API');
        }
        
        const data = await response.json();
        
        if (data.Response === 'False') {
            throw new Error(data.Error || 'Film nije pronađen');
        }
        
        // Cache results
        movieCache[cacheKey] = data.Search;
        
        return data.Search;
        
    } catch (error) {
        throw new Error(`Greška pri pretraživanju filmova: ${error.message}`);
    }
}

// Get movie details by IMDb ID
async function getMovieDetails(imdbID) {
    try {
        // Check cache first
        const cacheKey = `details_${imdbID}`;
        if (movieCache[cacheKey]) {
            console.log('Korišćenje cache-a za detalje:', imdbID);
            return movieCache[cacheKey];
        }
        
        const url = `${OMDB_BASE_URL}?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`;
        
        console.log('Dohvatanje detalja filma:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Greška pri komunikaciji sa OMDb API');
        }
        
        const data = await response.json();
        
        if (data.Response === 'False') {
            throw new Error(data.Error || 'Detalji filma nisu dostupni');
        }
        
        // Cache results
        movieCache[cacheKey] = data;
        
        return data;
        
    } catch (error) {
        throw new Error(`Greška pri dohvatanju detalja filma: ${error.message}`);
    }
}

// Display movie information
function displayMovie(movie) {
    // Hide loading and survey
    hideLoading();
    document.getElementById('surveySection').classList.add('d-none');
    document.getElementById('heroSection').classList.add('d-none');
    
    // Show movie section
    const movieSection = document.getElementById('movieSection');
    movieSection.classList.remove('d-none');
    
    // Set poster with fallback
    const posterImg = document.getElementById('moviePoster');
    if (movie.Poster && movie.Poster !== 'N/A') {
        posterImg.src = movie.Poster;
        posterImg.alt = movie.Title;
    } else {
        // Fallback poster
        posterImg.src = `https://via.placeholder.com/300x450/667eea/ffffff?text=${encodeURIComponent(movie.Title)}`;
        posterImg.alt = 'Movie Poster Not Available';
    }
    
    // Set movie information
    document.getElementById('movieTitle').textContent = movie.Title;
    document.getElementById('movieYear').textContent = movie.Year;
    document.getElementById('movieGenre').textContent = movie.Genre !== 'N/A' ? movie.Genre : 'Nepoznat žanr';
    document.getElementById('movieRuntime').textContent = movie.Runtime !== 'N/A' ? movie.Runtime : 'Nepoznato trajanje';
    document.getElementById('movieRating').textContent = movie.imdbRating !== 'N/A' ? `${movie.imdbRating}/10` : 'Nema ocene';
    document.getElementById('moviePlot').textContent = movie.Plot !== 'N/A' ? movie.Plot : 'Opis nije dostupan.';
    document.getElementById('movieActors').textContent = movie.Actors !== 'N/A' ? movie.Actors : 'Nepoznati glumci';
    document.getElementById('movieDirector').textContent = movie.Director !== 'N/A' ? movie.Director : 'Nepoznat režiser';
    
    // Generate watch links
    const watchLinks = generateWatchLinks(movie.Title);
    displayWatchLinks(watchLinks);
    
    // Set trailer button
    const trailerBtn = document.getElementById('trailerBtn');
    trailerBtn.onclick = () => {
        const youtubeQuery = `${movie.Title} ${movie.Year} trailer`;
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`;
        window.open(youtubeUrl, '_blank');
    };
    
    // Scroll to movie section
    movieSection.scrollIntoView({ behavior: 'smooth' });
}

// Generate watch links for streaming sites
function generateWatchLinks(movieTitle) {
    // Sanitize movie title
    const sanitizedTitle = sanitizeInput(movieTitle);
    
    return {
        filmotip: {
            name: 'FilmoTip',
            url: `https://filmotip.com/search2.php?keywords=${sanitizedTitle.replace(/ /g, '%2B')}&btn=Search`,
            icon: 'bi-film',
            color: 'primary'
        },
        onlinesaprevodom: {
            name: 'Online sa Prevodom',
            url: `https://onlinesaprevodom.net/?s=${sanitizedTitle.replace(/ /g, '+')}`,
            icon: 'bi-play-circle',
            color: 'success'
        },
        filmovitex: {
            name: 'FilmoviTex',
            url: `https://filmovitex.net/?s=${sanitizedTitle.replace(/ /g, '+')}&action=jws_ajax_search&post_type=movies`,
            icon: 'bi-camera-reels',
            color: 'warning'
        },
        filmoviplex: {
            name: 'FilmoviPlex',
            url: `https://www.filmoviplex.com/?all=all&s=${sanitizedTitle.replace(/ /g, '+')}&orderby=all`,
            icon: 'bi-collection-play',
            color: 'danger'
        }
    };
}

// Display watch links
function displayWatchLinks(links) {
    const watchLinksContainer = document.getElementById('watchLinks');
    watchLinksContainer.innerHTML = '';
    
    for (const [key, link] of Object.entries(links)) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        
        const button = document.createElement('a');
        button.href = link.url;
        button.target = '_blank';
        button.className = `btn btn-${link.color} w-100 watch-link-btn`;
        button.innerHTML = `<i class="${link.icon}"></i> ${link.name}`;
        
        col.appendChild(button);
        watchLinksContainer.appendChild(col);
    }
}

// Show loading state
function showLoading() {
    document.getElementById('surveySection').classList.add('d-none');
    document.getElementById('errorSection').classList.add('d-none');
    document.getElementById('movieSection').classList.add('d-none');
    document.getElementById('loadingSection').classList.remove('d-none');
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingSection').classList.add('d-none');
}

// Show error message
function showError(message) {
    hideLoading();
    document.getElementById('surveySection').classList.add('d-none');
    document.getElementById('movieSection').classList.add('d-none');
    
    const errorSection = document.getElementById('errorSection');
    document.getElementById('errorMessage').textContent = message;
    errorSection.classList.remove('d-none');
    
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset application
function resetApp() {
    // Reset survey data
    surveyData = {
        genres: [],
        period: '2020-2025',
        mood: ''
    };
    
    // Reset form inputs
    document.querySelectorAll('input[type="checkbox"][id^="genre-"]').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('period-modern').checked = true;
    document.getElementById('moodSelectMobile').value = '';
    document.querySelectorAll('input[name="mood"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Hide all sections except survey
    document.getElementById('loadingSection').classList.add('d-none');
    document.getElementById('errorSection').classList.add('d-none');
    document.getElementById('movieSection').classList.add('d-none');
    
    // Show survey section and hero
    document.getElementById('heroSection').classList.remove('d-none');
    document.getElementById('surveySection').classList.remove('d-none');
    
    // Reset to step 1
    document.querySelectorAll('.survey-step').forEach(s => s.classList.add('d-none'));
    document.getElementById('step1').classList.remove('d-none');
    document.getElementById('progressBar').style.width = '0%';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Input sanitization and validation
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    
    // Remove potentially harmful characters
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/[^\w\s\-:.']/g, '') // Keep only alphanumeric, spaces, hyphens, colons, periods, apostrophes
        .substring(0, 100); // Limit length
}

// Console welcome message
console.log('%cFilmFinder 🎬', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cPronađi savršen film za sebe!', 'color: #764ba2; font-size: 14px;');
console.log('%cPowered by OMDb API', 'color: #6c757d; font-size: 12px;');

