const global = {
  routePage: window.location.pathname,
  search: {
    term: "",
    type: "",
    pages: 1,
    totalPages: 1,
  },
};

console.log(global.routePage);

// ()=> Fetch data from server through API
async function fetchTMDBAPIData(endpoint, atEndPoint = "?", pages = null) {
  const apiURL = "https://api.themoviedb.org/3/";
  const apiKey = "23492f9cdc690249cb219ebeb76e7a05";
  const request = `${apiURL}${endpoint}${atEndPoint}api_key=${apiKey}&language=en-US${
    pages === null ? "" : `&page=${global.search.pages}`
  }`;
  console.log(request);
  const response = await fetch(request);
  const data = response.json();
  return data;
}

// ()=> Set backdrop picture
function setBackgroundBackdrop(show, imagePath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${imagePath})`;
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.15";
  if (show === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// ()=> Show TV Series Details
async function showTvSeriesDetails() {
  showSpinner();
  const seriesID = window.location.search.split("=")[1];
  const seriesDetails = await fetchTMDBAPIData(`tv/${seriesID}`);
  const titleElement = document.querySelector("title");
  titleElement.innerHTML = seriesDetails.name;
  setBackgroundBackdrop("tv", seriesDetails.backdrop_path);
  const divElement = document.createElement("div");
  divElement.innerHTML = `<div class="details-top">
  <div>
    <img
    src="${
      seriesDetails.poster_path
        ? `https://image.tmdb.org/t/p/w500${seriesDetails.poster_path}`
        : "../images/no-image.jpg"
    }"
      class="card-img-top"
      alt="${seriesDetails.original_name}"
    />
  </div>
  <div>
    <h2 class='text-left'>${seriesDetails.original_name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${seriesDetails.vote_average.toFixed(2)} / 10
    </p>
    <p class="text-muted">Release Date: ${seriesDetails.first_air_date}</p>
    <p>
     ${seriesDetails.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${seriesDetails.genres
      .map((element) => `<li>${element.name}</li>`)
      .join("")}
    </ul>
    <a href="${
      seriesDetails.homepage
    }" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      seriesDetails.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${
        seriesDetails.last_episode_to_air.name
      }
    </li>
    <li><span class="text-secondary">Status:</span> Released</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${seriesDetails.production_companies
    .map((element) => element.name)
    .join(", ")}</div>
