import express from 'express'
import { searchMovies } from '../controllers/movieController.js'

// Ekaksi luodaan Express Router.
// eli routeriin voidaan määritellä elokuviin liittyvät reitit.
const router = express.Router()

// Luodaan GET-reitti osoitteeseen /now-playing.
// Kun movieRouter on index.js:ssä liitetty polkuun /api/movies,
// tämän lopullinen osoite on:
// GET /api/movies/now-playing
router.get('/search', searchMovies)
router.get('/now-playing', async (req, res, next) => {

  // virheen käsittelyy
  try {

    // Lähetetään HTTP-pyyntö TMDB:n API:lle.
    
    const response = await fetch(

      // TMDB:n now_playing-endpoint hakee tällä hetkellä
      // elokuvateattereissa olevia elokuvia SUOMESSA.
      //
      // language=fi-FI pyytää tiedot suomeksi
      // region=FI määrittää alueeksi Suomen.
      'https://api.themoviedb.org/3/movie/now_playing?language=fi-FI&region=FI',

     
      {
        // Lähetetään TMDB:lle tarvittavat HTTP-headerit.
        headers: {

          // TMDB vaatii tunnistautumisen.
          // Token haetaan ympäristömuuttujasta TMDB_TOKEN,
          // joten salaista tokenia ei tarvitse kirjoittaa suoraan koodiin.
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,

          // Kerrotaan TMDB:lle, että haluamme vastauksen JSON-muodossa.
          accept: 'application/json'
        }
      }
    )

    // Tarkistetaan onnistuiko TMDB-pyyntö.
    // response.ok on true, jos HTTP-vastaus on onnistunut (esim. 200).
    if (!response.ok) {

      // Jos TMDB palauttaa virheen, luodaan virhe,
      // jossa näkyy TMDB:n palauttama HTTP-statuskoodi.
      throw new Error(`TMDB API error: ${response.status}`)
    }

    // Muutetaan TMDB:ltä saatu vastaus JSON-muotoon.
    const data = await response.json()

    // Lähetetään TMDB:ltä saatu data takaisin frontendille JSON-muodossa.
    res.json(data)

  // Jos try-lohkon sisällä tapahtuu virhe, päädytään tänne.
  } catch (error) {

    
    next(error)
  }
})

// Tällä viedään router ulos tästä tiedostosta,
// jotta se voidaan importata esimerkiksi api/index.js-tiedostossa.

//Näiden jälkeen index.js:ssä voidaan liittää tämä router polkuun /api/movies, 
// jolloin kaikki tässä määritellyt reitit ovat käytettävissä osoitteessa /api/movies/...
export default router