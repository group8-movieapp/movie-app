import express from 'express'
import { 
  postGroup, 
  getGroups, 
  getSingleGroup, 
  removeGroup 
} from '../controllers/groupController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// 1. Hae kaikki ryhmät (näkyy kaikille, ei vaadi authia)
router.get('/', getGroups)

// 2. Luo uusi ryhmä (vaatii kirjautumisen)
router.post('/', auth, postGroup)

// 3. Hae yksittäisen ryhmän tiedot (vaatii kirjautumisen + jäsenyyden tarkistuksen)
router.get('/:id', auth, getSingleGroup)

// 4. Poista ryhmä (vaatii kirjautumisen + omistajuuden tarkistuksen)
router.delete('/:id', auth, removeGroup)

export default router

//Tämä tiedosto määrittelee ryhmien hallintaan liittyvät reitit. Se sisältää reitit ryhmien luomiseen,
// hakemiseen, jäsenyyden tarkistamiseen ja ryhmän poistamiseen.