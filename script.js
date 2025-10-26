const charactersGrid = document.getElementById('charactersGrid');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');

document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.trim();

    if (searchTerm === '') {
        showEmptyState();
        return;
    } else{
        searchCharacters(searchTerm);
    }
});

async function searchCharacters(searchTerm) {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${searchTerm}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                showError('No se encontraron personajes con ese nombre');
            } else {
                showError('Error al buscar personajes. Intenta nuevamente.');
            }
            return;
        }

        const data = await response.json();
        displayCharacters(data.results);
    } catch (error) {
        showError('Error de conexión.');
    }
}

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
}


function showError(message) {
    hideAllStates();
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function showEmptyState() {
    hideAllStates();
    emptyState.classList.remove('d-none');
}

function hideAllStates() {
    errorMessage.classList.add('d-none');
    emptyState.classList.add('d-none');
    charactersGrid.innerHTML = '';
}