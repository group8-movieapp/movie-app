// Tuodaan PostgreSQL-kirjasto
import pkg from 'pg'

// Otetaan Pool käyttöön PostgreSQL-yhteyden hallintaa varten
const { Pool } = pkg

// Luodaan funktio tietokantayhteyden avaamista varten
const openDb = () => {

  // Luodaan uusi yhteyksien pooli PostgreSQL-tietokantaan
  const pool = new Pool({

    // PostgreSQL-käyttäjän nimi
    user: process.env.DB_USER,

    // PostgreSQL-palvelimen osoite
    host: process.env.DB_HOST,

    // Käytettävän tietokannan nimi
    database: process.env.DB_NAME,

    // PostgreSQL-käyttäjän salasana
    password: process.env.DB_PASSWORD,

    // PostgreSQL-tietokannan käyttämä portti
    port: process.env.DB_PORT

  })

  // Palautetaan luotu tietokantayhteys
  return pool
}

// Luodaan tietokantayhteys kutsumalla openDb-funktiota
const pool = openDb()

// Viedään pool muiden backendin tiedostojen käyttöön
export { pool }