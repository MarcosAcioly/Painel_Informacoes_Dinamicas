import { JokesService } from '../../services/JokesService.js';
import { Dashboard } from '../Dashboard.js';
class CardPiadas {
    constructor() {
        this.jokesService = new JokesService();
        this.currentJokeType = 'any';
    }
    
    render(container) {
        const html = `
            <div class="search-panel" id="jokes-panel">
                <div class="category-selector">
                    <button class="joke-type-btn active" data-type="any">Qualquer</button>
                    <button class="joke-type-btn" data-type="programming">Programação</button>
                    <button class="joke-type-btn" data-type="pun">Trocadilhos</button>
                    <button class="joke-type-btn" data-type="dark">Humor Negro</button>
                </div>
                <div class="joke-controls">
                    <button id="get-joke-btn"><i class="fas fa-laugh-squint"></i> Nova Piada</button>
                </div>
                <div class="language-selector">
                    <label for="joke-language">Idioma:</label>
                    <select id="joke-language">
                        <option value="pt">Português</option>
                        <option value="en">Inglês</option>
                        <option value="es">Espanhol</option>
                        <option value="fr">Francês</option>
                        <option value="de">Alemão</option>
                    </select>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.addEventListeners();
        this.getJoke();
    }
    
    addEventListeners() {
        const getJokeBtn = document.getElementById('get-joke-btn');
        const jokeTypeButtons = document.querySelectorAll('.joke-type-btn');
        const languageSelect = document.getElementById('joke-language');
        
        getJokeBtn.addEventListener('click', () => {
            this.getJoke();
        });
        
        jokeTypeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove a classe active de todos os botões
                jokeTypeButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona a classe active ao botão clicado
                button.classList.add('active');
                
                // Atualiza o tipo de piada atual
                this.currentJokeType = button.dataset.type;
                
                // Busca uma nova piada
                this.getJoke();
            });
        });
        
        languageSelect.addEventListener('change', () => {
            this.getJoke();
        });
    }
    
    getJoke() {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        const language = document.getElementById('joke-language').value;
        
        this.jokesService.getJoke(this.currentJokeType, language)
            .then(data => {
                this.displayJoke(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    displayJoke(joke) {
        const infoDisplay = document.getElementById('info-display');
        
        let jokeHtml = '';
        
        if (joke.type === 'single') {
            jokeHtml = `
                <div class="joke-card">
                    <div class="joke-content">
                        <p>${joke.joke}</p>
                    </div>
                    <div class="joke-footer">
                        <span class="joke-category">${this.getCategoryName(joke.category)}</span>
                        <div class="joke-actions">
                            <button class="share-btn"><i class="fas fa-share-alt"></i></button>
                            <button class="like-btn"><i class="far fa-thumbs-up"></i></button>
                        </div>
                    </div>
                </div>
            `;
        } else if (joke.type === 'twopart') {
            jokeHtml = `
                <div class="joke-card">
                    <div class="joke-content">
                        <p class="joke-setup">${joke.setup}</p>
                        <p class="joke-delivery">${joke.delivery}</p>
                    </div>
                    <div class="joke-footer">
                        <span class="joke-category">${this.getCategoryName(joke.category)}</span>
                        <div class="joke-actions">
                            <button class="share-btn"><i class="fas fa-share-alt"></i></button>
                            <button class="like-btn"><i class="far fa-thumbs-up"></i></button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        infoDisplay.innerHTML = jokeHtml;
        
        // Adiciona eventos para os botões de ação
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
                if (likeBtn.classList.contains('liked')) {
                    likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i>';
                } else {
                    likeBtn.innerHTML = '<i class="far fa-thumbs-up"></i>';
                }
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
        let jokeText = '';
        
        if (joke.type === 'single') {
            jokeText = joke.joke;
        } else if (joke.type === 'twopart') {
            jokeText = `${joke.setup}\n${joke.delivery}`;
        }
        
        if (navigator.share) {
            navigator.share({
                title: 'Piada do InfoNow',
                text: jokeText
            })
            .catch(error => console.log('Erro ao compartilhar:', error));
        } else {
            // Fallback para navegadores que não suportam a API Web Share
            const textarea = document.createElement('textarea');
            textarea.value = jokeText;
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

export {CardPiadas}