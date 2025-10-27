const charactersGrid = document.getElementById('charactersGrid');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');

document.getElementById('searchBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById("searchInput").value.trim()
    const url = `https://rickandmortyapi.com/api/character/?name=${searchTerm}`

    if (searchTerm === '') {
        showEmptyState();
        return;
    } else {
        searchCharacters(url);
    }
});

async function searchCharacters(url) {
    try {
        let allCharacters = [];
        let nextPage = url;

        while (nextPage) {
            const response = await fetch(nextPage);
            
            if (!response.ok) {
                if (response.status === 404) {
                    showError('No se encontraron personajes con ese nombre');
                } else {
                    showError('Error al buscar personajes. Intenta nuevamente.');
                }
                return;
            }

            const data = await response.json();
            allCharacters.push(...data.results);
            nextPage = data.info.next;
        }

        if (allCharacters.length === 0) {
            showError('No se encontraron personajes con ese nombre');
            return;
        }

        displayCharacters(allCharacters);
    } catch (error) {
        showError('Error de conexión.');
    }
};

function displayCharacters(characters) {
    hideAllStates();
    charactersGrid.innerHTML = "";

    characters.forEach(character => {
        let status = `status${character.status}`;
        
        let cardHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="card character-card">
                    <div class="position-relative">
                        <img src="${character.image}" class="card-img-top character-img" alt="${character.name}">
                        <span class="badge ${status} status">
                            ${character.status}
                        </span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${character.name}</h5>
                        <p class="card-text mb-2">
                            <small class="text-muted">
                                <strong>Especie:</strong> ${character.species}<br>
                                <strong>Género:</strong> ${character.gender}
                            </small>
                        </p>
                        <p class="card-text">
                            <small class="text-muted">
                                <strong>Origen:</strong> ${character.origin.name}
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        charactersGrid.innerHTML += cardHTML;
    });

};

function showError(message) {
    hideAllStates();
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
};

function showEmptyState() {
    hideAllStates();
    emptyState.classList.remove('d-none');
};

function hideAllStates() {
    errorMessage.classList.add('d-none');
    emptyState.classList.add('d-none');
    charactersGrid.innerHTML = '';
};