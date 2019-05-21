require('dotenv').config()

const config = {
  spotify_client_id: process.env.SPOTIFY_CLIENT_ID,
  spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  spotify_redirect_uri: process.env.SPOTIFY_REDIRECT_URI
}

module.exports = { config }
