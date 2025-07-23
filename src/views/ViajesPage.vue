<template>
  <!-- Cabecera -->
  <Header />
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Listado de Viajes</h1>

    <div class="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <select v-model="filtros.cdtrabajador" :disabled="!userStore.isAdmin" class="w-full border p-2 rounded">
        <option v-for="trabajador in todosLosTrabajadores" :key="trabajador.cdtrabajador"
          :value="trabajador.cdtrabajador">
          {{ trabajador.nombre }} - ({{ trabajador.cdtrabajador }})
        </option>
      </select>
      <div>
        <label class="block text-sm font-medium">Fecha desde</label>
        <input v-model="filtros.fechaDesde" class="w-full border p-2 rounded" type="date" />
      </div>
      <div>
        <label class="block text-sm font-medium">Fecha hasta</label>
        <input v-model="filtros.fechaHasta" class="w-full border p-2 rounded" type="date" />
      </div>
    </div>

    <button @click="buscarViajes" class="bg-blue-600 text-white px-4 py-2 rounded mb-4">
      Buscar
    </button>

    <TablaViajes :viajes="viajes" @seleccionarViaje="verDetalleViaje" />
  </div>
  <!-- Botón flotante -->
  <button @click="irANuevoViaje"
    class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition">
    Alta+
  </button>

</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import TablaViajes from '@/components/TablaViajes.vue'
import { a_devolver_viajes_param, obtenerTrabajadores } from '../../api/apiGSBase'
import { Num_aFecha, format_fecha_global, Fecha_aNumGuion } from '@/js/utilidades'
import { useUserStore } from '@/stores/user'
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router'

// Refs
const viajes = ref([])
const trabajadores = ref([])
const router = useRouter()
const userStore = useUserStore()
const filtros = reactive({
  cdtrabajador: '',
  fechaDesde: '2025-07-01',
  fechaHasta: '2025-07-31'
})
const esAdmin = ref(userStore.isAdmin)
const todosLosTrabajadores = ref([])

function cerrarSesion() {
  user.logout()
  router.push('/')
}

function verDetalleViaje(codigo) {
  router.push(`/viajes/${codigo}`)
}


function irANuevoViaje() {
  router.push('/viajes/nuevo')
}

// Función para traer viajes desde la API
async function buscarViajes() {

  const cdtrabajador = filtros.cdtrabajador || userStore.cdtrabajador
  const fechaDesde = Fecha_aNumGuion(filtros.fechaDesde)
  const fechaHasta = Fecha_aNumGuion(filtros.fechaHasta)

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
      fecha_ini: format_fecha_global(Num_aFecha(item[6])),
      fecha_fin: format_fecha_global(Num_aFecha(item[7])),
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
    // Si es admin, permite gestionar trabajadores
    try {
      todosLosTrabajadores.value = await obtenerTrabajadores()
    } catch (err) {
      alert('Error al cargar trabajadores: ' + err)
    }

    filtros.cdtrabajador = userStore.cdtrabajador || ''  // o .value si es ref, según cómo accedas

    // Establecer el trabajador logueado como filtro por defecto
    await buscarViajes()
  } catch (err) {
    alert(err)
  }
})


</script>