</div>`;
  document.querySelector("#show-details").appendChild(divElement);
  removeSpinner();
}

// ()=> Show movie details function
async function showMovieDetails() {
  showSpinner();
  const movieID = window.location.search.split("=")[1];
  const movieDetails = await fetchTMDBAPIData(`movie/${movieID}`);
  setBackgroundBackdrop("movie", movieDetails.backdrop_path);
  const titleElement = document.querySelector("title");
  titleElement.innerHTML = movieDetails.original_title;
  const divElement = document.createElement("div");
  divElement.innerHTML = `
  <div class="details-top">
          <div>
            <img
              src="${
                movieDetails.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                  : "../images/no-image.jpg"
              }"
              class="card-img-top"
              alt="${movieDetails.original_title}"
            />
          </div>
          <div>
            <h2 class="text-left">${movieDetails.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movieDetails.vote_average.toFixed(2)} / 10
            </p>
            <p class="text-muted">Release Date: ${movieDetails.release_date}</p>
            <p>
              ${movieDetails.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movieDetails.genres
                .map((element) => `<li>${element.name}</li>`)
                .join("")}
            </ul>
            <a href="${
              movieDetails.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${
              movieDetails.budget
            }</li>
            <li><span class="text-secondary">Revenue:</span> $${
              movieDetails.revenue
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movieDetails.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> Released</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movieDetails.production_companies
            .map((element) => element.name)
            .join(", ")}</div>
        </div>`;
  document.querySelector("#movie-details").appendChild(divElement);
  removeSpinner();
}

// ()=> ShowSpinner
function showSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.add("show");
}

// ()=> Disable Spinner
function removeSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.remove("show");
}

// ()=> function creatediv for movie and tv show popular
function createDiv(element, data) {
  const divElement = document.createElement("div");
  let showName;
  let rDate;
  let showID;
  if (data === "movie") {
    showName = element.title;
    rDate = element.release_date;
    showID = element.id;
  } else {
    showName = element.original_name;
    rDate = element.first_air_date;
    showID = element.id;
  }
  divElement.classList.add("card");
  divElement.innerHTML = `<a href="${data}-details.html?id=${showID}">
      <img
        src="${
          element.poster_path
            ? `https://image.tmdb.org/t/p/w500${element.poster_path}`
            : "../images/no-image.jpg"
        }"
        class="card-img-top"
        alt="${showName}"
      />
    </a>
    <div class="card-body">
      <h5 class="card-title">${showName}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${rDate}</small>
      </p>
    </div>`;
  return divElement;
}

// ()=> Display popular Shwo
async function displayPopularTVShow() {
  showSpinner();
  const data = await fetchTMDBAPIData("tv/popular");
  data.results.forEach((tvshow) => {
    const divElement = createDiv(tvshow, "tv");
    const popularMovie = document.querySelector("#popular-shows");
    popularMovie.appendChild(divElement);
  });
  removeSpinner();
}

// ()=> Display Popular Movie
async function dispalyPopularMovies() {
  showSpinner();
  const data = await fetchTMDBAPIData("movie/popular");
  data.results.forEach((movie) => {
    const divElement = createDiv(movie, "movie");
    const popularMovie = document.querySelector("#popular-movies");
    popularMovie.appendChild(divElement);
  });
  removeSpinner();
}

// ()=> Highlight activated link
function highlightActivatedLink() {
  const navLink = document.querySelectorAll(".nav-link");
  console.log(navLink);
  navLink.forEach((element) => {
    if (element.getAttribute("href") === global.routePage) {
      element.classList.add("active");
    }
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freemode: true,
    loop: true,
    grabCursor: true,
    lazyPreloadPrevNext: 3,
    autoplay: { delay: 5000 },
    breakpoints: {
      500: {
        slidesPerView: 2,
        spaceBetween: 30,
      },

      700: {
        slidesPerView: 3,
        spaceBetween: 30,
      },

      900: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 50,
      },
    },
  });
}

async function displaySliderMovie() {
  const { results } = await fetchTMDBAPIData("movie/now_playing");
  results.forEach((element) => {
    const divElement = document.createElement("div");
    divElement.innerHTML = `<a href="movie-details.html?id=${element.id}">
    <img src="${
      element.poster_path
        ? `https://image.tmdb.org/t/p/w500${element.poster_path}`
        : "../images/no-image.jpg"
    }" alt="${element.original_title}" />
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${element.vote_average.toFixed(
      2
    )} / 10
  </h4>`;
    divElement.classList.add("swiper-slide");
    document.querySelector(".swiper-wrapper").appendChild(divElement);
    initSwiper();
  });
}

async function showSearchForTVShows() {
  const data = await fetchTMDBAPIData(
    `search/tv?query=${global.search.term}`,
    "&",
    2
  );
  global.search.totalPages = data.total_pages;
  const searchElement = document.querySelector("#search-results");
  searchElement.innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  data.results.forEach((element) => {
    const createElement = createDiv(element, "tv");
    searchElement.appendChild(createElement);
  });
  const searchHeader = document.querySelector("#search-results-heading");
  searchHeader.innerHTML = `Showing ${
    20 * global.search.pages - 20 + 1
  } to ${Math.min(data.total_results, 20 * global.search.pages)} from ${
    data.total_results
  } Results`;
  if (data.total_results > 20) {
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");
    paginationDiv.innerHTML = ` <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page 1 of 5</div>`;
    document.querySelector("#pagination").appendChild(paginationDiv);
    const pageCounter = document.querySelector(".page-counter");
    pageCounter.innerHTML = `Page ${global.search.pages} of ${data.total_pages}`;

    //disable button
    if (global.search.pages === 1) {
      document.querySelector("#prev").disabled = true;
    } else if (global.search.pages === global.search.totalPages) {
      document.querySelector("#next").disabled = true;
    }

    document.querySelector("#next").addEventListener("click", showNextPage);
    document.querySelector("#prev").addEventListener("click", showPreviousPage);
  }
}

function showNextPage() {
  global.search.pages += 1;
  if (global.search.type === "movie") {
    showSearchForMovies();
  } else {
    showSearchForTVShows();
  }
}

function showPreviousPage() {
  global.search.pages -= 1;
  if (global.search.type === "movie") {
    showSearchForMovies();
  } else {
    showSearchForTVShows();
  }
}

async function showSearchForMovies() {
  const data = await fetchTMDBAPIData(
    `search/movie?query=${global.search.term}`,
    "&",
    1
  );
  global.search.totalPages = data.total_pages;
  const searchElement = document.querySelector("#search-results");
  searchElement.innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  data.results.forEach((element) => {
    const createElement = createDiv(element, "movie");
    searchElement.appendChild(createElement);
  });
  const searchHeader = document.querySelector("#search-results-heading");
  searchHeader.innerHTML = `Showing ${
    20 * global.search.pages - 20 + 1
  } to ${Math.min(data.total_results, 20 * global.search.pages)} from ${
    data.total_results
  } Results`;
  if (data.total_results > 20) {
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");
    paginationDiv.innerHTML = ` <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page 1 of 5</div>`;
    document.querySelector("#pagination").appendChild(paginationDiv);
    const pageCounter = document.querySelector(".page-counter");
    pageCounter.innerHTML = `Page ${global.search.pages} of ${data.total_pages}`;

    //disable button
    if (global.search.pages === 1) {
      document.querySelector("#prev").disabled = true;
    } else if (global.search.pages === global.search.totalPages) {
      document.querySelector("#next").disabled = true;
    }

    document.querySelector("#next").addEventListener("click", showNextPage);
    document.querySelector("#prev").addEventListener("click", showPreviousPage);
  }
}

// ()=> Search Show List
async function searchShowList() {
  const queryPath = window.location.search;
  const urlPerm = new URLSearchParams(queryPath);
  global.search.type = urlPerm.get("type");
  global.search.term = urlPerm.get("search-term");
  if (global.search.term.trim() === "" || global.search.term.trim() === null) {
    toast = document.querySelector(".toast");
    (closeIcon = document.querySelector(".close")),
      (progress = document.querySelector(".progress"));

    let timer1, timer2;

    toast.classList.add("active");
    progress.classList.add("active");

    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);

    closeIcon.addEventListener("click", () => {
      toast.classList.remove("active");

      setTimeout(() => {
        progress.classList.remove("active");
      }, 300);

      clearTimeout(timer1);
      clearTimeout(timer2);
    });
  } else {
    global.search.pages = 1;
    if (global.search.type === "movie") {
      showSearchForMovies();
    } else {
      showSearchForTVShows();
    }
  }
}

// ()=> Initialize on every page
function init() {
  switch (global.routePage) {
    case "/":
    case "/index.html":
      displaySliderMovie();
      dispalyPopularMovies();
      break;
    case "/movie-details.html":
      showMovieDetails();
      break;
    case "/shows.html":
      displayPopularTVShow();
      break;
    case "/search.html":
      searchShowList();
      break;
    case "/tv-details.html":
      showTvSeriesDetails();
      break;
  }
  highlightActivatedLink();
}

document.addEventListener("DOMContentLoaded", init);
