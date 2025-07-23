<template>
  <!-- Cabecera -->
  <Header />
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Listado de Viajes</h1>

    <div class="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <select v-model="filtroTrabajador" :disabled="!userStore.isAdmin" class="w-full border p-2 rounded">
    <option
      v-for="trabajador in trabajadores"
      :key="trabajador.cdtrabajador"
      :value="trabajador.cdtrabajador"
    >
      {{ trabajador.nombre }} ({{ trabajador.cdtrabajador }})
    </option>
  </select>
      <div>
        <label class="block text-sm font-medium">Fecha desde</label>
        <input v-model="filtroFechaDesde" class="w-full border p-2 rounded" type="date" />
      </div>
      <div>
        <label class="block text-sm font-medium">Fecha hasta</label>
        <input v-model="filtroFechaHasta" class="w-full border p-2 rounded" type="date" />
      </div>
    </div>

    <button @click="buscarViajes" class="bg-blue-600 text-white px-4 py-2 rounded mb-4">
      Buscar
    </button>

    <TablaViajes :viajes="viajes" />
  </div>
  <!-- Botón flotante -->
  <button @click="irANuevoViaje"
    class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition">
    Alta+
  </button>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import TablaViajes from '@/components/TablaViajes.vue'
import { a_devolver_viajes_param, obtenerTrabajadores } from '../../api/apiGSBase'
import { Num_aFecha } from '@/js/utilidades'
import { useUserStore } from '@/stores/user'
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router'

// Refs
const viajes = ref([])
const trabajadores = ref([])
const router = useRouter()
const filtroTrabajador = ref('')
const filtroFechaDesde = ref('2025-07-01')
const filtroFechaHasta = ref('2025-07-15')
const userStore = useUserStore()

// Función auxiliar (formato fecha)
function Fecha_aNum(fechaStr) {
  const [a, m, d] = fechaStr.split('-').map(n => parseInt(n, 10))
  const dias = d - 1 + (m - 1) * 31
  return (a - 2000) * 372 + dias
}

function cerrarSesion() {
  user.logout()
  router.push('/')
}

function irANuevoViaje() {
  router.push('/viajes/nuevo')
}

// Función para traer viajes desde la API
async function buscarViajes() {

  const cdtrabajador = filtroTrabajador.value
  const fechaDesde = Fecha_aNum(filtroFechaDesde.value)
  const fechaHasta = Fecha_aNum(filtroFechaHasta.value)

  try {
    const response = await a_devolver_viajes_param({ cdtrabajador, fechaDesde, fechaHasta })


    if (!response || !response.datos) {
      alert('No se encontraron datos')
      viajes.value = []
      return
    }

    viajes.value = response.datos.map(item => ({
      codigo: item[0],
      denominacion: item[1],
      cdproy: item[2],
      deno_proy: item[3],
      wp: item[4],
      motivo: item[5],
      fecha_ini: Num_aFecha(item[6]),
      fecha_fin: Num_aFecha(item[7]),
      total: item[8],
      cdtb: item[9],
      deno_trab: item[10],
      estado: item[11],
      estado_viaje: item[11] === 'I' ? 'Iniciado' : item[11] === 'F' ? 'Finalizado' : 'Sin estado',
      origen: item[12],
      destino: item[13],
      obs: item[14]
    }))
    localStorage.setItem('viajes', JSON.stringify(viajes.value))

  } catch (error) {
    alert('Error al obtener viajes: ' + error)
  }
}


// Ejecutar al montar
onMounted(async () => {
  try {
    const res = await obtenerTrabajadores()

    const trabajadoresRaw = res.datos
    trabajadores.value = trabajadoresRaw.map(t => ({
      cdtrabajador: t[0],
      nombre: t[1]
    }))

    // Establecer el trabajador logueado como filtro por defecto
    filtroTrabajador.value = userStore.cdtrabajador

    await buscarViajes()
  } catch (err) {
    alert(err)
  }
})


</script>
