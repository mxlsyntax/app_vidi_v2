<template>
  <Header />
  <div class="min-h-screen bg-white p-6">
    <h1 class="text-xl font-bold mb-4">
      {{ esNuevo ? 'Nuevo Viaje' : 'Detalle del Viaje ' + viaje.codigo }}
    </h1>

    <FormViaje :viaje="viaje" :esNuevo="esNuevo" @guardar="guardarViaje" />

    <!-- Dietas asociadas -->
    <div v-if="!esNuevo && dietasAsociadas.length" class="mt-10">
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
          <tr
            v-for="dieta in dietasAsociadas"
            :key="dieta.cddieta"
            class="cursor-pointer hover:bg-gray-50"
            @click="verDieta(dieta.cddieta)"
          >
            <td class="border px-2 py-1">{{ dieta.cddieta }}</td>
            <td class="border px-2 py-1">{{ dieta.descripcion_gasto }}</td>
            <td class="border px-2 py-1">{{ dieta.cdcategoria }}</td>
            <td class="border px-2 py-1">{{ dieta.importe }} €</td>
            <td class="border px-2 py-1">{{ dieta.fecha }}</td>
            <td class="border px-2 py-1">{{ dieta.estado_dieta }}</td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between mt-6">
        <button
          @click="crearDietaParaEsteViaje"
          class="bg-green-600 text-white px-4 py-2 rounded font-semibold"
        >
          + Nueva dieta
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import FormViaje from '@/components/FormViaje.vue'
import Header from '@/components/Header.vue'

const router = useRouter()
const route = useRoute()

const esNuevo = computed(() => !route.params.codigo)

const viaje = reactive({
  codigo: '',
  denominacion: '',
  cdproy: '',
  wp: '',
  motivo: '',
  fecha_ini: '',
  fecha_fin: '',
  cdtb: '',
  deno_trab: '',
  estado: 'I',
  total: 0,
  estado_viaje: 'Iniciado'
})

const dietasAsociadas = ref([])

onMounted( () => {
  const viajes = JSON.parse(localStorage.getItem('viajes') || '[]')

  if (!esNuevo.value) {
    const encontrado = viajes.find(v => v.codigo === route.params.codigo)
    if (encontrado) {
      Object.assign(viaje, encontrado)
      console.log('Viaje encontrado:', viaje)
      // 👇 Cargar dietas relacionadas
      const todasDietas = JSON.parse(localStorage.getItem('dietas') || '[]')
      dietasAsociadas.value = todasDietas.filter(d => d.cdviaje === viaje.codigo)
    } else {
      alert('Viaje no encontrado')
      router.push('/viajes')
    }
  } else {
    // Crear nuevo código
    const codigos = viajes.map(v => parseInt(v.codigo))
    const nuevoCodigo = String(Math.max(0, ...codigos) + 1).padStart(8, '0')
    viaje.codigo = nuevoCodigo
  }
})

function guardarViaje() {
  const viajesGuardados = JSON.parse(localStorage.getItem('viajes') || '[]')

  if (esNuevo.value) {
    viaje.estado_viaje = viaje.estado === 'I' ? 'Iniciado' : 'Finalizado'
    viajesGuardados.push({ ...viaje })
  } else {
    const index = viajesGuardados.findIndex(v => v.codigo === viaje.codigo)
    if (index !== -1) viajesGuardados[index] = { ...viaje }
  }

  localStorage.setItem('viajes', JSON.stringify(viajesGuardados))
  alert(esNuevo.value ? 'Viaje creado correctamente' : 'Viaje actualizado')
  router.push('/viajes')
}

function verDieta(cddieta) {
  router.push(`/dietas/${cddieta}`)
}

function crearDietaParaEsteViaje() {
  router.push({ path: '/dietas/nueva', query: { cdviaje: viaje.codigo } })
}

// Por si se vuelve desde una dieta y queremos refrescar la tabla
onBeforeRouteUpdate((to, from, next) => {
  const todas = JSON.parse(localStorage.getItem('dietas') || '[]')
  dietasAsociadas.value = todas.filter(d => d.cdviaje === viaje.codigo)
  next()
})
</script>
