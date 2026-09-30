const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const fetchFromTMDB = async (endpoint, params = {}) => {
    const searchParams = new URLSearchParams({
        language: 'en-EN',
        ...params
    })

    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            accept: `application/json`
        }
    })

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`)
    }

    return await response.json()
}

const searchMoviesFromTMDB = async (query, year, genre) => {
    const params = { query: query || '' }
    if (year) params.primary_release_year = year
    if (genre) params.primary_genre = genre

    const data = await fetchFromTMDB('/search/movie', params)
    return data.results
}

const nowPlayingMoviesFromTMDB = async () => { 
    const data = await fetchFromTMDB('/movie/now_playing', { region: 'FI' })
    return data.results
}

const getMovieByIdFromTMDB = async (movieId) => {
    const data = await fetchFromTMDB(`/movie/${movieId}`)

    // TMDB's single-movie endpoint returns genres as `genres: [{ id, name }, ...]`,
    // while the search and now-playing endpoints return `genre_ids: [id, ...]`.
    // We normalize to genre_ids here so MovieCard works identically no matter
    // which endpoint a movie object came from.
    return {
        ...data,
        genre_ids: (data.genres || []).map((genre) => genre.id)
    }
}

const discoverMoviesFromTMDB = async (year, genre) => {
    const params = {}
    if (year) params.primary_release_year = year
    if (genre) params.with_genres = genre

    const data = await fetchFromTMDB('/discover/movie', params)
    return data.results
}

export { searchMoviesFromTMDB, nowPlayingMoviesFromTMDB, getMovieByIdFromTMDB, discoverMoviesFromTMDB }