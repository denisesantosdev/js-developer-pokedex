const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonModal = document.querySelector(".pokemon-modal");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function getClickedItem(event) {
  const clickedItemName = event.currentTarget
    .querySelector(".name")
    .innerText.toLowerCase();

  pokemonModal.showModal();

  pokeApi.getPokemons(offset, maxRecords).then((pokemons = []) => {
    for (let i = 0; i < pokemons.length; i++) {
      if (clickedItemName === pokemons[i].name) {
        showPokemonDetails(pokemons[i]);
      }
    }
  });
}

function showPokemonDetails(details) {
  console.log(details);
  const types = details.types
    .map((item) => `<span class="${item}">${item}</span>`)
    .join("  ");

  const abilities = details.abilities
    .map((item) => {
      return `<li>${item.ability.name}</li>`;
    })
    .join("");

  pokemonModal.innerHTML = `
    <div class="pokemon-modal-wrapper ${details.type}">
    <button onClick="closePokemonDetails()">X</button>

      <div>
        <h1>${details.name}</h1>
        ${types}
        <p>Weight: ${details.weight}</p>
        <p>Base experience: ${details.base_experience}</p>
        <p>Abilities:</p>
        <ul>
          ${abilities}
        </ul>
      </div>
      <div class="pokemon-img-wrapper">
        <img src="${details.photo}"/>
      </div>
    </div>
  `;
}

function closePokemonDetails() {
  pokemonModal.close();
  pokemonModal.innerHTML = "<h1>Loading</h1>";
}

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" onClick="getClickedItem(event)">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
