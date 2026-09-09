import { searchMoviesFromTMDB} from "../service/tmdbService.js"


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

export {searchMovies}