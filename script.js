// Insert your code here
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

function currPage(i) {
  pages(i).style.backgroundColor = "rgba(250, 150, 150, 0.6)";
  pages(i).style.color = "black";
  pages(i).disabled = true;
}

function disableFirst(bool) {
  backBtn.disabled = bool;
  skipFirstBtn.disabled = bool;
}

function disableLast(bool) {
  nextBtn.disabled = bool;
  skipLastBtn.disabled = bool;
}

function pageNumber(i) {
  numberContainer.innerHTML = "";
  let pages = pagination(i, 10);
  for (let j = 0; j < pages.length; j++) {
    numberContainer.innerHTML += `
        <button class="pagination-button page-${
          pages[j] === "..." ? "rest" : pages[j]
        }" ${pages[j] === "..." ? "disabled" : ""}>${pages[j]}</button>
        `;
  }
  currPage(i);
}

function renderPokemon(data) {
  const name = correctName(data.name);
  const types = data.types[0].type.name;
  const id = data.id;
  if (id <= 1010) {
    pokemonContainer.innerHTML += `
        <div class="pokemon ${types}">
        <div class="imgContainer">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${name}" />
        </div>
        <div class="info">
        <div class="id">${id}</div>
        <h3 class="name">${name}</h3>
        <span class="type">Type: <span>${types}</span></span>
        </div>
        </div>`;
  } else renderError(`Pokemon '${searchInput.value}' not found. Try again`);
}

let pokemonID;
let dataID;

const getPokemonData = async (p) => {
  if (i % 101 === 0 && i <= 1010) {
    pageNumber(i / 101);
  }
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
/*
function getData(pokemon) {
  getJSON(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`, "Pokemon not found")
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("error");
      renderError(`Pokemon '${pokemon}' not found. Try again`);
    });
}
*/
function getJSON(url, errorMsg = "Something went wrong!") {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`${errorMsg} (${res.status})`);
    }
    return res.json();
  });
}

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

let searchMade = false;
let page = 1;
let i = 1;
let limit = 101;
setInterval(() => {
  if (i <= limit && i <= 1010) {
    getPokemonData(`${i}`);
    i++;
  }
}, 10);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const pokemon = searchInput.value.toLowerCase();
    pokemonContainer.innerHTML = "";
    getPokemonData(`${pokemon}`);
    disableFirst(false);
    disableLast(false);
    searchInput.value = "";
  }
  numberContainer.innerHTML = "";
  searchMade = true;
  setTimeout(() => {
    pokemonID = Number(document.querySelector(".id").textContent);
    dataID = getJSON(`https://pokeapi.co/api/v2/pokemon/${pokemonID}/`);
    console.log(dataID);
  }, 11);
});

function renderError(errorMsg) {
  const html = `<div class="error">${errorMsg}</div>`;
  pokemonContainer.insertAdjacentHTML("beforeend", html);
}

searchBtn.addEventListener("click", function () {
  const pokemon = searchInput.value.toLowerCase();
  pokemonContainer.innerHTML = "";
  getPokemonData(`${pokemon}`);
  disableFirst(false);
  disableLast(false);
  searchInput.value = "";
  numberContainer.innerHTML = "";
  searchMade = true;
  setTimeout(() => {
    pokemonID = Number(document.querySelector(".id").textContent);
    dataID = getJSON(`https://pokeapi.co/api/v2/pokemon/${pokemonID}/`);
    console.log(dataID);
  }, 11);
});

homeBtn.addEventListener("click", function () {
  pokemonContainer.innerHTML = "";

  i = 1;
  limit = 101;
  disableFirst(true);
  disableLast(false);
  pageButtons();
  searchMade = false;
});

skipFirstBtn.addEventListener("click", function () {
  if (searchMade === true) {
    pokemonContainer.innerHTML = "";
    pokemonID = 1;
    getPokemonData(`${pokemonID}`);
    disableLast(false);
    disableFirst(true);
  } else {
    disableLast(false);
    pokemonContainer.innerHTML = "";
    i = 1;
    limit = 101;
    disableFirst(true);
    pageButtons();
  }
});

skipLastBtn.addEventListener("click", function () {
  if (searchMade === true) {
    pokemonContainer.innerHTML = "";
    pokemonID = 1010;
    getPokemonData(`${pokemonID}`);
    disableFirst(false);
    disableLast(true);
  } else {
    disableFirst(false);
    pokemonContainer.innerHTML = "";
    i = 909;
    limit = 1010;
    disableLast(true);
    pageButtons();
  }
});

nextBtn.addEventListener("click", function () {
  if (searchMade === true) {
    pokemonContainer.innerHTML = "";
    pokemonID += 1;
    getPokemonData(`${pokemonID}`);
    disableFirst(false);
    pokemonID === 1010 ? disableLast(true) : "";
  } else {
    disableFirst(false);

    if (i < 911) {
      limit += 101;
      pokemonContainer.innerHTML = "";
      if (i === 910) {
        disableLast(true);
      }
    }
    pageButtons();
  }
});

backBtn.addEventListener("click", function () {
  if (searchMade === true) {
    pokemonContainer.innerHTML = "";
    pokemonID -= 1;
    getPokemonData(`${pokemonID}`);
    disableLast(false);
    pokemonID === 1 ? disableFirst(true) : "";
  } else {
    disableLast(false);
    if (i >= 101) {
      limit -= 101;
      i -= 202;
      pokemonContainer.innerHTML = "";
      if (i === 1) {
        disableFirst(true);
      }
    }
    pageButtons();
  }
});

function pagination(c, m) {
  var current = c,
    last = m,
    delta = 1,
    left = current - delta,
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

function pageButtons() {
  setTimeout(() => {
    pagination(i / 102, 10).forEach((el) => {
      if (el !== "...") {
        document
          .querySelector(`.page-${el}`)
          .addEventListener("click", function () {
            pokemonContainer.innerHTML = "";
            i = 1 + (el - 1) * 101;
            limit = el * 101;
            disableFirst(false);
            disableLast(false);
            if (el === 1) {
              disableFirst(true);
            }
            if (el === 10) {
              disableLast(true);
            }
            pageButtons();
          });
      }
    });
  }, 1550);
}

disableFirst(true);
pageButtons();
