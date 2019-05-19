//Codificamos en base 64

const encodeBasic = (username, password) =>
  Buffer.from(`${username}:${password}`).toString('base64')

module.exports = encodeBasic
