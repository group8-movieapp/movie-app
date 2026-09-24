import express from 'express'
import { searchMovies, nowPlayingMovies, getMovieDetails } from '../controllers/movieController.js'


const router = express.Router()


router.get('/search', searchMovies)
router.get('/now-playing', nowPlayingMovies) //Muutettu MVC-malliin.
// Rekisteröity vasta /search ja /now-playing jälkeen, jotta ':id' ei nappaa niitä ensin.
router.get('/:id', getMovieDetails)

export default router

// Tämä movieRouter.js toimii reittien määrittäjänä MVC-mallissa. 
// Se yhdistää URL-osoitteet oikeisiin Controller-funktioihin: /search ohjaa elokuvahakuun ja /now-playing Suomessa teattereissa olevien elokuvien hakuun. 
// Näin Routerissa ei enää ole varsinaista TMDB-logiikkaa, vaan se ainoastaan ohjaa pyynnöt Controllerille.
//Kuuntelee saapuvia pyyntöjä ja ohjaa ne oikeisiin Controller-funktioihin.