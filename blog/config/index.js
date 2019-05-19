require('dotenv').config()

const config = {
  spotify_client_id: procces.env.SPOTIFY_CLIENT_ID,
  spotify_client_secret: procces.env.SPOTIFY_CLIENT_SECRET,
  spotify_redirect_uri: procces.env.SPOTIFY_REDIRECT_URI
}

module.exports = { config }
