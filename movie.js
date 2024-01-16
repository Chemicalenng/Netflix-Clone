const apiKey = "f50da9e9ea4941b52eb40a06d7cdf431";
const baseURL = "https://api.themoviedb.org";
const imgPath = "https://image.tmdb.org/t/p/original/";
const youtubeAPI = "AIzaSyDpGqvK-KNUEpdQF0kCjL3VhumsS8_THM0";

const apiPaths = {
   fetchAllCategories: `${baseURL}/3/genre/movie/list?api_key=${apiKey}`,
   fetchMovieList: (id) => `${baseURL}/3/discover/movie?api_key=${apiKey}&with_genres=${id}`,
   fetchTrendingNow: `${baseURL}/3/trending/all/day?api_key=${apiKey}&language=en.US`,
   fetchMovieTrailer: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeAPI}`

}

function init() {
   fetchTrendingMovie();
   fetchAndBuildAllGenres();
}

function fetchTrendingMovie() {
   fetchAndbuildMoviesSection(apiPaths.fetchTrendingNow, 'Trending Now')
      .then(list => {
         const randomIndex = parseInt(Math.random() * (20 - 1) + 1);
         buildBanner(list[randomIndex]);
      })
      .catch(err => console.error(err))
}

function buildBanner(movie) {
   const banner = document.getElementById('bannerCont');
   banner.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
   const div = document.createElement('div');
   div.innerHTML = ` <h2 class="title">${movie.title || movie.name}</h2>
   <p class="info">Trending in Movies</p>
   <p class="details">${movie.overview && movie.overview.length > 250 ? movie.overview.slice(0, 250).trim() + "...." : movie.overview}</p>
   <div class="buttons-cont">
       <button class="buttons1"><i class="fa-solid fa-play" style="color: #090e15;"></i>Play</button>
       <button class="buttons2"><svg xmlns="http://www.w3.org/2000/svg" height="1em"
               viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
               <style>
                   svg {
                       fill: #fafcff
                   }
               </style>
               <path
                   d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
           </svg>More Info</button>
   </div>`;
   div.className = "banner";
   banner.append(div);

}

function fetchAndBuildAllGenres() {
   fetch(apiPaths.fetchAllCategories)
      .then(res => res.json())
      .then(res => {
         const categories = res.genres;
         if (Array.isArray(categories) && categories.length) {
            categories.forEach(category => {
               fetchAndbuildMoviesSection(apiPaths.fetchMovieList(category.id), category.name);
            })
         }
         // console.log(categories);

      })
}

function fetchAndbuildMoviesSection(fetchURL, categoryName) {
   console.log(fetchURL, categoryName);
   return fetch(fetchURL)
      .then(res => res.json())
      .then(res => {
         // console.table(res.results)
         const movies = res.results;
         if (Array.isArray(movies) && movies.length)
            buildMoviesSection(movies, categoryName);
         return movies;
      })

      .catch(err => console.error(err))
}

function buildMoviesSection(list, categoryName) {
   console.log(list, categoryName);
   const moviesSect = document.getElementById('movies');
   const moviesList = list.map(movie => {
      return `<img class="movie-image" src="${imgPath}${movie.backdrop_path}" alt="${movie.title}" onclick="moviesTrailer('${movie.title}')"></img>
      `;
   }).join('');

   const moviesSection = `
   <h2 class="row1-heading">${categoryName}  <span class="explore">Explore All</span></h2>
   <div class="movies-row1">
      ${moviesList}
   </div>`
   const div = document.createElement('div');
   div.className = "movies-section";
   div.innerHTML = moviesSection;
   moviesSect.append(div);
}

function moviesTrailer(movieName) {
   if (!movieName) return;
   else fetch(apiPaths.fetchMovieTrailer(movieName))
      .then(res => res.json())
      .then(res => {
         console.log(res.items[0]);
         const bestResult = res.items[0];
         const youtubeTrailer = `https://youtube.com/watch?v=${bestResult.id.videoId}`;
         console.log(youtubeTrailer);
         window.open(youtubeTrailer, '_blank')
      })
      .catch(err => console.error(err))
}

window.addEventListener('load', function () {
   init();
   this.window.addEventListener('scroll', function () {
      const header = document.getElementById('header')
      if (this.window.scrollY > 5) header.classList.add('black-backg')
      else header.classList.remove('black-backg');
   })
})