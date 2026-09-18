import { compare, hash } from 'bcrypt' //kirjastetaan bcrypt-kirjasto, jota käytetään salasanan hashaukseen
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail } from '../models/userModel.js' // Importataan createUser-funktio userModelista

//Hoitaa käyttäjän rekisteröitymisen. 
//Eli Controller ottaa frontendiltä tulevat käyttäjätiedot, tarkistaa ne ja käsittelee ne ennen kuin ne lähetetään tietokantaan.

const registerUser = async (req, res, next) => { // Luodaan registerUser-funktio, joka käsittelee käyttäjän rekisteröinnin
  try {
    const { username, email, password } = req.body // Otetaan käyttäjän syöttämät tiedot requestin body:stä

    // Tarkistetaan, että kaikki tarvittavat kentät on annettu
    if (!username || !email || !password) {
      const error = new Error('Username, email and password are required')
      error.status = 400
      return next(error)
    }

    // Tarkistetaan sähköpostin muoto
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Sähköpostin muoto on tarkistettu regexillä
      const error = new Error('Wrong email address') // Jos sähköposti ei ole oikeassa muodossa, luodaan virheviesti
      error.status = 400
      return next(error)
    }

    // Tarkistetaan salasanan vähimmäispituus
    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters long') // Jos salasana on liian lyhyt, luodaan virheviesti
      error.status = 400
      return next(error)
    }

    // Salasanassa pitää olla vähintään yksi iso kirjain
    if (!/[A-Z]/.test(password)) {
      const error = new Error(
        'Password must contain at least one uppercase letter'
      )
      error.status = 400
      return next(error)
    }

    // Salasanassa pitää olla vähintään yksi numero
    if (!/[0-9]/.test(password)) {
      const error = new Error(
        'Password must contain at least one number'
      )
      error.status = 400
      return next(error)
    }

    // Muutetaan sähköposti pieniksi kirjaimiksi ja poistetaan ylimääräiset välilyönnit (trim)
    const normalizedEmail = email.trim().toLowerCase()

    // Salataan salasana ennen tietokantaan tallentamista
    const hashedPassword = await hash(password, 10)

    // Tallennetaan käyttäjä tietokantaan
    const user = await createUser(
      username,
      normalizedEmail,
      hashedPassword
    )

    // Palautetaan käyttäjälle vain turvalliset tiedot
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body

    if(!email || !password){
      const error = new Error('Email and password are required')
      error.status = 400
      return next(error)
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await findUserByEmail(normalizedEmail)

    if (!user) {
      const error = new Error('Invalid email or password')
      error.status = 401
      return next(error)
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password')
      error.status = 401
      return next(error)
    }

    const token = jwt.sign(
      {id: user.id, email: user.email, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn: '24h'}
    )

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })

  } catch (error) {
    next(error)
  }
}

export { registerUser, loginUser } // Viedään registerUser-funktio, jotta sitä voidaan käyttää muissa tiedostoissa


//Toimii välikätenä HTTP-pynnön ja tietokannan välillä. Se ottaa vastaan HTTP-pyynnön, 
// käsittelee sen ja välittää tarvittavat tiedot tietokantamallille (userModel.js).

// userController.js sisältää rekisteröitymisen toimintalogiikan: 
// se ottaa käyttäjän lähettämät tiedot, tarkistaa ne, 
// suojaa salasanan ja pyytää modelia tallentamaan käyttäjän tietokantaan.

//Eli tiedot välittyvät seuraavasti: käyttäjä -> userController.js -> userModel.js -> tietokanta.

// Eli koko ketju on:

// Register.jsx on käyttöliittymä, jossa käyttäjä täyttää käyttäjänimen, sähköpostin ja salasanan. Se lähettää tiedot backendille.

// userRouter.js vastaanottaa rekisteröitymispyynnön ja ohjaa sen oikealle controllerille.

// userController.js käsittelee rekisteröitymisen: tarkistaa tiedot, salaa salasanan ja pyytää modelia tallentamaan käyttäjän.

// userModel.js huolehtii tietokantaan liittyvistä SQL-kyselyistä, eli se tallentaa käyttäjän PostgreSQL-tietokantaan.

// db.js muodostaa yhteyden PostgreSQL-tietokantaan ja antaa sen userModel.js:n käyttöön.

// PostgreSQL / movie_db on varsinainen paikka, johon käyttäjän tiedot lopulta tallennetaan.

// Eli koko ketju on:

// Käyttäjä → Register.jsx → userRouter.js → userController.js → userModel.js → db.js → PostgreSQL.
