const source_api = 'https://movie-list.alphacamp.io'
const index_api = source_api + '/api/v1/movies/'
const poster_api = source_api + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach(movie => {
    rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <div class="card" style="width: 18rem">
              <img
                src="${poster_api + movie.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  type="button"
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${movie.id}"
                >
                  More
                </button>
                <button type="button" class="btn btn-danger btn-remove" data-id="${movie.id}">X</button>
              </div>
            </div>
          </div>
        </div>
    `
  })
  // console.log(rawHTML)
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescript = document.querySelector('#movie-modal-descript')

  axios.get(index_api + id).then((response) => {
    const data = response.data.results

    console.log(poster_api + data.image)
    modalTitle.innerText = data.title
    modalImage.src = poster_api + data.image
    modalDate.innerText = `Release date: ` + data.release_date
    modalDescript.innerText = data.description
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if(list.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  
  list.push(movie)
  localStorage.setItem('favriteMovies', JSON.stringify(list))
}

function removeFavorite(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)
  
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

// axios.get(index_api).then((respone) => {
//   // console.log(respone.data.results)  
//   // for (const movie of respone.data.results) {
//   //       movies.push(movie)
//   // }
//   movies.push(...respone.data.results)
//   renderMovieList(movies)
// }).catch((err) => console.log(err))
renderMovieList(movies)

dataPanel.addEventListener('click', function cardClick(event){
  if(event.target.matches('.btn-show-movie')) {
  showMovieModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-remove')){
    removeFavorite(Number(event.target.dataset.id))
  }
})

// search form
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  let filteredMovies = []

  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

  if(filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  renderMovieList(filteredMovies)
})
