require('dotenv').config()

// En el lado del cliente no tenemos manera de leer las cadenas de las variables de entorno al usar next
// por lo que reemplazamos la cadena por el valor real
const env = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_REDIRECT_URI']

function buildEnvConfig(acc, cur) {
  return { ...acc, [`process.env.${cur}`]: process.env[cur] }
}

module.exports = env.reduce(buildEnvConfig, {})
