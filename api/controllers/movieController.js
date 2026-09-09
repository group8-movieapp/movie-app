import { searchMoviesFromTMDB, nowPlayingMoviesFromTMDB} from "../service/tmdbService.js"



const searchMovies = async(req, res) => {
    const {query, year, genre} = req.query
    
    try {
        const movies = await searchMoviesFromTMDB(query, year, genre)
        res.json(movies)
    } catch (error) {
        res.status(500).json({
            error: 'Error while searching a movie'
        })
    }
}

const nowPlayingMovies = async(req, res) => { 
    try {
        const movies = await nowPlayingMoviesFromTMDB()
        res.json(movies)
    } catch (error) {
        res.status(500).json({
            error: 'Error while fetching now playing movies'
        })
    }
}

export {searchMovies, nowPlayingMovies}


// searchMovies‑funktio hakee elokuvia TMDB:stä käyttäjän antamien hakuehtojen (query, year, genre) perusteella ja palauttaa ne JSON‑muodossa. 
// nowPlayingMovies‑funktio puolestaan kutsuu palvelukerroksen nowPlayingMoviesFromTMDB‑metodia ja palauttaa tällä hetkellä teattereissa olevat elokuvat. 
// Molemmat funktiot käsittelevät virheet palauttamalla 500‑statuskoodin.
// Eli käytännössä virheen käsittelyä. 
// Käsittelee http pyynnön ja vastauksen ja pyytää tarvittavan dataserviceltä ja lähettää vastauksen takaisin käyttäjälle JSON-muodossa.