// OMDb API Configuration
const OMDB_API_KEY = '6b9a2d7a';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Cache object to store movie data
const movieCache = {};

// Current survey data
let surveyData = {
    genres: [],
    period: '2020-2025',
    mood: ''
};

// Store current search results
let currentSearchResults = [];
let currentResultIndex = 0;
let usedQueries = []; // Track used queries to avoid duplicates
let lastSuccessfulMovie = null; // Track last successful movie for fallback

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
    
    console.log('FilmFinder aplikacija sa Smart AI inicijalizovana!');
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
    
    if (step === 2) {
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
    
    // Update progress bar (2 steps total)
    const progress = (step / 2) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

function previousStep(step) {
    // Hide all steps
    document.querySelectorAll('.survey-step').forEach(s => s.classList.add('d-none'));
    
    // Show previous step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    // Update progress bar (2 steps total)
    const progress = (step / 2) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Update genres array
function updateGenres() {
    const checkedGenres = document.querySelectorAll('input[type="checkbox"][id^="genre-"]:checked');
    surveyData.genres = Array.from(checkedGenres).map(cb => cb.value);
}

// Main Function: Find Movie
async function findMovie() {
    // Validate all inputs
    if (surveyData.genres.length === 0) {
        alert('Molimo izaberite bar jedan žanr!');
        return;
    }
    
    // Validate period selection
    const selectedPeriod = document.querySelector('input[name="period"]:checked');
    if (!selectedPeriod) {
        alert('Molimo izaberite period!');
        return;
    }
    surveyData.period = selectedPeriod.value;
    
    // Set mood to neutral (not used)
    surveyData.mood = 'neutral';
    
    // Show loading
    showLoading();
    
    try {
        console.log('🤖 Smart AI analizira tvoje preferencije...');
        console.log(`📋 Žanrovi: ${surveyData.genres.join(', ')}`);
        console.log(`📅 Period: ${surveyData.period}`);
        
        // Generate AI explanation based on selected preferences
        const aiExplanation = generateAIExplanation(surveyData);
        
        let movie = null;
        let attempts = 0;
        const maxAttempts = 20; // Increased for better results
        
        // Try multiple queries until we find a movie that matches genre and period
        while (!movie && attempts < maxAttempts) {
            attempts++;
            console.log(`🔍 Pokušaj ${attempts}/${maxAttempts}`);
            
            // Generate search query based on survey data
            const searchQuery = generateSearchQuery(surveyData);
            console.log(`   📝 Upit: "${searchQuery}"`);
            
            // Search for movies
            const searchResults = await searchMovies(searchQuery);
            
            if (searchResults && searchResults.length > 0) {
                console.log(`   ✓ Pronađeno ${searchResults.length} filmova u pretrazi`);
                
                // Try each result until we find one that matches genres
                let checkedCount = 0;
                for (const result of searchResults) {
                    checkedCount++;
                    console.log(`   🔍 Proveravam film ${checkedCount}/${searchResults.length}: "${result.Title}"`);
                    
                    const movieDetails = await getMovieDetails(result.imdbID);
                    
                    // Check if movie matches selected genres
                    if (movieMatchesGenres(movieDetails, surveyData.genres)) {
                        movie = movieDetails;
                        movie.aiExplanation = aiExplanation; // Add AI explanation
                        currentSearchResults = searchResults;
                        currentResultIndex = 0;
                        console.log(`   🎬 PRONAĐEN: "${movie.Title}" (${movie.Year}) - Ocena: ${movie.imdbRating}`);
                        break;
                    }
                }
                if (!movie) {
                    console.log(`   ✗ Nijedan od ${searchResults.length} filmova nije prošao sve filtere`);
                }
            } else {
                console.log(`   ✗ Pretraga nije vratila rezultate (null ili prazan niz)`);
            }
        }
        
        if (!movie) {
            // Provide helpful error message with suggestions
            const selectedGenres = surveyData.genres.join(', ');
            const errorMsg = `Nažalost, nismo pronašli film za kombinaciju:\n\n` +
                           `Žanr: ${selectedGenres}\n` +
                           `Period: ${surveyData.period}\n\n` +
                           `Pokušaj:\n` +
                           `• Izaberi više žanrova\n` +
                           `• Izaberi drugi period (ima više filmova u 2010-2019)\n` +
                           `• Pokušaj ponovo - pretraga koristi različite upite`;
            throw new Error(errorMsg);
        }
        
        // Store successful movie
        lastSuccessfulMovie = movie;
        
        // Display movie
        displayMovie(movie, false); // false = hide AI explanation
        
    } catch (error) {
        showError(error.message);
        console.error('Greška:', error);
    }
}

// Generate search query based on survey data
function generateSearchQuery(data) {
    const queries = {
        action: ['terminator', 'john wick', 'mad max', 'avengers', 'matrix', 'die hard', 'gladiator', 'dark knight', 'lethal weapon', 'mission impossible', 'rambo', 'predator', 'expendables', 'fast furious', 'equalizer', 'taken', 'bourne', 'deadpool', 'kingsman', 'atomic blonde'],
        comedy: ['hangover', 'superbad', 'bridesmaids', 'tropic thunder', 'step brothers', 'ace ventura', 'dumb and dumber', 'anchorman', '21 jump street', 'neighbors', 'wedding crashers', 'dodgeball', 'zoolander', 'borat', 'austin powers', 'rush hour', 'scary movie', 'game night', 'tag', 'blockers'],
        drama: ['shawshank', 'forrest gump', 'goodfellas', 'departed', 'fight club', 'green mile', 'beautiful mind', 'schindler', 'godfather', 'casino', 'american beauty', 'prestige', 'social network', 'whiplash', 'spotlight', 'manchester', 'moonlight', 'birdman', 'wolf wall street', 'pianist'],
        horror: ['conjuring', 'insidious', 'sinister', 'it', 'hereditary', 'midsommar', 'exorcist', 'ring', 'nightmare', 'scream', 'saw', 'halloween', 'friday 13th', 'babadook', 'witch', 'get out', 'quiet place', 'us', 'cabin woods', 'evil dead'],
        'sci-fi': ['interstellar', 'inception', 'blade runner', 'arrival', 'dune', 'tenet', 'alien', 'prometheus', 'ex machina', 'gravity', 'martian', 'edge tomorrow', 'district 9', 'elysium', 'looper', 'oblivion', 'annihilation', 'passengers', 'moon', 'her'],
        thriller: ['gone girl', 'prisoners', 'zodiac', 'knives out', 'nightcrawler', 'shutter island', 'seven', 'memento', 'usual suspects', 'silence lambs', 'dark knight', 'no country', 'sicario', 'wind river', 'nocturnal animals', 'girl train', 'girl dragon tattoo', 'mystic river', 'witness prosecution', 'uncut gems']
    };
    
    // Pick a random genre from selected genres in the survey
    const randomGenre = data.genres[Math.floor(Math.random() * data.genres.length)];
    const genreQueries = queries[randomGenre] || queries['action'];
    
    console.log(`Odabran žanr iz ankete: ${randomGenre}`);
    
    // Filter out already used queries
    const availableQueries = genreQueries.filter(q => !usedQueries.includes(q));
    
    // If all queries used, reset the used queries list
    if (availableQueries.length === 0) {
        usedQueries = [];
        console.log('Resetovan spisak korišćenih upita - svi filmovi iz žanra su prikazani');
    }
    
    // Pick a random movie from available queries
    const queryList = availableQueries.length > 0 ? availableQueries : genreQueries;
    const query = queryList[Math.floor(Math.random() * queryList.length)];
    
    // Add to used queries
    usedQueries.push(query);
    
    console.log(`Pretraga za film: "${query}"`);
    
    return query;
}

// Check if movie matches user's mood
function movieMatchesMood(movie, mood, movieGenres) {
    // Mood-to-genre compatibility mapping
    const moodCompatibility = {
        'happy': {
            allowed: ['comedy', 'adventure', 'family', 'animation', 'musical', 'romance'],
            forbidden: ['horror', 'war', 'crime'],
            description: 'vesele i zabavne filmove'
        },
        'sad': {
            allowed: ['drama', 'romance', 'biography', 'history'],
            forbidden: ['comedy', 'action'],
            description: 'emotivne i dirljive filmove'
        },
        'excited': {
            allowed: ['action', 'adventure', 'thriller', 'sci-fi'],
            forbidden: ['drama', 'documentary'],
            description: 'uzbudljive i adrenalinske filmove'
        },
        'scared': {
            allowed: ['horror', 'thriller', 'mystery'],
            forbidden: ['comedy', 'romance', 'family'],
            description: 'jezive i napete filmove'
        },
        'thoughtful': {
            allowed: ['drama', 'sci-fi', 'mystery', 'thriller', 'biography', 'history'],
            forbidden: ['comedy', 'action'],
            description: 'zamišljene i duboke filmove'
        },
        'relaxed': {
            allowed: [], // Sve je OK
            forbidden: ['horror'],
            description: 'opuštene filmove'
        }
    };
    
    const moodRules = moodCompatibility[mood];
    if (!moodRules) {
        return true; // Unknown mood, allow everything
    }
    
    // Check for forbidden genres
    for (const forbiddenGenre of moodRules.forbidden) {
        if (movieGenres.some(g => g.includes(forbiddenGenre))) {
            console.log(`   ✗ Raspoloženje "${mood}" ne odgovara žanru "${forbiddenGenre}" u filmu`);
            console.log(`   ℹ️ Za "${mood}" raspoloženje preporučujemo: ${moodRules.description}`);
            return false;
        }
    }
    
    // If there are allowed genres specified, check if movie has at least one
    if (moodRules.allowed.length > 0) {
        const hasAllowedGenre = movieGenres.some(movieGenre => 
            moodRules.allowed.some(allowedGenre => movieGenre.includes(allowedGenre))
        );
        
        if (!hasAllowedGenre) {
            console.log(`   ✗ Film ne sadrži žanr koji odgovara raspoloženju "${mood}"`);
            console.log(`   ℹ️ Za "${mood}" raspoloženje preporučujemo: ${moodRules.description}`);
            return false;
        }
    }
    
    console.log(`   ✓ Film odgovara raspoloženju "${mood}"`);
    return true;
}

// Filter movies by period
function filterByPeriod(movies, period) {
    if (!movies || movies.length === 0) {
        return [];
    }
    
    // Parse period range (e.g., "2020-2025")
    const [startYear, endYear] = period.split('-').map(y => parseInt(y));
    
    console.log(`Filtriranje filmova za period: ${startYear}-${endYear}`);
    
    return movies.filter(movie => {
        // Parse movie year (can be "2020" or "2020-2021" for series)
        const yearMatch = movie.Year.match(/\d{4}/);
        if (!yearMatch) {
            return false;
        }
        
        const movieYear = parseInt(yearMatch[0]);
        const isInPeriod = movieYear >= startYear && movieYear <= endYear;
        
        if (isInPeriod) {
            console.log(`✓ Film "${movie.Title}" (${movieYear}) je u periodu`);
        }
        
        return isInPeriod;
    });
}

// Check if movie matches selected genres
function movieMatchesGenres(movie, selectedGenres) {
    if (!movie.Genre || movie.Genre === 'N/A') {
        console.log(`✗ Film "${movie.Title}" nema informacije o žanru`);
        return false;
    }
    
    // Exclude movies without poster
    if (!movie.Poster || movie.Poster === 'N/A') {
        console.log(`✗ Film "${movie.Title}" nema poster - preskačemo`);
        return false;
    }
    
    // Exclude movies without rating
    if (!movie.imdbRating || movie.imdbRating === 'N/A') {
        console.log(`✗ Film "${movie.Title}" nema ocenu - preskačemo`);
        return false;
    }
    
    // Exclude movies with rating below 5.0 (relaxed from 5.5)
    const rating = parseFloat(movie.imdbRating);
    if (isNaN(rating) || rating < 5.0) {
        console.log(`✗ Film "${movie.Title}" ima nisku ocenu (${movie.imdbRating}) - preskačemo`);
        return false;
    }
    
    // Get movie genres as lowercase array
    const movieGenres = movie.Genre.toLowerCase().split(',').map(g => g.trim());
    
    // Exclude pure animations (not mixed genres)
    const hasAnimation = movieGenres.some(g => g === 'animation' || g === 'animated');
    const hasOtherGenres = movieGenres.length > 1;
    
    if (hasAnimation && !hasOtherGenres) {
        console.log(`✗ Film "${movie.Title}" je čista animacija - preskačemo`);
        return false;
    }
    
    // Exclude films under 60 minutes (relaxed from 70)
    if (movie.Runtime && movie.Runtime !== 'N/A') {
        const runtimeMatch = movie.Runtime.match(/(\d+)/);
        if (runtimeMatch) {
            const runtime = parseInt(runtimeMatch[1]);
            if (runtime < 60) {
                console.log(`✗ Film "${movie.Title}" je prekratak (${runtime} min) - preskačemo`);
                return false;
            }
        }
    }
    
    // Genre mapping for matching
    const genreMap = {
        'action': ['action'],
        'comedy': ['comedy'],
        'drama': ['drama'],
        'horror': ['horror'],
        'sci-fi': ['sci-fi', 'science fiction', 'fantasy'],
        'thriller': ['thriller', 'mystery', 'crime']
    };
    
    // Check if movie contains selected genres
    // If multiple genres selected - film must contain ALL
    // If single genre selected - film must contain at least that one
    
    let matchedGenres = 0;
    const requiredGenres = selectedGenres.length;
    
    for (const selectedGenre of selectedGenres) {
        const matchTerms = genreMap[selectedGenre] || [selectedGenre];
        let genreFound = false;
        
        for (const movieGenre of movieGenres) {
            for (const matchTerm of matchTerms) {
                if (movieGenre.includes(matchTerm) || matchTerm.includes(movieGenre)) {
                    console.log(`   ✓ Žanr "${selectedGenre}" pronađen kao "${movieGenre}"`);
                    genreFound = true;
                    break;
                }
            }
            if (genreFound) break;
        }
        
        if (genreFound) {
            matchedGenres++;
        } else {
            console.log(`   ✗ Žanr "${selectedGenre}" NIJE pronađen u filmu`);
        }
    }
    
    // If single genre - must have at least one match
    // If multiple genres - should have majority of them (at least 50%)
    const threshold = requiredGenres === 1 ? 1 : Math.ceil(requiredGenres * 0.6);
    
    if (matchedGenres >= threshold) {
        console.log(`✓ Film "${movie.Title}" ima dovoljno žanrova (${matchedGenres}/${requiredGenres}, potrebno: ${threshold})`);
        return true;
    } else {
        console.log(`✗ Film "${movie.Title}" (${movie.Genre}) nema dovoljno žanrova. Ima: ${matchedGenres}/${requiredGenres}, potrebno: ${threshold}`);
        return false;
    }
}

// Search movies using OMDb API
async function searchMovies(query) {
    try {
        // Check cache first
        const cacheKey = `search_${query}_${surveyData.period}`;
        if (movieCache[cacheKey]) {
            console.log('Korišćenje cache-a za pretragu:', query);
            return movieCache[cacheKey];
        }
        
        // Sanitize and encode query
        const sanitizedQuery = sanitizeInput(query);
        
        // Parse period to get a random year for narrowing search
        const [startYear, endYear] = surveyData.period.split('-').map(y => parseInt(y));
        const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        
        // Try search with year parameter to narrow results
        let url = `${OMDB_BASE_URL}?s=${encodeURIComponent(sanitizedQuery)}&type=movie&y=${randomYear}&apikey=${OMDB_API_KEY}`;
        
        console.log(`Pretraga filmova: "${sanitizedQuery}" (godina: ${randomYear})`);
        
        let response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Greška pri komunikaciji sa OMDb API');
        }
        
        let data = await response.json();
        
        // If "Too many results" or not found with specific year, try without year
        if (data.Response === 'False' && (data.Error === 'Too many results.' || data.Error === 'Movie not found!')) {
            console.log(`Pokušavam pretragu bez godine za: "${sanitizedQuery}"`);
            url = `${OMDB_BASE_URL}?s=${encodeURIComponent(sanitizedQuery)}&type=movie&apikey=${OMDB_API_KEY}`;
            
            response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Greška pri komunikaciji sa OMDb API');
            }
            
            data = await response.json();
            
            // If still "Too many results", return null to try another query
            if (data.Response === 'False') {
                if (data.Error === 'Too many results.') {
                    console.log('Previše rezultata, pokušavam sa drugim upitom...');
                    return null;
                }
                console.log(`Film nije pronađen: ${data.Error}`);
                return null;
            }
        }
        
        if (data.Response === 'False') {
            console.log(`Pretraga nije uspela: ${data.Error}`);
            return null;
        }
        
        // Filter results by selected period
        const filteredResults = filterByPeriod(data.Search, surveyData.period);
        
        if (!filteredResults || filteredResults.length === 0) {
            console.log(`Nema rezultata za period ${surveyData.period}, pokušavam sa drugim upitom...`);
            return null;
        }
        
        // Cache results
        movieCache[cacheKey] = filteredResults;
        
        return filteredResults;
        
    } catch (error) {
        console.error('Greška pri pretraživanju:', error);
        return null; // Return null instead of throwing to allow retry with different query
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
function displayMovie(movie, isAIMode = false) {
    // Hide loading and survey
    hideLoading();
    document.getElementById('surveySection').classList.add('d-none');
    document.getElementById('heroSection').classList.add('d-none');
    
    // Show movie section
    const movieSection = document.getElementById('movieSection');
    movieSection.classList.remove('d-none');
    
    // Show AI explanation if available
    const aiExplanationDiv = document.getElementById('aiExplanation');
    if (isAIMode && movie.aiExplanation) {
        aiExplanationDiv.innerHTML = `
            <div class="alert alert-info">
                <h5><i class="bi bi-robot"></i> AI Preporuka:</h5>
                <p style="white-space: pre-line;">${movie.aiExplanation}</p>
            </div>
        `;
        aiExplanationDiv.classList.remove('d-none');
    } else {
        aiExplanationDiv.classList.add('d-none');
    }
    
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
    
    // Set movie information with IMDb link
    const titleElement = document.getElementById('movieTitle');
    if (movie.imdbID && movie.imdbID !== 'N/A') {
        titleElement.innerHTML = `${movie.Title} <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="badge bg-warning text-dark ms-2"><i class="bi bi-box-arrow-up-right"></i> IMDb</a>`;
    } else {
        titleElement.textContent = movie.Title;
    }
    
    document.getElementById('movieYear').textContent = movie.Year;
    document.getElementById('movieGenre').textContent = movie.Genre !== 'N/A' ? movie.Genre : 'Nepoznat žanr';
    document.getElementById('movieRuntime').textContent = movie.Runtime !== 'N/A' ? movie.Runtime : 'Nepoznato trajanje';
    
    // IMDb Rating with link
    const ratingElement = document.getElementById('movieRating');
    if (movie.imdbRating !== 'N/A' && movie.imdbID && movie.imdbID !== 'N/A') {
        ratingElement.innerHTML = `<a href="https://www.imdb.com/title/${movie.imdbID}/ratings" target="_blank" style="text-decoration: none; color: inherit;">${movie.imdbRating}/10 <i class="bi bi-box-arrow-up-right" style="font-size: 0.8em;"></i></a>`;
    } else {
        ratingElement.textContent = 'Nema ocene';
    }
    
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
    
    // Set IMDb button
    const imdbBtn = document.getElementById('imdbBtn');
    if (movie.imdbID && movie.imdbID !== 'N/A') {
        imdbBtn.style.display = 'block';
        imdbBtn.onclick = () => {
            window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank');
        };
    } else {
        imdbBtn.style.display = 'none';
    }
    
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

// Show notification message (non-blocking alert)
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 16px;
            max-width: 90%;
            text-align: center;
            animation: slideDown 0.5s ease-out;
        `;
        document.body.appendChild(notification);
        
        // Add animation keyframes
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Set message and show notification
    notification.innerHTML = `<i class="bi bi-info-circle"></i> ${message}`;
    notification.style.display = 'block';
    notification.style.animation = 'slideDown 0.5s ease-out';
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-out';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 4000);
}

// Get next movie suggestion
async function getNextSuggestion() {
    // Show loading
    showLoading();
    
    try {
        console.log('🤖 Smart AI traži novi film prema tvojim preferencijama...');
        
        // Generate AI explanation
        const aiExplanation = generateAIExplanation(surveyData);
        
        let movie = null;
        let attempts = 0;
        const maxAttempts = 20; // Increased for better results
        
        // Try multiple queries until we find a movie that matches genre and period
        while (!movie && attempts < maxAttempts) {
            attempts++;
            console.log(`Pokušaj ${attempts}/${maxAttempts}`);
            
            // Always generate NEW search query based on survey data
            const searchQuery = generateSearchQuery(surveyData);
            
            // Search for new movies
            const searchResults = await searchMovies(searchQuery);
            
            if (searchResults && searchResults.length > 0) {
                // Try each result until we find one that matches genres
                for (const result of searchResults) {
                    const movieDetails = await getMovieDetails(result.imdbID);
                    
                    // Check if movie matches selected genres
                    if (movieMatchesGenres(movieDetails, surveyData.genres)) {
                        movie = movieDetails;
                        movie.aiExplanation = aiExplanation; // Add AI explanation
                        currentSearchResults = searchResults;
                        currentResultIndex = 0;
                        break;
                    }
                }
            }
        }
        
        if (!movie) {
            // If no new movie found, show message and return to last successful movie
            hideLoading();
            
            if (lastSuccessfulMovie) {
                // Show notification
                showNotification('Nema više preporuka koje odgovaraju tvojim kriterijumima. Prikazujemo poslednji preporučeni film.');
                
                // Display last successful movie
                displayMovie(lastSuccessfulMovie, false);
            } else {
                // If no previous movie, show error
                throw new Error('Nažalost, nismo pronašli dodatne filmove za izabrane kriterijume.');
            }
            return;
        }
        
        // Store successful movie
        lastSuccessfulMovie = movie;
        
        // Display movie
        displayMovie(movie, false);
        
    } catch (error) {
        showError(error.message);
        console.error('Greška:', error);
    }
}

// Reset application
function resetApp() {
    // Reset survey data
    surveyData = {
        genres: [],
        period: '2020-2025',
        mood: 'neutral'
    };
    
    // Reset search results
    currentSearchResults = [];
    currentResultIndex = 0;
    usedQueries = [];
    lastSuccessfulMovie = null;
    
    // Reset form inputs
    document.querySelectorAll('input[type="checkbox"][id^="genre-"]').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('period-modern').checked = true;
    
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

// AI Functions - Smart Local Algorithm (No external API needed!)

// Generate AI explanation based on survey data
function generateAIExplanation(data) {
    const genreNames = {
        'action': 'akciju',
        'comedy': 'komediju', 
        'drama': 'dramu',
        'horror': 'horor',
        'sci-fi': 'sci-fi',
        'thriller': 'triler'
    };
    
    const periodNames = {
        '1970-1999': 'klasične filmove (1970-1999)',
        '2000-2009': 'filmove iz 2000-tih',
        '2010-2019': 'filmove iz 2010-tih',
        '2020-2025': 'moderne filmove (2020+)'
    };
    
    // Format genres
    const genreList = data.genres.map(g => genreNames[g] || g).join(', ');
    const periodName = periodNames[data.period] || data.period;
    
    // Generate personalized explanation
    let explanation = `🤖 <strong>Smart AI Analiza:</strong>\n\n`;
    explanation += `Na osnovu tvojih odabira, analizirao sam da želiš:\n`;
    explanation += `📽️ <strong>Žanr:</strong> ${genreList}\n`;
    if (data.genres.length > 1) {
        explanation += `   ℹ️ Film sadrži većinu ili sve izabrane žanrove\n`;
    }
    explanation += `📅 <strong>Period:</strong> ${periodName}\n\n`;
    explanation += `Pronašao sam film koji odgovara tvojim kriterijumima - ima dobru ocenu (5.0+), kvalitetnu produkciju i garantovano će te zadovoljiti!`;
    
    console.log('📝 AI Objašnjenje generisano:', explanation);
    
    return explanation;
}




// Console welcome message
console.log('%cFilmFinder 🎬', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cPronađi savršen film za sebe!', 'color: #764ba2; font-size: 14px;');
console.log('%cPowered by OMDb API + Smart AI', 'color: #6c757d; font-size: 12px;');


