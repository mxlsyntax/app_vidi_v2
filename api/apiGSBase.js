import { conexionBase, urlGSBase } from './configConexion'
import { useUserStore } from '@/stores/user'

export async function ejecutarAccionGSB(accion_gsb, arg = '{}', parseador = null) {
  const params = {
    ...conexionBase,
    arg,
    accion: 'ejecutar_accion_gsb',
    accion_gsb
  }

  try {
    const res = await fetch(urlGSBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    })

    const text = await res.text()
    const data = JSON.parse(text)

    
    return data
  } catch (err) {
    throw `Error en acción ${accion_gsb}: ${err}`
  }
}

export async function obtenerTrabajadores() {
  try {
    const arg = JSON.stringify({
      cdaplicacion: conexionBase.aplicacion
    })

    const response = await ejecutarAccionGSB('a_leer_trabajadores', arg)

    if (response.resultado === 'ok') {
      return response.datos.map(p => ({
        codigo: p[0],
        nombre: p[1]
      }))
    } else {
      throw response.datos
    }
  } catch (err) {
    throw `Error al obtener trabajadores: ${err}`
  }
}

export async function obtenerProyectos() {
  try {
    const arg = JSON.stringify({
      cdaplicacion: conexionBase.aplicacion
    })

    const response = await ejecutarAccionGSB('a_leer_proyectos', arg)

    if (response.resultado === 'ok') {
      return response.datos.map(p => ({
        codigo: p[0],
        nombre: p[1]
      }))
    } else {
      throw response.datos
    }
  } catch (err) {
    throw `Error al obtener proyectos: ${err}`
  }
}



export async function a_devolver_viajes_param({ cdtrabajador, fechaDesde, fechaHasta }) {
  const arg = JSON.stringify({
    cdtrabajador,
    cdresponsable: cdtrabajador,
    fechaDesde,
    fechaHasta
  })

  return await ejecutarAccionGSB('a_devolver_viajes', arg, datos =>
    datos.map(viaje => ({
      codigo: viaje[0],
      deno_viaje: viaje[1],
      cdProyecto: viaje[2],
      deno_proyecto: viaje[3],
      wp: viaje[4],
      motivo: viaje[5],
      fecha_ini: viaje[6],
      fecha_fin: viaje[7],
      total: viaje[8],
      codigos_trab: viaje[9],
      deno_trabajadores: viaje[10],
      estado: viaje[11],
      origen: viaje[12],
      destino: viaje[13],
      observaciones: viaje[14]
    }))
  )
}

export async function a_devolver_viaje({ cdviaje }) {
  const user = useUserStore()

  const arg = JSON.stringify({
    cdaplicacion: conexionBase.aplicacion,
    cdviaje,
    cdtrabajador: user.cdtrabajador
  })

  return await ejecutarAccionGSB('a_leer_viaje', arg, datos => {
    const viaje = datos[0] // asumimos que solo viene 1
    return {
      codigo: viaje[0],
      deno_viaje: viaje[1],
      cdProyecto: viaje[2],
      deno_proyecto: viaje[3],
      wp: viaje[4],
      motivo: viaje[5],
      fecha_ini: viaje[6],
      fecha_fin: viaje[7],
      total: viaje[8],
      codigos_trab: viaje[9],
      deno_trabajadores: viaje[10],
      estado: viaje[11],
      origen: viaje[12],
      destino: viaje[13],
      observaciones: viaje[14]
    }
  })
}

export async function crearOActualizarViaje(datosViaje) {
  const {
    codigo,
    deno_viaje,
    cdtrab_alta,
    cdProyecto,
    deno_wp,
    motivo,
    origen,
    destino,
    fecha_ini,
    fecha_fin,
    cbx_finalizar,
    observaciones,
    lineas_trab,
    tipo_alta
  } = datosViaje

  const arg = JSON.stringify({
    cdaplicacion: conexionBase.aplicacion,
    codigo,
    deno_viaje,
    cdtrab_alta,
    cdProyecto,
    deno_wp,
    motivo,
    origen,
    destino,
    fecha_ini,
    fecha_fin,
    cbx_finalizar,
    observaciones,
    lineas_trab,
    tipo_alta
  })

  const params = {
    ...conexionBase,
    arg,
    accion: 'ejecutar_accion_gsb',
    accion_gsb: 'a_crear_viaje'
  }

  const res = await fetch(urlGSBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  })

  const text = await res.text()
  try {
    const json = JSON.parse(text)
    if (json.resultado === 'ok') {
      return json.datos
    } else {
      throw json.datos
    }
  } catch (e) {
    throw `Respuesta inválida: ${text}`
  }
}
