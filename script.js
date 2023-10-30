"use strict";

// Initializing necessary values

let id = 1;
let pageLimit = 12;
let page = 1;
let pokemonID;
let dataID;
let searchMade = false;

// Assigning regular expressions

const pokemonContainer = document.getElementById("pokemonContainer");
const numberContainer = document.getElementById("numbers");
const searchInput = document.querySelector("#search-box");
const searchBtn = document.querySelector("#search");
const homeBtn = document.querySelector(".home");
const nextBtn = document.querySelector("#next");
const backBtn = document.querySelector("#back");
const skipFirstBtn = document.querySelector("#first-page");
const skipLastBtn = document.querySelector("#last-page");

function pages(i) {
  return document.querySelector(`.page-${i}`);
}

// Functions

// Toggle first and last page buttons
function disableFirst(bool) {
  backBtn.disabled = bool;
  skipFirstBtn.disabled = bool;
}

function disableLast(bool) {
  nextBtn.disabled = bool;
  skipLastBtn.disabled = bool;
}

// Fetching API data

function getJSON(url, errorMsg = "Something went wrong!") {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`${errorMsg} (${res.status})`);
    }
    return res.json();
  });
}

function renderError(errorMsg) {
  const html = `<div class="error">${errorMsg}</div>`;
  pokemonContainer.insertAdjacentHTML("beforeend", html);
}

const getPokemonData = async (p) => {
  try {
    const data = await Promise.all([
      getJSON(`https://pokeapi.co/api/v2/pokemon/${p}/`),
    ]);
    renderPokemon(data.flat()[0]);
    return data.flat()[0];
  } catch (error) {
    console.log(error);
    renderError(`Pokemon '${p}' not found. Try again`);
  }
};

// Rendering empty blocks
// Singular
function renderBlock(number) {
  pokemonContainer.innerHTML = `<div class="pokemon" id="pokemon-${number}">
      <div class="imgContainer" id="imgContainer-${number}">
      <img id="img-${number}" src="" alt="" />
      </div>
      <div class="info">
      <div class="id" id="id-${number}">#${String(number).padStart(
    4,
    "0"
  )}</div>
      <h3 class="name" id="name-${number}"></h3>
      <div class="type" id="type-${number}"><div class="types" id="type-name-${number}"></div></div>
      </div>
      </div>`;
}

// Entire page
function renderBlocks(page) {
  id = pageLimit * (page - 1) + 1;
  pokemonContainer.innerHTML = "";
  while (id <= pageLimit * page && id <= 1010) {
    pokemonContainer.innerHTML += `
        <div class="pokemon" id="pokemon-${id}">
        <div class="imgContainer" id="imgContainer-${id}">
        <img id="img-${id}" src="" alt="" />
        </div>
        <div class="info">
        <div class="id" id="id-${id}">#${String(id).padStart(4, "0")}</div>
        <h3 class="name";" id="name-${id}"></h3>
        <div class="type" id="type-${id}"><div class="types" id="type-name-${id}"></div></div>
        </div>
        </div>`;
    id++;
  }
}

