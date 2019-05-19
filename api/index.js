const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const { config } = require('./config')

const app = express()

// Este middelware permite obtener el json del req.body
app.use(bodyParser.json())

// Vamos a enviar un post, se va a enviar un objeto
app.post('/api/auth/token', (req, res) => {
  const { email, username, name } = req.body
  // sign(<payload with principal claim username[identifier]>,auth_secret_key, options)
  const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret)

  res.json({ access_token: token })
})

const server = app.listen(5000, () =>
  console.log(`Listenig in port: ${server.address().port}`)
)
bodyParser
