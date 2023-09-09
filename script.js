const API_KEY = '29f0b439d5bc8454a555dba16acc0533';
let currentPage = 1;

async function getGenres(language) {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=${language}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.genres; 
} 

async function getPopularMovies(filters, language, page) {
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`;
  
  if (filters.with_genres) {
    url += `&with_genres=${filters.with_genres}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

async function showGenres() {
  const languageSelect = document.getElementById('language');
  const genres = await getGenres(languageSelect.value);

  let output = '';
  genres.forEach(genre => {
    output += `<option value="${genre.id}">${genre.name}</option>`;
  });

  document.getElementById('genres').innerHTML = output;
}

async function showMovies(filters = {}, page = 1) {
  const languageSelect = document.getElementById('language');
  const movies = await getPopularMovies(filters, languageSelect.value, page);

  let output = '';
  movies.forEach(movie => {
    output += `
      <div class="movie">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>  
      </div>
    `;
  });

  document.getElementById('movies').innerHTML = output;
}

document.getElementById('genres').addEventListener('change', async () => {
  currentPage = 1; // Reinicia la página a 1 al cambiar el género
  await showMovies({ with_genres: document.getElementById('genres').value }, currentPage);
  updatePaginationButtons();
});

document.getElementById('prevPage').addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--;
    await showMovies({}, currentPage);
    updatePaginationButtons();
  }
});

document.getElementById('nextPage').addEventListener('click', async () => {
  currentPage++;
  await showMovies({}, currentPage);
  updatePaginationButtons();
});

function updatePaginationButtons() {
  const prevPageButton = document.getElementById('prevPage');
  prevPageButton.disabled = currentPage === 1;

  // Aquí puedes agregar lógica para deshabilitar "Página Siguiente" en la última página si es necesario.
}

showGenres();
showMovies();
