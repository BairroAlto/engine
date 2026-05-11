// designations-module.js

/**
 * Módulo de Renderização de Designações de Reunião
 * Organiza as designações por categorias e aplica regras de visibilidade (ex: Servo de Circuito)
 */

const DesignationModule = {
    renderGrouped: async ({ container, userCurrentDesignations = [], allDesignations = [], checkboxCreator }) => {
        // Log para depuração (pode ver no console do navegador se o módulo foi chamado)
        console.log("DesignationModule: Iniciando renderização das designações...");

        if (!container) {
            console.error("DesignationModule: Container não fornecido.");
            return;
        }
        
        // 1. Filtrar apenas as designações de reunião que estão ativas no banco de dados
        const activeReuniao = allDesignations.filter(d => {
            // Verifica se é do tipo reunião
            const matchTipo = d.tipo === 'reuniao';
            // Verifica se o status é verdadeiro (aceita boolean true ou string "true")
            const matchStatus = d.status !== undefined ? (d.status === true || d.status === "true") : true;
            return matchTipo && matchStatus;
        });

        if (activeReuniao.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic; padding: 10px;">Nenhuma designação de reunião ativa encontrada no sistema.</p>';
            return;
        }

        // 2. Agrupar as designações pelo campo 'parte' (Ex: Vida Cristã, Faça seu Melhor...)
        const groups = {};
        activeReuniao.forEach(desig => {
            let parteRaw = desig.parte || 'Outros';
            // Formatação do nome da categoria: Primeira letra Maiúscula, resto minúscula
            let parteFormatada = parteRaw.charAt(0).toUpperCase() + parteRaw.slice(1).toLowerCase();
            
            if (!groups[parteFormatada]) {
                groups[parteFormatada] = [];
            }
            groups[parteFormatada].push(desig);
        });

        // Limpa o conteúdo anterior do container
        container.innerHTML = '';

        // 3. Ordenar as categorias alfabeticamente
        const sortedCategories = Object.keys(groups).sort();

        sortedCategories.forEach(catName => {
            // Criar o Cabeçalho da Categoria
            const header = document.createElement('div');
            header.className = 'category-header';
            // Estilos inline para garantir que o layout não quebre se o CSS principal falhar
            header.style.cssText = `
                width: 100%; 
                font-size: 0.85rem; 
                color: #2c3e50; 
                font-weight: 800;
                margin-top: 15px; 
                margin-bottom: 8px; 
                padding-bottom: 5px;
                border-bottom: 2px solid #e9ecef; 
                text-transform: uppercase; 
                letter-spacing: 1px;
            `;
            header.textContent = catName;
            container.appendChild(header);

            // Criar o wrapper para os checkboxes deste grupo
            const groupDiv = document.createElement('div');
            groupDiv.className = 'checkbox-group';
            groupDiv.style.display = 'flex';
            groupDiv.style.flexWrap = 'wrap';
            groupDiv.style.gap = '8px';
            groupDiv.style.marginBottom = '15px';

            // Ordenar os itens dentro do grupo pelo campo 'ordem' definido no banco
            const sortedItems = groups[catName].sort((a, b) => (a.ordem || 99) - (b.ordem || 99));

            sortedItems.forEach(desig => {
                // Verifica se a pessoa que estamos editando já tem essa designação
                const isChecked = userCurrentDesignations.includes(desig.nome);
                
                // Cria o elemento HTML do checkbox usando a função passada pelo nomes.html
                const checkboxItem = checkboxCreator(desig.nome, 'edit-designacao-reuniao', isChecked);
                
                // --- LÓGICA DE EXCLUSIVIDADE PARA SERVO DE CIRCUITO (SC) ---
                const quemFaz = desig.quemFaz || [];
                
                // REGRA: Se a designação for EXCLUSIVA para o SC (lista contém apenas SC)
                const eExclusivoSC = quemFaz.length === 1 && quemFaz.includes("Servo de Circuito");

                if (eExclusivoSC) {
                    // Adiciona a classe que o nomes.html usa para ocultar/mostrar baseada no privilégio da pessoa
                    checkboxItem.classList.add('designacao-sc-reuniao');
                    // Oculta por padrão (o script no nomes.html decide se mostra após carregar)
                    checkboxItem.style.display = 'none';
                }
                
                groupDiv.appendChild(checkboxItem);
            });

            container.appendChild(groupDiv);
        });

        // Retorna uma promessa resolvida para o .then() no nomes.html funcionar
        return Promise.resolve();
    }
};

// Garante que o objeto esteja disponível globalmente no navegador
window.DesignationModule = DesignationModule;
