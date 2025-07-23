<template>
  <!-- Cabecera -->
  <Header />
  <div class="min-h-screen bg-white p-6">

    <h1 class="text-2xl font-bold text-center mb-4">VIAJE. {{ idViaje || 'NUEVO' }}</h1>
    <FormViaje
      v-if="viajeCargado"
      :viaje="viaje"
      :proyectos="proyectos"
      :trabajadores="trabajadores"
      @guardar="guardarViaje"
    />    <!--     <div v-if="!esNuevo && dietasAsociadas.length" class="mt-10">
      <h2 class="text-lg font-semibold mb-2">Dietas asociadas a este viaje</h2>

      <table class="w-full border text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Código</th>
            <th class="border px-2 py-1">Descripción</th>
            <th class="border px-2 py-1">Categoría</th>
            <th class="border px-2 py-1">Importe</th>
            <th class="border px-2 py-1">Fecha</th>
            <th class="border px-2 py-1">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dieta in dietasAsociadas" :key="dieta.cddieta" class="cursor-pointer hover:bg-gray-50"
            @click="verDieta(dieta.cddieta)">
            <td class="border px-2 py-1">{{ dieta.cddieta }}</td>
            <td class="border px-2 py-1">{{ dieta.descripcion_gasto }}</td>
            <td class="border px-2 py-1">{{ dieta.cdcategoria }}</td>
            <td class="border px-2 py-1">{{ dieta.importe }} €</td>
            <td class="border px-2 py-1">{{ dieta.fecha }}</td>
            <td class="border px-2 py-1">{{ dieta.estado_dieta }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-between mt-10 mb-2" v-if="!esNuevo">
        <button @click="crearDietaParaEsteViaje" class="bg-green-600 text-white px-4 py-2 rounded font-semibold">
          + Nueva dieta
        </button>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeRouteUpdate } from 'vue-router'
import Header from '@/components/Header.vue'
import { format_fecha_global } from '@/js/utilidades'
import { obtenerTrabajadores, obtenerProyectos, crearOActualizarViaje, a_devolver_viaje } from '../../api/apiGSBase'
import { useUserStore } from '@/stores/user'
import { Fecha_aNum, format_fecha_local } from '@/js/utilidades'
import FormViaje from '@/components/FormViaje.vue'

const user = useUserStore()
const trabajadores = ref([])
const proyectos = ref([])

const router = useRouter()
const route = useRoute()
const viajeCargado = ref(false)

const idViaje = route.params.id || null  // Aquí obtienes el id de la ruta
const viaje = ref(null) // Estado inicial vacío  
/* const encontrado = viajesMock.find(v => v.codigo === route.params.codigo)

const esNuevo = computed(() => !route.params.codigo)

const dietasAsociadas = ref([])

const viaje = reactive({
  codigo: '',
  denominacion: '',
  deno_proy: '',
  wp: '',
  motivo: '',
  fecha_ini: '',
  fecha_fin: '',
  cdtb: '',
  estado: 'I',
  total: 0,
  estado_viaje: 'Iniciado'
}) */


/* async function guardarViaje() {
  try {
    const datosViaje = {
      codigo: viaje.codigo,
      deno_viaje: viaje.denominacion,
      cdtrab_alta: viaje.cdtb,
      cdProyecto: viaje.cdproy,
      deno_wp: viaje.wp,
      motivo: viaje.motivo,
      origen: viaje.origen,
      destino: viaje.destino,
      fecha_ini: Fecha_aNum(format_fecha_local(viaje.fecha_ini)),
      fecha_fin: Fecha_aNum(format_fecha_local(viaje.fecha_fin)),
      cbx_finalizar: viaje.estado === 'F' ? 1 : 0,
      observaciones: viaje.obs || '',
      lineas_trab: [viaje.cdtb], // si usas trabajadores asociados, pásalos aquí
      tipo_alta: '1' // o el valor correspondiente
    }

    const respuesta = await crearOActualizarViaje(datosViaje)
    alert('Viaje guardado en GSBase: ' + respuesta)
  } catch (err) {
    alert('Error al guardar en GSBase: ' + err)
  }
}

function crearDietaParaEsteViaje() {
  router.push({ path: '/dietas/nueva', query: { cdviaje: viaje.codigo } })
}
onBeforeRouteUpdate((to, from, next) => {
  // Refrescar dietas asociadas si volvemos desde otra página
  const todas = JSON.parse(localStorage.getItem('dietas') || '[]')
  dietasAsociadas.value = todas.filter(d => d.cdviaje === viaje.codigo)
  next()
})

function verDieta(cddieta) {
  router.push(`/dietas/${cddieta}`)
}
 */
onMounted(async () => {
  const idViaje = route.params.codigo

  // Carga proyectos y trabajadores
  proyectos.value = await obtenerProyectos()
  trabajadores.value = await obtenerTrabajadores()

  // Si hay ID de viaje (edición), cargar datos del viaje
  if (idViaje) {
    viaje.value = await a_devolver_viaje({ cdviaje: idViaje })
  } else {
    // Si es un nuevo viaje, inicializa con campos vacíos
    viaje.value = {
      codigo: '',
      deno_viaje: '',
      cdProyecto: '',
      deno_proyecto: '',
      wp: '',
      motivo: '',
      fecha_ini: '',
      fecha_fin: '',
      total: 0,
      codigos_trab: '',
      deno_trabajadores: '',
      estado: '',
      origen: '',
      destino: '',
      observaciones: '',
      lineas_trab: []
    }
  }

  viajeCargado.value = true

  /* const viaje = await a_devolver_viaje({ cdviaje })
  
    if (!esNuevo.value) {
      const encontrado = viajes.find(v => v.codigo === route.params.codigo)
      if (encontrado) {
        Object.assign(viaje, {
          ...encontrado,
          fecha_ini: format_fecha_global(encontrado.fecha_ini),
          fecha_fin: format_fecha_global(encontrado.fecha_fin)
        })
        // 👇 Cargar dietas relacionadas
        const todasDietas = JSON.parse(localStorage.getItem('dietas') || '[]')
        dietasAsociadas.value = todasDietas.filter(d => d.cdviaje === viaje.codigo)
      } else {
        alert('Viaje no encontrado')
        router.push('/viajes')
      }
    } else {
      const codigos = viajes.map(v => parseInt(v.codigo))
      const nuevoCodigo = String(Math.max(0, ...codigos) + 1).padStart(8, '0')
      viaje.codigo = nuevoCodigo
    } */
})
</script>
