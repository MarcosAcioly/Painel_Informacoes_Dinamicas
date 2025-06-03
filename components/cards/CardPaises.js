import { CountriesService } from '../../services/CountriesService.js';
import { Dashboard } from '../Dashboard.js';
class CardPaises {
    constructor(pTitle, pContent, pImage = null) {
        this.pTitle = pTitle;
        this.pContent = pContent;
        this.pImage = pImage;
        this.onClick = null;
        this.element = null; 
    }

    render() {
        const vCard = document.createElement("div");
        vCard.className = "card";
        
        let imageHtml = '';
        if (this.pImage) {
            imageHtml = `<div class="card-image">
                <img src="${this.pImage}" alt="${this.pTitle}">
            </div>`;
        }
        
        vCard.innerHTML = `
            ${imageHtml}
            <div class="card-content">
                <h2>${this.pTitle}</h2>
                <p>${this.pContent}</p>
            </div>
        `;
        
        // Adiciona evento de clique se houver um handler
        if (this.onClick) {
            vCard.addEventListener('click', this.onClick);
        }
        
        this.element = vCard;
        return vCard;
    }
    
    // Método para renderizar em um contêiner específico
    renderTo(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            const cardElement = this.render();
            container.appendChild(cardElement);
        }
        
        return this;
    }
    
    // Método para definir o handler de clique
    setClickHandler(handler) {
        this.onClick = handler;
        return this;
    }
    
    // Método para atualizar o conteúdo do cartão
    update(title, content, image = null) {
        this.pTitle = title || this.pTitle;
        this.pContent = content || this.pContent;
        this.pImage = image || this.pImage;
        
        // Se o elemento já estiver renderizado, atualize-o
        if (this.element) {
            this.element.innerHTML = `
                ${this.pImage ? `<div class="card-image"><img src="${this.pImage}" alt="${this.pTitle}"></div>` : ''}
                <div class="card-content">
                    <h2>${this.pTitle}</h2>
                    <p>${this.pContent}</p>
                </div>
            `;
        }
        
        return this;
    }
}

export { CardPaises };