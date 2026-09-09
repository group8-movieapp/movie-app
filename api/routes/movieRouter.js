import express from 'express'
import { searchMovies, nowPlayingMovies } from '../controllers/movieController.js'


const router = express.Router()


router.get('/search', searchMovies)
router.get('/now-playing', nowPlayingMovies) //Muutettu MVC-malliin.

export default router

// Tämä movieRouter.js toimii reittien määrittäjänä MVC-mallissa. 
// Se yhdistää URL-osoitteet oikeisiin Controller-funktioihin: /search ohjaa elokuvahakuun ja /now-playing Suomessa teattereissa olevien elokuvien hakuun. 
// Näin Routerissa ei enää ole varsinaista TMDB-logiikkaa, vaan se ainoastaan ohjaa pyynnöt Controllerille.
//Kuuntelee saapuvia pyyntöjä ja ohjaa ne oikeisiin Controller-funktioihin.