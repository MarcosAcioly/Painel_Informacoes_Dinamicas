import { JokesService } from '../../services/JokesService.js';
import { Dashboard } from '../Dashboard.js';

class CardPiadas {
    constructor() {
        this.jokesService = new JokesService();
        this.currentJokeType = 'any';
    }

    render(container) {
        const html = `
            <div class="card p-3 mb-3" id="jokes-panel">
                <div class="card-body">
                    <h2 class="card-title h4 mb-3">Piadas</h2>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label for="joke-category" class="form-label">Categoria:</label>
                            <select id="joke-category" class="form-select">
                                <option value="any">Qualquer</option>
                                <option value="programming">Programação</option>
                                <option value="misc">Diversas</option>
                                <option value="dark">Humor Negro</option>
                                <option value="pun">Trocadilhos</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="joke-language" class="form-label">Idioma:</label>
                            <select id="joke-language" class="form-select">
                                <option value="en">Inglês</option>
                                <option value="pt">Português</option>
                            </select>
                        </div>
                    </div>
                    <button id="get-joke-btn" class="btn btn-primary w-100">
                        <i class="fas fa-laugh-squint me-2"></i>Obter Piada
                    </button>
                    <div id="joke-display" class="mt-3"></div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.addEventListeners();
    }

    addEventListeners() {
        const jokeTypeSelect = document.getElementById('joke-category');
        const languageSelect = document.getElementById('joke-language');
        const getJokeBtn = document.getElementById('get-joke-btn');

        if (jokeTypeSelect) {
            jokeTypeSelect.addEventListener('change', () => {
                this.currentJokeType = jokeTypeSelect.value;
                this.getJoke();
            });
        }

        if (languageSelect) {
            languageSelect.addEventListener('change', () => {
                this.getJoke();
            });
        }

        if (getJokeBtn) {
            getJokeBtn.addEventListener('click', () => this.getJoke());
        }
    }

    getJoke() {
        const dashboard = new Dashboard();
        dashboard.showLoading();

        const languageSelect = document.getElementById('joke-language');
        const categorySelect = document.getElementById('joke-category');

        if (!languageSelect || !categorySelect) {
            this.displayError('Elementos de seleção não encontrados');
            dashboard.hideLoading();
            return;
        }

        const language = languageSelect.value;
        const category = categorySelect.value || this.currentJokeType;

        this.jokesService.getJoke(category, language)
            .then(data => {
                this.displayJoke(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error.message || 'Erro ao obter piada');
                dashboard.hideLoading();
            });
    }

    displayJoke(joke) {
        const infoDisplay = document.getElementById('joke-display');

        if (!infoDisplay) {
            console.error('Elemento "joke-display" não encontrado no DOM.');
            return;
        }

        let jokeHtml = '';

        if (joke.type === 'single') {
            jokeHtml = `
                <div class="card joke-card shadow-sm">
                    <div class="card-body">
                        <p class="card-text mb-3">${joke.joke}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-secondary">${this.getCategoryName(joke.category)}</span>
                            <div class="btn-group">
                                <button class="btn btn-outline-secondary share-btn">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="btn btn-outline-primary like-btn">
                                    <i class="far fa-thumbs-up"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (joke.type === 'twopart') {
            jokeHtml = `
                <div class="card joke-card shadow-sm">
                    <div class="card-body">
                        <p class="card-text mb-3">${joke.setup}</p>
                        <p class="card-text mb-3"><strong>${joke.delivery}</strong></p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-secondary">${this.getCategoryName(joke.category)}</span>
                            <div class="btn-group">
                                <button class="btn btn-outline-secondary share-btn">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="btn btn-outline-primary like-btn">
                                    <i class="far fa-thumbs-up"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        infoDisplay.innerHTML = jokeHtml;
        this.addActionListeners(joke);
    }

    addActionListeners(joke) {
        const shareBtn = document.querySelector('.share-btn');
        const likeBtn = document.querySelector('.like-btn');

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareJoke(joke);
            });
        }

        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                likeBtn.classList.toggle('liked');
                likeBtn.innerHTML = likeBtn.classList.contains('liked')
                    ? '<i class="fas fa-thumbs-up"></i>'
                    : '<i class="far fa-thumbs-up"></i>';
            });
        }
    }

    getCategoryName(category) {
        const categoryMap = {
            'Programming': 'Programação',
            'Misc': 'Diversos',
            'Dark': 'Humor Negro',
            'Pun': 'Trocadilhos',
            'Spooky': 'Assustador',
            'Christmas': 'Natal'
        };

        return categoryMap[category] || category;
    }

    shareJoke(joke) {
        const jokeText = joke.type === 'single' ? joke.joke : `${joke.setup}\n${joke.delivery}`;

        if (navigator.share) {
            navigator.share({
                title: 'Piada do InfoNow',
                text: jokeText
            }).catch(error => console.log('Erro ao compartilhar:', error));
        } else {
            this.copyToClipboard(jokeText);
        }
    }

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            alert('Piada copiada para a área de transferência!');
        } catch (err) {
            console.error('Falha ao copiar texto:', err);
            alert('Não foi possível copiar a piada.');
        }

        document.body.removeChild(textarea);
    }

    displayError(message) {
        const infoDisplay = document.getElementById('joke-display');

        if (!infoDisplay) {
            console.error('Elemento "joke-display" não encontrado no DOM.');
            return;
        }

        infoDisplay.innerHTML = `
            <div class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <div>${message}</div>
            </div>
        `;
    }
}

export { CardPiadas };