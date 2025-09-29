document.addEventListener("DOMContentLoaded", function() {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    
    if (sidebarPlaceholder) {
        fetch('sidebar.html') // Certifique-se que o nome do arquivo está correto
            .then(response => {
                if (!response.ok) { // Verifica se o fetch deu certo (ex: arquivo não encontrado)
                    throw new Error('Não foi possível carregar o menu.');
                }
                return response.text();
            })
            .then(data => {
                sidebarPlaceholder.innerHTML = data;
                
                // --- INÍCIO DA MELHORIA: Destacar link ativo ---
                const currentPage = window.location.pathname.split('/').pop(); // Pega o nome do arquivo da URL atual (ex: 'semana.html')
                if (currentPage === '' || currentPage === 'index.html') {
                    // Trata o caso da página inicial
                     const homeLink = sidebarPlaceholder.querySelector('a[href="index.html"]');
                     if(homeLink) homeLink.parentElement.classList.add('active');
                } else {
                    const activeLink = sidebarPlaceholder.querySelector(`a[href="${currentPage}"]`);
                    if (activeLink) {
                        activeLink.parentElement.classList.add('active');
                        // Bônus de Acessibilidade: informa aos leitores de tela que esta é a página atual
                        activeLink.setAttribute('aria-current', 'page');
                    }
                }
                // --- FIM DA MELHORIA ---
            })
            .catch(error => {
                console.error('Erro ao carregar o menu:', error);
                // Melhoria de erro: informa o usuário na tela
                sidebarPlaceholder.innerHTML = "<p style='color: red; padding: 15px;'>O menu não pôde ser carregado.</p>";
            });
    }
});
