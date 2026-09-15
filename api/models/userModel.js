import { pool } from './db.js'
// Tuodaan db.js-tiedostosta pool,
// jonka avulla ollaan yhteydessä PostgreSQL-tietokantaan.


// Luodaan uusi käyttäjä tietokantaan
const createUser = async (username, email, password) => {

  // Suoritetaan SQL-kysely PostgreSQL-tietokannassa
  const result = await pool.query(

     // INSERT lisää uuden käyttäjän users-tauluun
     // $1, $2 ja $3 ovat käyttäjän antamien tietoja.
   
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)

    
     RETURNING id, username, email`,
      // Palautetaan juuri luodun käyttäjän id, username ja email
     // Salasanaa ei palauteta
    // $1 = username
    // $2 = email
    // $3 = password
    [username, email, password]
  )

  // Palautetaan tietokannasta saatu käyttäjä
  return result.rows[0]
}


// Haetaan käyttäjä sähköpostiosoitteen perusteella
// Tätä tarvitaan myös kirjautumiseen yhteydessä, kun tarkistetaan, onko käyttäjä olemassa tietokannassa.
const findUserByEmail = async (email) => {

  // Suoritetaan SQL-kysely tietokannassa
  const result = await pool.query(

    // SELECT hakee käyttäjän users-taulusta,
    // jonka sähköposti vastaa annettua sähköpostia
    'SELECT * FROM users WHERE email = $1',

    // $1 = email
    [email]
  )

  // Palautetaan löydetty käyttäjä
  return result.rows[0]
}


// Viedään funktiot muiden tiedostojen käytettäviksi
export { createUser, findUserByEmail }