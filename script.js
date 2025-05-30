document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const infoDisplay = document.getElementById('info-display');
    const loadingElement = document.getElementById('loading');
    
    // Variáveis de estado
    let currentCategory = 'countries';
    let currentLanguage = 'pt';
    let savedJokes = JSON.parse(localStorage.getItem('savedJokes')) || [];
    
    // Inicialização
    setupCategoryButtons();
    setupTerminal();
    updatePlaceholderText();
    
    // Configura os botões de categoria
    function setupCategoryButtons() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                
                document.querySelectorAll('.search-panel').forEach(panel => {
                    panel.classList.add('hidden');
                });
                
                document.getElementById(`${currentCategory}-panel`).classList.remove('hidden');
                clearInfoDisplay();
                addToTerminal(`> Categoria alterada para: ${getCategoryName(currentCategory)}`, 'system');
            });
        });
        
        // Configura os botões específicos
        setupCountryButtons();
        setupWeatherButtons();
        setupMovieButtons();
        setupMusicButtons();
        setupJokeButtons();
    }
    
    function setupCountryButtons() {
        const searchBtn = document.getElementById('search-country-btn');
        const randomBtn = document.getElementById('random-country-btn');
        const languageSelect = document.getElementById('language-select');
        
        searchBtn.addEventListener('click', searchCountry);
        randomBtn.addEventListener('click', getRandomCountry);
        languageSelect.addEventListener('change', function() {
            currentLanguage = this.value;
            updatePlaceholderText();
            addToTerminal(`> Idioma definido para: ${getLanguageName(currentLanguage)}`, 'system');
        });
        
        document.getElementById('country-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchCountry();
        });
    }
    
    function setupWeatherButtons() {
        const searchBtn = document.getElementById('search-weather-btn');
        const locationBtn = document.getElementById('current-location-weather-btn');
        
        searchBtn.addEventListener('click', searchWeather);
        locationBtn.addEventListener('click', getWeatherByLocation);
        
        document.getElementById('city-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchWeather();
        });
    }
    
    function setupMovieButtons() {
        const searchBtn = document.getElementById('search-movie-btn');
        const popularBtn = document.getElementById('popular-movies-btn');
        
        searchBtn.addEventListener('click', searchMovie);
        popularBtn.addEventListener('click', getPopularMovies);
        
        document.getElementById('movie-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchMovie();
        });
    }
    
    function setupMusicButtons() {
        const searchBtn = document.getElementById('search-music-btn');
        const topTracksBtn = document.getElementById('top-tracks-btn');
        
        searchBtn.addEventListener('click', searchMusic);
        topTracksBtn.addEventListener('click', getTopTracks);
        
        document.getElementById('music-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchMusic();
        });
    }
    
    function setupJokeButtons() {
        const jokeTypeButtons = document.querySelectorAll('.joke-type-btn');
        const getJokeBtn = document.getElementById('get-joke-btn');
        
        jokeTypeButtons.forEach(button => {
            button.addEventListener('click', function() {
                jokeTypeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        getJokeBtn.addEventListener('click', getJoke);
        
        // Carrega uma piada ao entrar na categoria
        document.querySelector('.category-btn[data-category="jokes"]').addEventListener('click', getJoke);
    }
    
    function setupTerminal() {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                terminalInput.value = '';
                
                if (command) {
                    addToTerminal(`> ${command}`, 'command');
                    processCommand(command);
                }
            }
        });
    }
    
    function processCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand === 'clear') {
            clearTerminal();
        } else if (lowerCommand === 'help') {
            showHelp();
        } else if (lowerCommand === 'random') {
            if (currentCategory === 'countries') getRandomCountry();
            else if (currentCategory === 'jokes') getJoke();
            else addToTerminal('> Comando "random" não disponível nesta categoria', 'error');
        } else if (lowerCommand === 'list languages') {
            listLanguages();
        } else if (lowerCommand.startsWith('set language ')) {
            setLanguage(command.substring(13));
        } else if (lowerCommand === 'list categories') {
            listCategories();
        } else if (lowerCommand.startsWith('set category ')) {
            setCategory(command.substring(13));
        } else {
            switch (currentCategory) {
                case 'countries':
                    searchCountry(command);
                    break;
                case 'weather':
                    searchWeather(command);
                    break;
                case 'movies':
                    searchMovie(command);
                    break;
                case 'music':
                    searchMusic(command);
                    break;
                default:
                    addToTerminal('> Comando não reconhecido. Digite "help" para ajuda.', 'error');
            }
        }
    }
    
    // Funções para manipulação da interface
    function showLoading() {
        infoDisplay.innerHTML = '';
        loadingElement.style.display = 'flex';
    }
    
    function hideLoading() {
        loadingElement.style.display = 'none';
    }
    
    function clearInfoDisplay() {
        infoDisplay.innerHTML = '';
    }
    
    function addToTerminal(message, type = 'normal') {
        const p = document.createElement('p');
        p.textContent = message;
        
        switch (type) {
            case 'command':
                p.style.color = '#4ec9b0';
                break;
            case 'system':
                p.style.color = '#9cdcfe';
                break;
            case 'success':
                p.style.color = '#b5cea8';
                break;
            case 'error':
                p.style.color = '#f48771';
                break;
            default:
                p.style.color = '#d4d4d4';
        }
        
        terminalOutput.appendChild(p);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    function clearTerminal() {
        terminalOutput.innerHTML = '';
        addToTerminal('> Terminal limpo. Digite "help" para ver os comandos disponíveis.', 'system');
    }
    
    function updatePlaceholderText() {
        const placeholders = {
            'pt': {
                'countries': 'Digite o nome de um país...',
                'weather': 'Digite o nome de uma cidade...',
                'movies': 'Digite o nome de um filme...',
                'music': 'Digite o nome de uma música, artista ou álbum...'
            },
            'en': {
                'countries': 'Enter a country name...',
                'weather': 'Enter a city name...',
                'movies': 'Enter a movie name...',
                'music': 'Enter a song, artist or album name...'
            },
            'es': {
                'countries': 'Ingrese el nombre de un país...',
                'weather': 'Ingrese el nombre de una ciudad...',
                'movies': 'Ingrese el nombre de una película...',
                'music': 'Ingrese el nombre de una canción, artista o álbum...'
            },
            'fr': {
                'countries': 'Entrez le nom d\'un pays...',
                'weather': 'Entrez le nom d\'une ville...',
                'movies': 'Entrez le nom d\'un film...',
                'music': 'Entrez le nom d\'une chanson, artiste ou album...'
            },
            'de': {
                'countries': 'Geben Sie einen Ländernamen ein...',
                'weather': 'Geben Sie einen Stadtnamen ein...',
                'movies': 'Geben Sie einen Filmtitel ein...',
                'music': 'Geben Sie einen Song-, Künstler- oder Albumtitel ein...'
            },
            'it': {
                'countries': 'Inserisci il nome di un paese...',
                'weather': 'Inserisci il nome di una città...',
                'movies': 'Inserisci il nome di un film...',
                'music': 'Inserisci il nome di una canzone, artista o album...'
            },
            'ru': {
                'countries': 'Введите название страны...',
                'weather': 'Введите название города...',
                'movies': 'Введите название фильма...',
                'music': 'Введите название песни, исполнителя или альбома...'
            },
            'el': {
                'countries': 'Εισαγάγετε το όνομα μιας χώρας...',
                'weather': 'Εισαγάγετε το όνομα μιας πόλης...',
                'movies': 'Εισαγάγετε το όνομα μιας ταινίας...',
                'music': 'Εισαγάγετε το όνομα ενός τραγουδιού, καλλιτέχνη ή άλμπουμ...'
            },
            'nl': {
                'countries': 'Voer een landnaam in...',
                'weather': 'Voer een stadsnaam in...',
                'movies': 'Voer een filmtitel in...',
                'music': 'Voer een liedje, artiest of albumnaam in...'
            }
        };
        
        const inputFields = {
            'countries': 'country-input',
            'weather': 'city-input',
            'movies': 'movie-input',
            'music': 'music-input'
        };
        
        if (inputFields[currentCategory]) {
            const inputId = inputFields[currentCategory];
            const placeholder = placeholders[currentLanguage]?.[currentCategory] || placeholders['pt'][currentCategory];
            document.getElementById(inputId).placeholder = placeholder;
        }
    }
    
    // Funções para obter informações
    async function searchCountry(countryName = null) {
        const name = countryName || document.getElementById('country-input').value.trim();
        
        if (!name) {
            addToTerminal('> Por favor, digite o nome de um país.', 'error');
            return;
        }
        
        showLoading();
        addToTerminal(`> Buscando informações sobre: ${name}`, 'system');
        
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
            
            if (!response.ok) {
                throw new Error('País não encontrado');
            }
            
            const data = await response.json();
            const country = data[0];
            addToTerminal(`> País encontrado: ${country.name.common} (${country.cca2})`, 'success');
            displayCountryInfo(country);
            addToTerminal(`> Informações carregadas com sucesso para ${country.name.common}`, 'success');
        } catch (error) {
            addToTerminal(`> Erro: ${error.message}`, 'error');
            displayError(`Não foi possível encontrar informações sobre "${name}". Tente novamente com um nome diferente.`);
        }
    }
    
    function displayCountryInfo(country) {
        let languages = '';
        if (country.languages) {
            languages = Object.values(country.languages).join(', ');
        }
        
        let currencies = '';
        if (country.currencies) {
            currencies = Object.entries(country.currencies).map(([code, currency]) => {
                return `${currency.name} (${currency.symbol || code})`;
            }).join(', ');
        }
        
        const html = `
            <div class="country-card">
                <h2>
                    <img src="${country.flags.png}" alt="${country.name.common} flag">
                    ${country.name.common}
                </h2>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <strong>Nome oficial</strong>
                        <span>${country.name.official}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Capital</strong>
                        <span>${country.capital?.join(', ') || 'Não informado'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Região</strong>
                        <span>${country.region}${country.subregion ? ` (${country.subregion})` : ''}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Línguas</strong>
                        <span>${languages || 'Não informado'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Moedas</strong>
                        <span>${currencies || 'Não informado'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>População</strong>
                        <span>${country.population?.toLocaleString() || 'Não informado'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Área</strong>
                        <span>${country.area?.toLocaleString() || 'Não informado'} km²</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Código</strong>
                        <span>${country.cca2}</span>
                    </div>
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
    }
    
    async function getRandomCountry() {
        showLoading();
        addToTerminal('> Buscando país aleatório...', 'system');
        
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const countries = await response.json();
            const randomIndex = Math.floor(Math.random() * countries.length);
            const randomCountry = countries[randomIndex];
            
            document.getElementById('country-input').value = randomCountry.name.common;
            searchCountry(randomCountry.name.common);
        } catch (error) {
            addToTerminal(`> Erro ao buscar país aleatório: ${error.message}`, 'error');
            displayError('Erro ao carregar país aleatório. Tente novamente.');
        }
    }
    
    async function searchWeather(cityName = null) {
        const city = cityName || document.getElementById('city-input').value.trim();
        const unit = document.querySelector('input[name="weather-unit"]:checked').value;
        
        if (!city) {
            addToTerminal('> Por favor, digite o nome de uma cidade.', 'error');
            return;
        }
        
        showLoading();
        addToTerminal(`> Buscando clima para: ${city}`, 'system');
        
        try {
            // Usando a API OpenWeatherMap (substitua YOUR_API_KEY por uma chave válida)
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${unit}&lang=${currentLanguage}&appid=YOUR_API_KEY`
            );
            
            if (!response.ok) {
                throw new Error('Cidade não encontrada');
            }
            
            const data = await response.json();
            addToTerminal(`> Clima encontrado para: ${data.name}, ${data.sys.country}`, 'success');
            displayWeatherInfo(data, unit);
            addToTerminal('> Informações climáticas carregadas com sucesso', 'success');
        } catch (error) {
            addToTerminal(`> Erro: ${error.message}`, 'error');
            displayError(`Não foi possível encontrar informações climáticas para "${city}". Tente novamente com um nome diferente.`);
        }
    }
    
    function displayWeatherInfo(data, unit) {
        const tempUnit = unit === 'metric' ? '°C' : '°F';
        const windUnit = unit === 'metric' ? 'm/s' : 'mph';
        
        const html = `
            <div class="weather-card">
                <h2>${data.name}, ${data.sys.country}</h2>
                
                <div class="weather-details">
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                    </div>
                    <div>
                        <div class="weather-temp">${Math.round(data.main.temp)}${tempUnit}</div>
                        <div class="weather-desc">${data.weather[0].description}</div>
                    </div>
                </div>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <strong>Sensação térmica</strong>
                        <span>${Math.round(data.main.feels_like)}${tempUnit}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Mínima/Máxima</strong>
                        <span>${Math.round(data.main.temp_min)}${tempUnit} / ${Math.round(data.main.temp_max)}${tempUnit}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Umidade</strong>
                        <span>${data.main.humidity}%</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Pressão</strong>
                        <span>${data.main.pressure} hPa</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Vento</strong>
                        <span>${data.wind.speed} ${windUnit} (${data.wind.deg}°)</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Visibilidade</strong>
                        <span>${(data.visibility / 1000).toFixed(1)} km</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Nuvens</strong>
                        <span>${data.clouds.all}%</span>
                    </div>
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
    }
    
    async function getWeatherByLocation() {
        if (!navigator.geolocation) {
            addToTerminal('> Geolocalização não suportada pelo navegador.', 'error');
            return;
        }
        
        showLoading();
        addToTerminal('> Obtendo sua localização...', 'system');
        
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;
                const unit = document.querySelector('input[name="weather-unit"]:checked').value;
                
                try {
                    // Usando a API OpenWeatherMap (substitua YOUR_API_KEY por uma chave válida)
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&lang=${currentLanguage}&appid=YOUR_API_KEY`
                    );
                    
                    if (!response.ok) {
                        throw new Error('Erro ao obter dados climáticos');
                    }
                    
                    const data = await response.json();
                    addToTerminal(`> Clima encontrado para sua localização: ${data.name}`, 'success');
                    displayWeatherInfo(data, unit);
                } catch (error) {
                    addToTerminal(`> Erro: ${error.message}`, 'error');
                    displayError('Erro ao obter dados climáticos para sua localização.');
                }
            },
            error => {
                addToTerminal(`> Erro de geolocalização: ${error.message}`, 'error');
                displayError('Não foi possível obter sua localização. Verifique as permissões do navegador.');
            }
        );
    }
    
    async function searchMovie(movieName = null) {
        const name = movieName || document.getElementById('movie-input').value.trim();
        const language = document.getElementById('movie-language').value;
        
        if (!name) {
            addToTerminal('> Por favor, digite o nome de um filme.', 'error');
            return;
        }
        
        showLoading();
        addToTerminal(`> Buscando filme: ${name}`, 'system');
        
        try {
            // Usando a API The Movie DB (substitua YOUR_API_KEY por uma chave válida)
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${encodeURIComponent(name)}&language=${language}`
            );
            
            if (!response.ok) {
                throw new Error('Filme não encontrado');
            }
            
            const data = await response.json();
            
            if (data.results.length === 0) {
                throw new Error('Nenhum filme encontrado');
            }
            
            const movie = data.results[0];
            addToTerminal(`> Filme encontrado: ${movie.title} (${movie.release_date?.substring(0, 4) || 'Ano desconhecido'})`, 'success');
            displayMovieInfo(movie, language);
            addToTerminal('> Informações do filme carregadas com sucesso', 'success');
        } catch (error) {
            addToTerminal(`> Erro: ${error.message}`, 'error');
            displayError(`Não foi possível encontrar informações sobre "${name}". Tente novamente com um nome diferente.`);
        }
    }
    
    function displayMovieInfo(movie, language) {
        const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString(language) : 'Desconhecido';
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=Poster+Não+Disponível';
        
        const html = `
            <div class="movie-card">
                <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
                
                <h2>${movie.title} <span>(${movie.release_date?.substring(0, 4) || '?'})</span></h2>
                
                <div class="movie-info">
                    <div class="detail-item">
                        <strong>Data de lançamento</strong>
                        <span>${releaseDate}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Avaliação</strong>
                        <span>${movie.vote_average?.toFixed(1) || '?'}/10 (${movie.vote_count || '0'} votos)</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Popularidade</strong>
                        <span>${movie.popularity?.toFixed(0) || '?'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Idioma original</strong>
                        <span>${movie.original_language?.toUpperCase() || '?'}</span>
                    </div>
                </div>
                
                <div class="movie-overview">
                    <h3>Sinopse</h3>
                    <p>${movie.overview || 'Sinopse não disponível.'}</p>
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
    }
    
    async function getPopularMovies() {
        const language = document.getElementById('movie-language').value;
        
        showLoading();
        addToTerminal('> Buscando filmes populares...', 'system');
        
        try {
            // Usando a API The Movie DB (substitua YOUR_API_KEY por uma chave válida)
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY&language=${language}`
            );
            
            if (!response.ok) {
                throw new Error('Erro ao buscar filmes populares');
            }
            
            const data = await response.json();
            
            if (data.results.length === 0) {
                throw new Error('Nenhum filme popular encontrado');
            }
            
            addToTerminal(`> ${data.results.length} filmes populares encontrados`, 'success');
            displayPopularMovies(data.results, language);
            addToTerminal('> Lista de filmes populares carregada com sucesso', 'success');
        } catch (error) {
            addToTerminal(`> Erro: ${error.message}`, 'error');
            displayError('Erro ao carregar filmes populares. Tente novamente.');
        }
    }
    
    function displayPopularMovies(movies, language) {
        const html = `
            <div class="movies-list">
                <h2>Filmes Populares</h2>
                
                <div class="movies-grid">
                    ${movies.slice(0, 6).map(movie => `
                        <div class="movie-item">
                            <img src="${movie.poster_path 
                                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                : 'https://via.placeholder.com/300x450?text=Poster+Não+Disponível'}" 
                                alt="${movie.title}">
                            <h3>${movie.title}</h3>
                            <p>${movie.release_date?.substring(0, 4) || 'Ano desconhecido'} • ${movie.vote_average?.toFixed(1) || '?'}/10</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
    }
    
    async function searchMusic(query = null) {
        const searchQuery = query || document.getElementById('music-input').value.trim();
        
        if (!searchQuery) {
            addToTerminal('> Por favor, digite o nome de uma música, artista ou álbum.', 'error');
            return;
        }
        
        showLoading();
        addToTerminal(`> Buscando música: ${searchQuery}`, 'system');
        
        try {
            // Usando a API do Last.fm (substitua YOUR_API_KEY por uma chave válida)
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(searchQuery)}&api_key=YOUR_API_KEY&format=json&limit=5`
            );
            
            if (!response.ok) {
                throw new Error('Música não encontrada');
            }
            
            const data = await response.json();
            
            if (!data.results?.trackmatches?.track || data.results.trackmatches.track.length === 0) {
                throw new Error('Nenhum resultado encontrado');
            }
            
            const tracks = data.results.trackmatches.track;
            addToTerminal(`> ${tracks.length} resultados encontrados para "${searchQuery}"`, 'success');
            displayMusicResults(tracks);
            addToTerminal('> Resultados musicais carregados com sucesso', 'success');
        } catch (error) {
            addToTerminal(`> Erro: ${error.message}`, 'error');
            displayError(`Não foi possível encontrar resultados para "${searchQuery}". Tente novamente com um termo diferente.`);
        }
    }
    
    function displayMusicResults(tracks) {
        const html = `
            <div class="music-card">
                <h2>Resultados da Busca</h2>
                
                <div class="tracks-list">
                    ${tracks.map(track => `
                        <div class="track-item">
                            <div class="track-info">
                                <h3>${track.name}</h3>
                                <p>${track.artist}</p>
                            </div>
                            <a href="${track.url}" target="_blank" class="track-link">Ver no Last.fm</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
    }
    
    async function getTopTracks() {
        showLoading();
        addToTerminal('> Buscando músicas mais tocadas...', 'system');
        
        try {
            // Usando a API do Last.fm (substitua YOUR_API_KEY por uma chave válida)
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=YOUR_API_KEY&format=json&limit=10`
            );
            
            if (!response.ok) {
                throw new Error('Erro ao buscar músicas populares');
            }
            
            const data = await response.json();
            
            if (!data.tracks?.track || data.tracks.track.length === 0) {
                throw new Error('Nenhuma música encontrada');
            }
            
            const tracks = data.tracks.track;
            addToTerminal(`> Top ${tracks.length} músicas encontradas`, 'success');
            displayTopTracks(tracks);
            addToTerminal('> Top músicas carregado com sucesso', 'success');
        } catch (error) {
            addToTerminal(`> Erro: ${error.message}`, 'error');
            displayError('Erro ao carregar as músicas mais tocadas. Tente novamente.');
        }
    }
    
    function displayTopTracks(tracks) {
        const html = `
            <div class="music-card">
                <h2>Músicas Mais Tocadas</h2>
                
                <div class="tracks-list">
                    ${tracks.map((track, index) => `
                        <div class="track-item">
                            <span class="track-position">${index + 1}</span>
                            <div class="track-info">
                                <h3>${track.name}</h3>
                                <p>${track.artist.name}</p>
                            </div>
                            <span class="track-playcount">${track.playcount} plays</span>
                            <a href="${track.url}" target="_blank" class="track-link">Ver no Last.fm</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
    }
    
    async function getJoke() {
        const jokeType = document.querySelector('.joke-type-btn.active').dataset.type;
        const language = document.getElementById('joke-language').value;
        
        showLoading();
        addToTerminal('> Buscando piada...', 'system');
        
        try {
            let joke;
            
            if (language === 'pt') {
                // API de piadas em português
                joke = await getPortugueseJoke(jokeType);
            } else {
                // API de piadas internacionais (em inglês)
                joke = await getEnglishJoke(jokeType);
                
                // Se necessário, traduzir a piada para o idioma selecionado
                if (language !== 'en') {
                    joke = await translateJoke(joke, language);
                }
            }
            
            addToTerminal('> Piada encontrada!', 'success');
            displayJoke(joke);
        } catch (error) {
            addToTerminal(`> Erro: ${error.message}`, 'error');
            displayError('Não foi possível carregar uma piada. Tente novamente.');
        }
    }
    
    async function getPortugueseJoke(type) {
        // Simulando piadas em português (em um sistema real, use uma API)
        const jokes = {
            any: {
                setup: "Por que o computador foi ao médico?",
                punchline: "Porque tinha um vírus!"
            },
            programming: {
                setup: "Qual é o café preferido do desenvolvedor?",
                punchline: "Java!"
            },
            pun: {
                setup: "O que o pato disse para a pata?",
                punchline: "Vem quá!"
            },
            dark: {
                setup: "Por que o esqueleto não brigou com ninguém?",
                punchline: "Porque ele não tem estômago para isso."
            }
        };
        
        return jokes[type] || jokes.any;
    }
    
    async function getEnglishJoke(type) {
        try {
            let url;
            
            if (type === 'programming') {
                url = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
            } else if (type === 'pun') {
                url = 'https://v2.jokeapi.dev/joke/Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
            } else if (type === 'dark') {
                url = 'https://v2.jokeapi.dev/joke/Dark?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
            } else {
                url = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar piada');
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.message);
            }
            
            if (data.type === 'twopart') {
                return {
                    setup: data.setup,
                    punchline: data.delivery
                };
            } else {
                return {
                    setup: '',
                    punchline: data.joke
                };
            }
        } catch (error) {
            console.error('Erro ao buscar piada em inglês:', error);
            return {
                setup: "Why don't scientists trust atoms?",
                punchline: "Because they make up everything!"
            };
        }
    }
    
    async function translateJoke(joke, targetLang) {
        // Em um sistema real, use uma API de tradução como Google Translate
        // Esta é uma implementação simulada
        const translations = {
            es: {
                "Why don't scientists trust atoms?": "¿Por qué los científicos no confían en los átomos?",
                "Because they make up everything!": "¡Porque lo componen todo!"
            },
            fr: {
                "Why don't scientists trust atoms?": "Pourquoi les scientifiques ne font-ils pas confiance aux atomes ?",
                "Because they make up everything!": "Parce qu'ils composent tout !"
            },
            de: {
                "Why don't scientists trust atoms?": "Warum vertrauen Wissenschaftler Atomen nicht?",
                "Because they make up everything!": "Weil sie alles ausmachen!"
            }
        };
        
        if (translations[targetLang]) {
            return {
                setup: translations[targetLang][joke.setup] || joke.setup,
                punchline: translations[targetLang][joke.punchline] || joke.punchline
            };
        }
        
        return joke;
    }
    
    function displayJoke(joke) {
        const html = `
            <div class="joke-card">
                <h2>Piada do Momento</h2>
                
                <div class="joke-text">
                    ${joke.setup ? `<div class="joke-setup">${joke.setup}</div>` : ''}
                    <div class="joke-punchline">${joke.punchline}</div>
                </div>
                
                <button id="save-joke-btn" class="save-btn"><i class="far fa-bookmark"></i> Salvar Piada</button>
                
                ${savedJokes.length > 0 ? `
                    <div class="saved-jokes">
                        <h3>Piadas Salvas</h3>
                        ${savedJokes.map((savedJoke, index) => `
                            <div class="saved-joke">
                                <p>${savedJoke.setup || ''} ${savedJoke.punchline}</p>
                                <button class="remove-joke-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
        
        // Configura o botão de salvar piada
        document.getElementById('save-joke-btn')?.addEventListener('click', () => saveJoke(joke));
        
        // Configura os botões de remover piada
        document.querySelectorAll('.remove-joke-btn').forEach(button => {
            button.addEventListener('click', function() {
                removeJoke(parseInt(this.dataset.index));
            });
        });
    }
    
    function saveJoke(joke) {
        savedJokes.push(joke);
        localStorage.setItem('savedJokes', JSON.stringify(savedJokes));
        addToTerminal('> Piada salva com sucesso!', 'success');
        displayJoke(joke); // Atualiza a exibição para mostrar a piada salva
    }
    
    function removeJoke(index) {
        savedJokes.splice(index, 1);
        localStorage.setItem('savedJokes', JSON.stringify(savedJokes));
        addToTerminal('> Piada removida!', 'success');
        
        // Recarrega a piada atual para atualizar a lista
        const jokeType = document.querySelector('.joke-type-btn.active').dataset.type;
        const language = document.getElementById('joke-language').value;
        displayJoke({
            setup: "Recarregando piadas salvas...",
            punchline: "Aqui está sua lista atualizada!"
        });
        
        // Mantém a piada atual em exibição
        setTimeout(() => {
            const currentJoke = infoDisplay.querySelector('.joke-text')?.innerHTML;
            if (currentJoke) {
                displayJoke({
                    setup: infoDisplay.querySelector('.joke-setup')?.textContent || '',
                    punchline: infoDisplay.querySelector('.joke-punchline')?.textContent || ''
                });
            }
        }, 500);
    }
    
    function displayError(message) {
        const html = `
            <div class="error-message">
                <h2><i class="fas fa-exclamation-triangle"></i> Ocorreu um erro</h2>
                <p>${message}</p>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
        hideLoading();
    }
    
    // Funções auxiliares
    function getCategoryName(category) {
        const names = {
            'countries': 'Países',
            'weather': 'Clima',
            'movies': 'Filmes',
            'music': 'Música',
            'jokes': 'Piadas'
        };
        return names[category] || category;
    }
    
    function getLanguageName(code) {
        const names = {
            'pt': 'Português',
            'en': 'Inglês',
            'es': 'Espanhol',
            'fr': 'Francês',
            'de': 'Alemão',
            'it': 'Italiano',
            'ru': 'Russo',
            'el': 'Grego',
            'nl': 'Holandês'
        };
        return names[code] || code;
    }
    
    function listLanguages() {
        addToTerminal('> Idiomas disponíveis:', 'system');
        addToTerminal('> - Português (pt)');
        addToTerminal('> - Inglês (en)');
        addToTerminal('> - Espanhol (es)');
        addToTerminal('> - Francês (fr)');
        addToTerminal('> - Alemão (de)');
        addToTerminal('> - Italiano (it)');
        addToTerminal('> - Russo (ru)');
        addToTerminal('> - Grego (el)');
        addToTerminal('> - Holandês (nl)');
        addToTerminal('> Use "set language [código]" para mudar o idioma', 'system');
    }
    
    function setLanguage(langCode) {
        const validLanguages = ['pt', 'en', 'es', 'fr', 'de', 'it', 'ru', 'el', 'nl'];
        
        if (validLanguages.includes(langCode)) {
            currentLanguage = langCode;
            document.getElementById('language-select').value = langCode;
            document.getElementById('joke-language').value = langCode;
            updatePlaceholderText();
            addToTerminal(`> Idioma definido para: ${getLanguageName(langCode)}`, 'success');
        } else {
            addToTerminal('> Código de idioma inválido. Use "list languages" para ver os códigos válidos.', 'error');
        }
    }
    
    function listCategories() {
        addToTerminal('> Categorias disponíveis:', 'system');
        addToTerminal('> - countries (Países)');
        addToTerminal('> - weather (Clima)');
        addToTerminal('> - movies (Filmes)');
        addToTerminal('> - music (Música)');
        addToTerminal('> - jokes (Piadas)');
        addToTerminal('> Use "set category [nome]" para mudar de categoria', 'system');
    }
    
    function setCategory(category) {
        const validCategories = ['countries', 'weather', 'movies', 'music', 'jokes'];
        
        if (validCategories.includes(category)) {
            document.querySelector(`.category-btn[data-category="${category}"]`).click();
            addToTerminal(`> Categoria definida para: ${getCategoryName(category)}`, 'success');
        } else {
            addToTerminal('> Categoria inválida. Use "list categories" para ver as opções.', 'error');
        }
    }
    
    function showHelp() {
        addToTerminal('> Comandos disponíveis:', 'system');
        addToTerminal('> - "clear": Limpa o terminal');
        addToTerminal('> - "help": Mostra esta mensagem de ajuda');
        addToTerminal('> - "random": Busca um item aleatório (país ou piada)');
        addToTerminal('> - "list languages": Lista idiomas disponíveis');
        addToTerminal('> - "set language [código]": Muda o idioma');
        addToTerminal('> - "list categories": Lista categorias disponíveis');
        addToTerminal('> - "set category [nome]": Muda de categoria');
        addToTerminal('> - "[texto]": Busca de acordo com a categoria atual', 'system');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // ... [Manter configurações iniciais iguais] ...

    // ==================== APIs PÚBLICAS ====================
    async function searchCountry(countryName = null) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
            // ... [restante da função igual] ...
        } catch (error) {
            console.error("Erro na API de países:", error);
        }
    }

    async function searchWeather(cityName = null) {
        try {
            // API Open-Meteo (sem chave)
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
            const geoData = await geoResponse.json();
            
            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude } = geoData.results[0];
                const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const weatherData = await weatherResponse.json();
                displayWeatherInfo(weatherData);
            }
        } catch (error) {
            console.error("Erro na API de clima:", error);
        }
    }

    async function searchMovie(movieName = null) {
        try {
            // API pública do TMDB (versão básica)
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}`);
            // ... [restante da função igual] ...
        } catch (error) {
            console.error("Erro na API de filmes:", error);
        }
    }

    async function searchMusic(query = null) {
        try {
            // API pública do iTunes
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=5`);
            const data = await response.json();
            displayMusicResults(data.results);
        } catch (error) {
            console.error("Erro na API de música:", error);
        }
    }

    async function getJoke() {
        try {
            // JokeAPI pública
            const type = document.querySelector('.joke-type-btn.active').dataset.type;
            const lang = document.getElementById('joke-language').value;
            
            const url = `https://v2.jokeapi.dev/joke/${type}?lang=${lang}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.type === 'twopart') {
                displayJoke({ setup: data.setup, punchline: data.delivery });
            } else {
                displayJoke({ punchline: data.joke });
            }
        } catch (error) {
            console.error("Erro na API de piadas:", error);
        }
    }

    // ... [Manter o restante das funções auxiliares iguais] ...
});


document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const infoDisplay = document.getElementById('info-display');
    
    // Variáveis de estado
    let currentCategory = 'countries';
    let currentLanguage = 'pt';
    
    // Dicionário de traduções
    const translations = {
        pt: {
            searchPlaceholder: {
                countries: 'Digite o nome de um país...',
                weather: 'Digite o nome de uma cidade...',
                movies: 'Digite o nome de um filme...',
                music: 'Digite nome de música/artista...'
            },
            errors: {
                notFound: 'Não encontrado',
                tryAgain: 'Tente novamente'
            }
        },
        en: {
            searchPlaceholder: {
                countries: 'Enter a country name...',
                weather: 'Enter a city name...',
                movies: 'Enter a movie name...',
                music: 'Enter song/artist name...'
            },
            errors: {
                notFound: 'Not found',
                tryAgain: 'Try again'
            }
        },
        es: {
            searchPlaceholder: {
                countries: 'Ingrese nombre de país...',
                weather: 'Ingrese nombre de ciudad...',
                movies: 'Ingrese nombre de película...',
                music: 'Ingrese canción/artista...'
            },
            errors: {
                notFound: 'No encontrado',
                tryAgain: 'Intente nuevamente'
            }
        },
        fr: {
            searchPlaceholder: {
                countries: 'Entrez un pays...',
                weather: 'Entrez une ville...',
                movies: 'Entrez un film...',
                music: 'Entrez chanson/artiste...'
            },
            errors: {
                notFound: 'Non trouvé',
                tryAgain: 'Réessayer'
            }
        },
        de: {
            searchPlaceholder: {
                countries: 'Land eingeben...',
                weather: 'Stadt eingeben...',
                movies: 'Film eingeben...',
                music: 'Musik/Künstler eingeben...'
            },
            errors: {
                notFound: 'Nicht gefunden',
                tryAgain: 'Nochmal versuchen'
            }
        },
        it: {
            searchPlaceholder: {
                countries: 'Inserisci un paese...',
                weather: 'Inserisci una città...',
                movies: 'Inserisci un film...',
                music: 'Inserisci canzone/artista...'
            },
            errors: {
                notFound: 'Non trovato',
                tryAgain: 'Riprova'
            }
        },
        ru: {
            searchPlaceholder: {
                countries: 'Введите страну...',
                weather: 'Введите город...',
                movies: 'Введите фильм...',
                music: 'Введите песню/артиста...'
            },
            errors: {
                notFound: 'Не найдено',
                tryAgain: 'Попробуйте снова'
            }
        },
        el: {
            searchPlaceholder: {
                countries: 'Εισάγετε χώρα...',
                weather: 'Εισάγετε πόλη...',
                movies: 'Εισάγετε ταινία...',
                music: 'Εισάγετε τραγούδι/καλλιτέχνη...'
            },
            errors: {
                notFound: 'Δεν βρέθηκε',
                tryAgain: 'Δοκιμάστε ξανά'
            }
        },
        nl: {
            searchPlaceholder: {
                countries: 'Voer land in...',
                weather: 'Voer stad in...',
                movies: 'Voer film in...',
                music: 'Voer lied/artiest in...'
            },
            errors: {
                notFound: 'Niet gevonden',
                tryAgain: 'Probeer opnieuw'
            }
        }
    };

    // Funções de busca corrigidas
    async function searchCountry() {
        const name = document.getElementById('country-input').value.trim();
        if (!name) return showError('Digite um nome de país');
        
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
            if (!response.ok) throw new Error('País não encontrado');
            
            const data = await response.json();
            displayCountryInfo(data[0]);
        } catch (error) {
            showError(`País "${name}" não encontrado`);
        }
    }

    async function searchWeather() {
        const city = document.getElementById('city-input').value.trim();
        if (!city) return showError('Digite uma cidade');
        
        try {
            // API pública de geocodificação
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
            const geoData = await geoResponse.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('Cidade não encontrada');
            }
            
            const { latitude, longitude } = geoData.results[0];
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherResponse.json();
            
            displayWeatherInfo(weatherData, city);
        } catch (error) {
            showError(`Cidade "${city}" não encontrada`);
        }
    }

    // [Adicione as outras funções de busca similares]

    // Funções de exibição
    function displayCountryInfo(country) {
        const html = `
            <div class="country-card">
                <h2>${country.name.common}</h2>
                <img src="${country.flags.png}" alt="Bandeira" width="100">
                <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
                <p><strong>População:</strong> ${country.population?.toLocaleString() || 'N/A'}</p>
            </div>
        `;
        infoDisplay.innerHTML = html;
    }

    function displayWeatherInfo(data, city) {
        const html = `
            <div class="weather-card">
                <h2>Clima em ${city}</h2>
                <p>Temperatura: ${data.current_weather.temperature}°C</p>
                <p>Vento: ${data.current_weather.windspeed} km/h</p>
            </div>
        `;
        infoDisplay.innerHTML = html;
    }

    function showError(message) {
        infoDisplay.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }

    // Configuração inicial
    function init() {
        // Configurar event listeners corretamente
        document.getElementById('search-country-btn').addEventListener('click', searchCountry);
        document.getElementById('search-weather-btn').addEventListener('click', searchWeather);
        
        // [Adicionar listeners para outras categorias]
        
        // Atualizar placeholders
        updatePlaceholders();
    }

    function updatePlaceholders() {
        const lang = currentLanguage;
        document.getElementById('country-input').placeholder = translations[lang].searchPlaceholder.countries;
        document.getElementById('city-input').placeholder = translations[lang].searchPlaceholder.weather;
        document.getElementById('movie-input').placeholder = translations[lang].searchPlaceholder.movies;
        document.getElementById('music-input').placeholder = translations[lang].searchPlaceholder.music;
    }

    // Inicializar
    init();
});