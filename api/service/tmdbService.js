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

const nowPlayingMoviesFromTMDB = async () => { 
    const data = await fetchFromTMDB('/movie/now_playing', { region: 'FI' })
    return data.results
}

// Tämä koodi toimii TMDB:n kanssa kommunikoinnin apuna. 
// `fetchFromTMDB hoitaa yhteisen API-kutsun ja lisää automaattisesti suomen kielen sekä TMDB-tokenin. 
// Sen päälle on tehty omat funktiot elokuvien hakuun (`searchMoviesFromTMDB`) ja Suomessa tällä hetkellä teattereissa olevien elokuvien hakuun (`nowPlayingMoviesFromTMDB`). 
// Lopuksi nämä funktiot viedään `export`-komennolla muiden tiedostojen käytettäväksi.
// Service tekee fetch pyynnön ja palauttaa datan controllerille.


export { searchMoviesFromTMDB, nowPlayingMoviesFromTMDB }