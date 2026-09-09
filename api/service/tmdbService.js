const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const fetchFromTMDB = async (endpoint, params = {}) => {
    const searchParams = new URLSearchParams({
        language: 'fi-FI',
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

export { searchMoviesFromTMDB }