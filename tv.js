const apiKey = "f50da9e9ea4941b52eb40a06d7cdf431";
const baseURL = "https://api.themoviedb.org";
const imgPath = "https://image.tmdb.org/t/p/original/";
const youtubeAPI = "AIzaSyDpGqvK-KNUEpdQF0kCjL3VhumsS8_THM0";

const apiPaths = {
    fetchTvCategories: `${baseURL}/3/genre/tv/list?api_key=${apiKey}`,
    fetchTVList: (id) => `${baseURL}/3/discover/tv?api_key=${apiKey}&with_genres=${id}`,
    fetchTrendingNow: `${baseURL}/3/trending/tv/day?api_key=${apiKey}&language=en.US`,
    fetchTvTrailer: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeAPI}`
}
function init() {
    fetchTrendingTvShow();
    fetchAndBuildTvGenres();
}
function fetchTrendingTvShow() {
    fetchAndbuildTvSection(apiPaths.fetchTrendingNow, 'Trending Now')
        .then(list => {
            const randomIndex = parseInt(Math.random() * (20 - 1) + 1);
            buildBanner(list[randomIndex]);
        })
        .catch(err => console.error(err))
}

function buildBanner(Tv) {
    const banner = document.getElementById('bannerCont');
    banner.style.backgroundImage = `url(${imgPath}${Tv.backdrop_path})`;
    const div = document.createElement('div');
    div.innerHTML = ` <h2 class="title">${Tv.name}</h2>
    <p class="info">Trending in Tv Shows</p>
    <p class="details">${Tv.overview && Tv.overview.length > 250 ? Tv.overview.slice(0, 250).trim() + "...." : Tv.overview}</p>
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

function fetchAndBuildTvGenres() {
    fetch(apiPaths.fetchTvCategories)
        .then(res => res.json())
        .then(res => {
            const TVcategories = res.genres;
            console.log(TVcategories);
            if (Array.isArray(TVcategories) && TVcategories.length) {
                TVcategories.forEach(category => {
                    fetchAndbuildTvSection(apiPaths.fetchTVList(category.id), category.name);
                })
            }
        })
}
function fetchAndbuildTvSection(fetchURL, categoryName) {
    console.log(fetchURL, categoryName);
    return fetch(fetchURL)
        .then(res => res.json())
        .then(res => {
            const Tvshows = res.results;
            //console.table(res.results)
            if (Array.isArray(Tvshows) && Tvshows.length)
                buildTvSection(Tvshows, categoryName);
            return Tvshows;
        })

        .catch(err => console.error(err))
}

function buildTvSection(list, categoryName) {
    console.log(list, categoryName);
    const TvSect = document.getElementById('tv');
    const TvList = list.map(Tv => {
        return `<img class="movie-image" src="${imgPath}${Tv.backdrop_path}" alt="${Tv.name}" onclick="TvTrailer('${Tv.name}')"></img>
       `;
    }).join('');

    const TvSection = `
    <h2 class="row1-heading">${categoryName}  <span class="explore">Explore All</span></h2>
    <div class="movies-row1">
       ${TvList}
    </div>`
    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = TvSection;
    TvSect.append(div);
}
function TvTrailer(TvName) {
    if (!TvName) return;
    else fetch(apiPaths.fetchTvTrailer(TvName))
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