// Injecting API data into empty blocks
function renderPokemon(data) {
  // Picking and assigning relevant data from API response: type Object
  const name = correctName(data.name);
  const types = data.types[0].type.name;
  const id = data.id;
  // Injecting data
  document.getElementById(`pokemon-${id}`).classList.add(`${types}`);
  document.getElementById(`name-${id}`).textContent = `${correctName(name)}`;
  for (let j = 0; j < data.types.length; j++) {
    document.getElementById(`type-name-${id}`).innerHTML += `<div class="${
      data.types[j].type.name
    } box" id="type-name-${j}">${correctName(data.types[j].type.name).slice(
      0,
      -1
    )}</div>`;
  }
  document.getElementById(`img-${id}`).alt = `${correctName(name)}`;
  document.getElementById(
    `img-${id}`
  ).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

// Injects an entire page of empty blocks with the relevant data
function loadNewPage(page) {
  id = pageLimit * (page - 1) + 1;
  while (id <= pageLimit * page && id <= 1010) {
    getPokemonData(id);
    pageNumber(page);
    id++;
  }
}

// Transforming input/API data into correct format
function correctName(str) {
  const temp = str.split("-");
  let result = "";
  for (let name of temp) {
    result += name[0].toUpperCase() + name.slice(1) + "-";
  }
  if (result === "Ho-Oh-") return "Ho-Oh";
  if (result === "Farfetch-D-") return "Farfetch'd";
  if (result === "Porygon-2-") return "Porygon-2";
  if (result === "Porygon-Z-") return "Porygon-Z";
  if (result === "Mr-Mime-") return "Mr. Mime";
  if (result === "Wo-Chien-") return "Wo-Chien";
  if (result === "Chi-Yu-") return "Chi-Yu";
  if (result === "Chien-Pao-") return "Chien-Pao";
  if (result === "Ting-Lu-") return "Ting-Lu";
  return result.split("-").join(" ");
}

// Pagination system
// Creates pagination array
function pagination(c, m) {
  var current = c,
    last = m,
    delta = 1,
    left = current - delta - 1,
    right = current + delta + 2,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

// Highlights current page
function currPage(i) {
  pages(i).style.backgroundColor = "rgba(250, 150, 150, 0.6)";
  pages(i).style.color = "black";
  pages(i).disabled = true;
}

// Creates HTML buttons from pagination array values
function pageNumber(i) {
  numberContainer.innerHTML = "";
  let pages = pagination(i, 85);
  for (let j = 0; j < pages.length; j++) {
    numberContainer.innerHTML += `
        <button class="pagination-button page-${
          pages[j] === "..." ? "rest" : pages[j]
        }" ${pages[j] === "..." ? "disabled" : ""}>${pages[j]}</button>
        `;
  }
  currPage(i);
}

// Adds functionality to buttons
function pageButtons() {
  pagination(page, 85).forEach((el) => {
    if (el !== "...") {
      document
        .querySelector(`.page-${el}`)
        .addEventListener("click", function () {
          renderBlocks(el);
          disableFirst(false);
          disableLast(false);
          loadNewPage(el);
          pageNumber(el);
          if (el === 1) {
            disableFirst(true);
          }
          if (el === 85) {
            disableLast(true);
          }
          page = el;
          pageButtons();
          expandPokemon();
        });
    }
  });
}

// Search functionality, displays one block

// Pressing 'Enter' validates the search
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const pokemon = searchInput.value.toLowerCase();
    pokemonContainer.innerHTML = "";
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${errorMsg} (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        renderBlock(data.id);
        pokemonID = data.id;
        pokemonID === 1 ? disableFirst(true) : "";
        pokemonID === 1010 ? disableLast(true) : "";
        document
          .getElementById(`pokemon-${data.id}`)
          .addEventListener("click", function () {
            openModal(data.id);
          });
      });
    getPokemonData(pokemon);
    disableFirst(false);
    disableLast(false);
    searchInput.value = "";
  }
  numberContainer.innerHTML = "";
  searchMade = true;
});

// Clicking on the 'search' button validates the search
searchBtn.addEventListener("click", function () {
  pokemonContainer.innerHTML = "";
  const pokemon = searchInput.value.toLowerCase();
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${errorMsg} (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      renderBlock(data.id);
      pokemonID = data.id;
      pokemonID === 1 ? disableFirst(true) : "";
      pokemonID === 1010 ? disableLast(true) : "";
      document
        .getElementById(`pokemon-${data.id}`)
        .addEventListener("click", function () {
          openModal(data.id);
        });
    });

  getPokemonData(pokemon);
  disableFirst(false);
  disableLast(false);
  searchMade = true;
  searchInput.value = "";
  numberContainer.innerHTML = "";
});

// Returns to the initial page
homeBtn.addEventListener("click", function () {
  page = 1;
  renderBlocks(page);
  disableLast(false);
  disableFirst(true);
  loadNewPage(page);
  searchMade = false;
  pageButtons();
  expandPokemon();
});

// Skips to the first page/pokemon
skipFirstBtn.addEventListener("click", function () {
  if (searchMade === true) {
    pokemonID = 1;
    renderBlock(pokemonID);
    getPokemonData(pokemonID);
    disableLast(false);
    disableFirst(true);
  } else {
    page = 1;
    renderBlocks(page);
    disableLast(false);
    disableFirst(true);
    loadNewPage(page);
    pageButtons();
    expandPokemon();
  }
});

// Skips to the last page/pokemon
skipLastBtn.addEventListener("click", function () {
  if (searchMade === true) {
    pokemonID = 1010;
    renderBlock(pokemonID);
    getPokemonData(pokemonID);
    disableLast(true);
    disableFirst(false);
  } else {
    page = 57;
    renderBlocks(page);
    disableLast(true);
    disableFirst(false);
    loadNewPage(page);
    pageButtons();
    expandPokemon();
  }
});

// Diaplays the next page/pokemon in the list
nextBtn.addEventListener("click", function () {
  disableFirst(false);
  if (searchMade === true) {
    pokemonID++;
    renderBlock(pokemonID);
    getPokemonData(pokemonID);
    pokemonID === 1010 ? disableLast(true) : "";
  } else {
    page++;
    renderBlocks(page);
    page === 85 ? disableLast(true) : "";
    loadNewPage(page);
    pageButtons();
    expandPokemon();
  }
});

// Displays the previous page/pokemon in the list
backBtn.addEventListener("click", function () {
  disableLast(false);
  if (searchMade === true) {
    pokemonID--;
    renderBlock(pokemonID);
    getPokemonData(pokemonID);
    pokemonID === 1 ? disableFirst(true) : "";
  } else {
    page--;
    page === 1 ? disableFirst(true) : "";
    renderBlocks(page);
    loadNewPage(page);
    pageButtons();
    expandPokemon();
  }
});

// Starting conditions
renderBlocks(page);
loadNewPage(1);
disableFirst(true);
pageButtons();

