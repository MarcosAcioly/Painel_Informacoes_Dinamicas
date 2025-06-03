import { Dashboard } from './components/Dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o dashboard
    const dashboard = new Dashboard();
    
    // Configura o terminal
    setupTerminal();
});

function setupTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            
            if (command) {
                // Adiciona o comando ao output
                terminalOutput.innerHTML += `<p>> ${command}</p>`;
                
                // Processa o comando
                processCommand(command);
                
                // Limpa o input
                terminalInput.value = '';
            }
        }
    });
}

function processCommand(command) {
    const terminalOutput = document.getElementById('terminal-output');
    
    switch (command.toLowerCase()) {
        case 'help':
            terminalOutput.innerHTML += `
                <p>Comandos disponíveis:</p>
                <p>- help: Exibe esta ajuda</p>
                <p>- clear: Limpa o terminal</p>
                <p>- about: Informações sobre o InfoNow</p>
                <p>- services: Lista os serviços disponíveis</p>
            `;
            break;
            
        case 'clear':
            terminalOutput.innerHTML = '';
            break;
            
        case 'about':
            terminalOutput.innerHTML += `
                <p>InfoNow - Painel Multifuncional de Informações</p>
                <p>Versão: 1.0</p>
                <p>Desenvolvido como um projeto modular para exibir informações de diversas APIs.</p>
            `;
            break;
            
        case 'services':
            terminalOutput.innerHTML += `
                <p>Serviços disponíveis:</p>
                <p>- Países: Informações sobre países do mundo</p>
                <p>- Clima: Previsão do tempo para cidades</p>
                <p>- Filmes: Informações sobre filmes</p>
                <p>- Música: Informações sobre músicas e artistas</p>
                <p>- Piadas: Piadas aleatórias em diferentes idiomas</p>
            `;
            break;
            
        default:
            terminalOutput.innerHTML += `<p>Comando não reconhecido. Digite 'help' para ver os comandos disponíveis.</p>`;
    }
    
    // Rola o terminal para o final
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}