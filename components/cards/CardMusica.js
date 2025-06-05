import { searchMusic, getMusicDetails } from '../../services/MusicService.js';
import { Dashboard } from '../Dashboard.js';

class CardMusica {
    render(container) {
        const html = `
            <div class="card p-3 mb-3" id="music-panel">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" id="music-input" 
                           placeholder="Digite o nome de uma música, artista ou álbum...">
                    <button class="btn btn-primary" id="search-music-btn">
                        <i class="fas fa-search me-2"></i> Buscar
                    </button>
                </div>
            </div>
            <div id="info-display"></div>
        `;
        container.innerHTML = html;
        this.addEventListeners();
    }

    addEventListeners() {
        const searchBtn = document.getElementById('search-music-btn');
        const musicInput = document.getElementById('music-input');

        searchBtn.addEventListener('click', () => {
            const query = musicInput.value.trim();
            if (query) {
                this.searchMusic(query);
            }
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

    async searchMusic(query) {
        const dashboard = new Dashboard();
        dashboard.showLoading();

        try {
            const results = await searchMusic(query);
            this.displaySearchResults(results);
        } catch (error) {
            this.displayError(error.message || 'Erro ao buscar músicas.');
        } finally {
            dashboard.hideLoading();
        }
    }

    displaySearchResults(results) {
        const infoDisplay = document.getElementById('info-display');

        if (results.length > 0) {
            let html = `
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h2 class="h4 mb-0">Resultados da Busca</h2>
                    </div>
                    <div class="card-body">
                        <div class="row row-cols-1 row-cols-md-2 g-4">
            `;

            results.slice(0, 10).forEach(track => {
                html += `
                    <div class="col">
                        <div class="card h-100 track-item" data-id="${track.mbid}">
                            <div class="row g-0">
                                <div class="col-12">
                                    <div class="card-body">
                                        <h3 class="card-title h5">${track.title}</h3>
                                        <p class="card-text text-muted mb-1">${track.artist || ''}</p>
                                        <p class="card-text"><small>${track.release ? 'Álbum: ' + track.release : ''} ${track.date ? ' • ' + track.date : ''}</small></p>
                                        <button class="btn btn-info btn-sm mt-2 ver-detalhes-btn">
                                            <i class="fas fa-info-circle"></i> Ver detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                        </div>
                    </div>
                </div>
            `;
            infoDisplay.innerHTML = html;

            // Adiciona evento de clique para cada faixa para buscar detalhes
            document.querySelectorAll('.track-item').forEach(item => {
                item.querySelector('.ver-detalhes-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const trackId = item.dataset.id;
                    this.getTrackDetails(trackId);
                });
            });
        } else {
            this.displayError('Nenhuma música encontrada com esse termo.');
        }
    }

    async getTrackDetails(trackId) {
        const dashboard = new Dashboard();
        dashboard.showLoading();

        try {
            const details = await getMusicDetails(trackId);
            this.displayTrackDetails(details);
        } catch (error) {
            this.displayError(error.message || 'Erro ao buscar detalhes da música.');
        } finally {
            dashboard.hideLoading();
        }
    }

    displayTrackDetails(details) {
        const infoDisplay = document.getElementById('info-display');
        if (!details || !details.id) {
            this.displayError('Detalhes da música não encontrados.');
            return;
        }
        const artists = details['artist-credit']?.map(a => a.name).join(', ') || '';
        const releases = details.releases?.map(r => `${r.title} (${r.date || 's/d'})`).join('<br>') || 'Nenhum álbum encontrado';
        const html = `
            <div class="track-details">
                <h2>Detalhes da Música</h2>
                <p><strong>Título:</strong> ${details.title}</p>
                <p><strong>Artista(s):</strong> ${artists}</p>
                <p><strong>Álbuns:</strong><br>${releases}</p>
                <p><strong>ID MusicBrainz:</strong> ${details.id}</p>
                <a href="https://musicbrainz.org/recording/${details.id}" target="_blank" class="btn btn-primary btn-sm">
                    Ver no MusicBrainz
                </a>
            </div>
        `;
        infoDisplay.innerHTML = html;
    }

    displayError(message) {
        const infoDisplay = document.getElementById('info-display');
        infoDisplay.innerHTML = `
            <div class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <div>${message}</div>
            </div>
        `;
    }
}

export { CardMusica };