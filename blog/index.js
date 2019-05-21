const express = require('express')
const path = require('path')
const request = require('request')
const querystring = require('querystring')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const generateRandomString = require('./utils/generateRandomString')
const encodeBasic = require('./utils/encodeBasic')
const scopesArray = require('./utils/scopesArray')
const playlistMocks = require('./utils/mocks/playlist')

const { config } = require('./config')

const app = express()

// static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// Middlewares
app.use(cors())
app.use(cookieParser())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// routes
app.get('/', async function(req, res, next) {
  res.render('posts', {
    posts: [
      {
        title: "John's playlist",
        description:
          'Creatine supplementation is the reference compound for increasing muscular creatine levels; there is variability in this increase, however, with some nonresponders.',
        author: 'John Doe'
      }
    ]
  })
})

app.get('/login', (req, res) => {
  const state = generateRandomString(16)

  const queryString = querystring.stringify({
    response_type: 'code',
    client_id: config.spotify_client_id,
    scope: scopesArray.join(' '),
    redirect_uri: config.spotify_redirect_uri,
    state: state
  })
  // Nos aseguramos que la cookie se a httpOnly para que no se pueda acceder desde el cliente
  res.cookie('auth_state', state, { httpOnly: true })
  res.redirect(`https://accounts.spotify.com/authorize?${queryString}`)
})

app.get('/callback', (req, res) => {
  const { code, state } = req.query
  const { auth_state } = req.cookies(state === null || state !== auth_state)
    ? next(new Error('State does not match'))
    : res.clearCookie('auth_state')

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: config.spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization: `Basic ${encodeBasic(
        config.spotify_client_id,
        config.spotify_client_secret
      )}`
    },
    json: true
  }
  request.post(authOptions, (err, response, body) => {
    error || response.status !== 200
      ? next(new Error('Invalid Token'))
      : res.cookie('access_token', body.access_token, { httpOnly: true }) &&
        res.redirect('/playlist')
  })
})

// server
const server = app.listen(3000, function() {
  console.log(`Listening http://localhost:${server.address().port}`)
})
