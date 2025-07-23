import { conexionBase, urlGSBase } from './configConexion'

export async function loginGSBase(cdtrabajador, password) {
  const arg = JSON.stringify({
    cod_trabajador: cdtrabajador,
    passw: password,
    mac: '',
    version_pda: '',
    cdaplicacion: ''
  })

  const params = {
    ...conexionBase,
    arg,
    accion: 'ejecutar_accion_gsb',
    accion_gsb: 'a_login'
  }

  const url = 'http://localhost/AppWeb/app_vidi_v2/api/funciones.php'

  const res = await fetch(urlGSBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params)
  })

  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    throw `Respuesta inválida: ${text}`
  }
}