for (
  let i = pageLimit * (page - 1) + 1;
  i <= pageLimit * page && i <= 1010;
  i++
) {
  document
    .getElementById(`pokemon-${i}`)
    .addEventListener("click", function () {});
}

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");

const openModal = (i) => {
  modal.classList.remove("hidden");
  modal.classList.add("pokemon");
  modal.classList.add(`pokemon-${i}-l`);
  overlay.classList.remove("hidden");
  document.querySelector(
    ".modal"
  ).innerHTML = `<button class="close-modal">&times;</button>
  <div class="title">
  <h3 class="name l" id="name-${i}-l"></h3><div><pre> </pre></div>
    <div class="id l" id="id-${i}-l">#${String(i).padStart(4, "0")}</div>
    </div>
      <div class="imgContainer l" id="imgContainer-${i}-l">
      <img class="img l" id="img-${i}-l" src="" alt="" />
      <div class="type l" id="type-${i}-l"></div>
      </div>
      <div class="info l">
      <div class="column-1">
      <ul>
      <li>
      <span class="attribute height l" id="height-${i}">Height: </br></span> 
      <span class="value"><span id="height-${i}-l"></span>cm</span>
      </li>
      <li>
      <span class="attribute weight l" id="weight-${i}">Weight: </br></span>
      <span class="value"><span id="weight-${i}-l"></span>kg</span>
      </li>
      <li>
      <span class="attribute abilities l" id="abilities-${i}">Abilities: </br></span>
      <span class="value"><span id="abilities-${i}-l-0"></span></br></span>
      <span class="value"><span id="abilities-${i}-l-1"></span></span>
      </li>
      </ul>
      </div>
      <div class="column-2">
      <ul>
      <li>
      <span class="attribute hp l" id="hp-${i}">HP: </br></span>
      <span class="value"><span id="hp-${i}-l"></span></span>
      </li>
      <li>
      <span class="attribute attack l" id="attack-${i}">Attack: </br></span>
      <span class="value"><span id="attack-${i}-l"></span></span>
      </li>
      <li>
      <span class="attribute defense l" id="defense-${i}">Defense: </br></span>
      <span class="value"><span id="defense-${i}-l"></span></span>
      </li>
      <li>
      <span class="attribute special-attack l" id="special-attack-${i}">Special-attack: </br></span>
      <span class="value"><span id="special-attack-${i}-l"></span></span>
      </li>
      <li>
      <span class="attribute special-defense l" id="special-defense-${i}">Special-defense: </br></span>
      <span class="value"><span id="special-defense-${i}-l"></span></span>
      </li>
      <li>
      <span class="attribute speed l" id="speed-${i}">Speed: </br></span>
      <span class="value"><span id="speed-${i}-l"></span></span>
      </li>
      </ul>
      </div>
      </div>`;

  fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${errorMsg} (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById(`name-${data.id}-l`).textContent = `${correctName(
        data.name
      )}`;
      for (let j = 0; j < data.types.length; j++) {
        document.getElementById(
          `type-${data.id}-l`
        ).innerHTML += `<div class="${
          data.types[j].type.name
        } box l" id="type-name-${j}">${correctName(
          data.types[j].type.name
        )}</div>`;
      }
      document.getElementById(`img-${data.id}-l`).alt = `${correctName(
        data.name
      )}`;
      document.getElementById(
        `img-${data.id}-l`
      ).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
      document.getElementById(`height-${data.id}-l`).textContent =
        data.height * 10;
      document.getElementById(`weight-${data.id}-l`).textContent =
        data.weight / 10;
      for (let j = 0; j < data.abilities.length; j++) {
        if (data.abilities[j].is_hidden !== true) {
          document.getElementById(`abilities-${data.id}-l-${j}`).textContent +=
            correctName(data.abilities[j].ability.name);
        }
        document.getElementById(`hp-${data.id}-l`).textContent =
          data.stats[0].base_stat;
        document.getElementById(`attack-${data.id}-l`).textContent =
          data.stats[1].base_stat;
        document.getElementById(`defense-${data.id}-l`).textContent =
          data.stats[2].base_stat;
        document.getElementById(`special-attack-${data.id}-l`).textContent =
          data.stats[3].base_stat;
        document.getElementById(`special-defense-${data.id}-l`).textContent =
          data.stats[4].base_stat;
        document.getElementById(`speed-${data.id}-l`).textContent =
          data.stats[5].base_stat;
        const btnCloseModal = document.querySelector(".close-modal");
        btnCloseModal.addEventListener("click", closeModal);
      }
    });
};

const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  for (
    let i = pageLimit * (page - 1) + 1;
    i <= pageLimit * page && i <= 1010;
    i++
  ) {
    modal.classList.remove(`pokemon-${i}-l`);
  }
};
function expandPokemon() {
  for (
    let i = pageLimit * (page - 1) + 1;
    i <= pageLimit * page && i <= 1010;
    i++
  ) {
    document
      .getElementById(`pokemon-${i}`)
      .addEventListener("click", function () {
        openModal(i);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  }
}

expandPokemon();

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
