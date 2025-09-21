document.addEventListener("DOMContentLoaded", function() {
    // Encontra o elemento que servirá como container para o menu
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    
    // Se o container existir, busca o conteúdo de sidebar.html
    if (sidebarPlaceholder) {
        fetch('sidebar.html')
            .then(response => response.text())
            .then(data => {
                // Insere o HTML do menu dentro do container
                sidebarPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar o menu:', error));
    }
});
