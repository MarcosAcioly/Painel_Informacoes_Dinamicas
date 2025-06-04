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
        vCard.className = "card shadow-sm h-100";
        
        let imageHtml = '';
        if (this.pImage) {
            imageHtml = `
                <div class="card-img-top">
                    <img src="${this.pImage}" class="img-fluid w-100" alt="${this.pTitle}">
                </div>`;
        }
        
        vCard.innerHTML = `
            ${imageHtml}
            <div class="card-body">
                <h2 class="card-title h5 mb-3">${this.pTitle}</h2>
                <p class="card-text">${this.pContent}</p>
            </div>
        `;
        
        if (this.onClick) {
            vCard.classList.add('cursor-pointer');
            vCard.addEventListener('click', this.onClick);
        }
        
        this.element = vCard;
        return vCard;
    }
    
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
    
    setClickHandler(handler) {
        this.onClick = handler;
        return this;
    }
    
    update(title, content, image = null) {
        this.pTitle = title || this.pTitle;
        this.pContent = content || this.pContent;
        this.pImage = image || this.pImage;
        
        if (this.element) {
            this.element.innerHTML = `
                ${this.pImage ? `
                    <div class="card-img-top">
                        <img src="${this.pImage}" class="img-fluid w-100" alt="${this.pTitle}">
                    </div>` : ''
                }
                <div class="card-body">
                    <h2 class="card-title h5 mb-3">${this.pTitle}</h2>
                    <p class="card-text">${this.pContent}</p>
                </div>
            `;
        }
        
        return this;
    }
}

// Add custom CSS for cursor pointer
const style = document.createElement('style');
style.textContent = `
    .cursor-pointer {
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
    }
    .cursor-pointer:hover {
        transform: translateY(-5px);
    }
`;
document.head.appendChild(style);

export { CardPaises };