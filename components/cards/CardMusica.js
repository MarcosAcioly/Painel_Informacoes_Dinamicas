import { MusicService } from '../../services/MusicService.js';
import { Dashboard } from '../Dashboard.js';
class CardMusica {
    constructor() {
        this.musicService = new MusicService();
    }
    
    render(container) {
        const html = `
            <div class="search-panel" id="music-panel">
                <div class="search-container">
                    <input type="text" id="music-input" placeholder="Digite o nome de uma música, artista ou álbum...">
                    <button id="search-music-btn"><i class="fas fa-search"></i> Buscar</button>
                    <button id="top-tracks-btn"><i class="fas fa-chart-line"></i> Top Músicas</button>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.addEventListeners();
    }
    
    addEventListeners() {
        const searchBtn = document.getElementById('search-music-btn');
        const topTracksBtn = document.getElementById('top-tracks-btn');
        const musicInput = document.getElementById('music-input');
        
        searchBtn.addEventListener('click', () => {
            const query = musicInput.value.trim();
            if (query) {
                this.searchMusic(query);
            }
        });
        
        topTracksBtn.addEventListener('click', () => {
            this.getTopTracks();
        });
        
        musicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = musicInput.value.trim();
                if (query) {
                    this.searchMusic(query);
                }
            }
        });
    }
    
    searchMusic(query) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        this.musicService.search(query)
            .then(data => {
                this.displaySearchResults(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    getTopTracks() {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        this.musicService.getTopTracks()
            .then(data => {
                this.displayTopTracks(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    displaySearchResults(data) {
        const infoDisplay = document.getElementById('info-display');
        
        if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
            let html = '<div class="music-results">';
            html += '<h2>Resultados da Busca</h2>';
            html += '<div class="tracks-container">';
            
            data.tracks.items.slice(0, 10).forEach(track => {
                const artistNames = track.artists.map(artist => artist.name).join(', ');
                const albumImage = track.album.images.length > 0 ? 
                    track.album.images[1].url : 
                    'https://via.placeholder.com/300x300?text=Sem+Imagem';
                
                html += `
                    <div class="track-item" data-id="${track.id}">
                        <img src="${albumImage}" alt="${track.name}">
                        <div class="track-info">
                            <h3>${track.name}</h3>
                            <p>${artistNames}</p>
                            <p class="album-name">${track.album.name}</p>
                        </div>
                        <div class="track-preview">
                            ${track.preview_url ? 
                                `<audio controls src="${track.preview_url}"></audio>` : 
                                '<p class="no-preview">Prévia não disponível</p>'}
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
            infoDisplay.innerHTML = html;
            
            // Adiciona evento de clique para cada faixa
            document.querySelectorAll('.track-item').forEach(item => {
                item.addEventListener('click', () => {
                    const trackId = item.dataset.id;
                    this.getTrackDetails(trackId);
                });
            });
        } else {
            this.displayError('Nenhuma música encontrada com esse termo.');
        }
    }
    
    displayTopTracks(data) {
        const infoDisplay = document.getElementById('info-display');
        
        if (data.tracks && data.tracks.length > 0) {
            let html = '<div class="top-tracks">';
            html += '<h2>Top Músicas</h2>';
            html += '<div class="tracks-container">';
            
            data.tracks.forEach((track, index) => {
                const artistNames = track.artists.map(artist => artist.name).join(', ');
                const albumImage = track.album.images.length > 0 ? 
                    track.album.images[1].url : 
                    'https://via.placeholder.com/300x300?text=Sem+Imagem';
                
                html += `
                    <div class="track-item" data-id="${track.id}">
                        <div class="track-rank">${index + 1}</div>
                        <img src="${albumImage}" alt="${track.name}">
                        <div class="track-info">
                            <h3>${track.name}</h3>
                            <p>${artistNames}</p>
                            <p class="album-name">${track.album.name}</p>
                        </div>
                        <div class="track-preview">
                            ${track.preview_url ? 
                                `<audio controls src="${track.preview_url}"></audio>` : 
                                '<p class="no-preview">Prévia não disponível</p>'}
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
            infoDisplay.innerHTML = html;
            
            // Adiciona evento de clique para cada faixa
            document.querySelectorAll('.track-item').forEach(item => {
                item.addEventListener('click', () => {
                    const trackId = item.dataset.id;
                    this.getTrackDetails(trackId);
                });
            });
        } else {
            this.displayError('Não foi possível carregar as top músicas.');
        }
    }
    
    getTrackDetails(trackId) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        this.musicService.getTrackDetails(trackId)
            .then(data => {
                this.displayTrackDetails(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    displayTrackDetails(track) {
        const infoDisplay = document.getElementById('info-display');
        
        const artistNames = track.artists.map(artist => artist.name).join(', ');
        const albumImage = track.album.images.length > 0 ? 
            track.album.images[0].url : 
            'https://via.placeholder.com/600x600?text=Sem+Imagem';
        
        const html = `
            <div class="track-details">
                <div class="track-image">
                    <img src="${albumImage}" alt="${track.name}">
                </div>
                <div class="track-info-detailed">
                    <h2>${track.name}</h2>
                    <p class="artist">Artista: ${artistNames}</p>
                    <p class="album">Álbum: ${track.album.name}</p>
                    <p class="release">Lançamento: ${this.formatDate(track.album.release_date)}</p>
                    <p class="popularity">Popularidade: ${track.popularity}/100</p>
                    <div class="track-preview">
                        ${track.preview_url ? 
                            `<audio controls src="${track.preview_url}"></audio>` : 
                            '<p class="no-preview">Prévia não disponível</p>'}
                    </div>
                    <a href="${track.external_urls.spotify}" target="_blank" class="spotify-link">
                        <i class="fab fa-spotify"></i> Ouvir no Spotify
                    </a>
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Data desconhecida';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(document.documentElement.lang, options);
    }
    
    displayError(message) {
        const infoDisplay = document.getElementById('info-display');
        infoDisplay.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

export {CardMusica}