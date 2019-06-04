const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const request = require('request')
const { config } = require('./config')
const encodeBasic = require('./utils/encodeBasic')

const app = express()

// Este middelware permite obtener el json del req.body
app.use(bodyParser.json())

// Recibe el token y llama al endpoint de spotify para obtener los playlist
function getUserPlaylists(accessToken, userId) {
  if (!accessToken || !userId) {
    return Promise.resolve(null)
  }

  const options = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  }

  return new Promise((resolve, reject) => {
    request.get(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error)
      }

      resolve(body)
    })
  })
}

// Vamos a enviar un post, se va a enviar un objeto
app.post('/api/auth/token', (req, res) => {
  const { email, username, name } = req.body
  // sign(<payload with principal claim username[identifier]>,auth_secret_key, options)
  const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret)

  res.json({ access_token: token })
})

app.get('/api/auth/verify', (req, res, next) => {
  const { access_token } = req.query
  try {
    const decoded = jwt.verify(access_token, config.authJwtSecret)
    res.json({ message: 'Access token is valid', username: decoded.sub })
  } catch (error) {
    // Con next invocamos el manejador de errores por defecto de express, un html
    next(error)
  }
})

// Listamos los playlist
app.get('/api/playlists', async function(req, res, next) {
  const { userId } = req.query

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${encodeBasic(
        config.spotifyClientId,
        config.spotifyClientSecret
      )}`
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  }

  request.post(authOptions, async function(error, response, body) {
    if (error || response.statusCode !== 200) {
      next(error)
    }
    // No hace falta almacenar el token poque por cada llamada que hacemos
    // requerimos un nuevo token
    const accessToken = body.access_token
    try {
      const userPlaylists = await getUserPlaylists(accessToken, userId)

      res.json({ playlists: userPlaylists })
    } catch (error) {
      next(error)
    }
  })
})

const server = app.listen(5000, () =>
  console.log(`Listenig in port: ${server.address().port}`)
)
bodyParser
