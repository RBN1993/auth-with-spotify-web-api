// Evaluamos las variables de hash de la url, las extraemos y las devolvemos en un objeto

function getHashParams() {
  const hashParams = {}
  const r = /([^&;=]+)=?([^&;]*)/g
  const q = window.location.hash.substring(1)

  let e
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2])
  }

  return hashParams
}

export default getHashParams
