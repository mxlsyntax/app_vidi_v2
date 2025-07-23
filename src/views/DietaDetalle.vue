<template>
      <button @click="$router.back()" class="text-white text-2xl font-bold">&larr;</button>
  <div class="min-h-screen bg-white p-6">
    <h1 class="text-xl font-bold mb-4">
      {{ esNueva ? 'Nueva Dieta' : 'Detalle Dieta ' + dieta.cddieta }}
    </h1>

    <form @submit.prevent="guardarDieta" class="space-y-4 max-w-xl">
      <input v-model="dieta.cddieta" placeholder="Código Dieta" class="border w-full p-2 rounded bg-gray-100 text-gray-600" readonly />
      <div>
        <label class="block font-medium mb-1">Trabajador</label>
        <select
          v-model="dieta.cdtrabajador"
          class="border w-full p-2 rounded"
          :disabled="!isAdmin"
        >
          <option disabled value="">Selecciona un trabajador</option>
          <option
            v-for="t in trabajadores"
            :key="t.cd"
            :value="t.cd"
          >
            {{ t.nombre }}
          </option>
        </select>
      </div>

      <SelectorViajes v-model="dieta.cdviaje" />

      <input v-model="dieta.descripcion_gasto" placeholder="Descripción del gasto" class="border w-full p-2 rounded" required />

      <input v-model="dieta.cdcategoria" placeholder="Categoría" class="border w-full p-2 rounded" />

      <input v-model.number="dieta.importe" type="number" step="0.01" placeholder="Importe (€)" class="border w-full p-2 rounded" required />

      <input v-model="dieta.fecha" type="date" class="border w-full p-2 rounded" required />

      <select v-model="dieta.estado_dieta" class="border w-full p-2 rounded">
        <option value="Pendiente">Pendiente</option>
        <option value="Aceptada">Aceptada</option>
        <option value="Rechazada">Rechazada</option>
      </select>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        {{ esNueva ? 'Crear' : 'Guardar cambios' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SelectorViajes from '@/components/SelectorViajes.vue'
import TablaDietas from '@/components/TablaDietas.vue'

const isAdmin = ref(false)

const router = useRouter()
const route = useRoute()

const esNueva = computed(() => !route.params.cddieta)

const trabajadorActual = ref('0020') // 👈 este vendrá del login en el futuro

const trabajadores = [
  { cd: '0020', nombre: 'CARMEN MARIA BERNAL VARCALCEL' },
  { cd: '0010', nombre: 'ANTONIO PÉREZ GÓMEZ' }
]


const dieta = reactive({
  cddieta: '',
  cdviaje: '',
  descripcion_gasto: '',
  cdcategoria: '',
  importe: 0,
  fecha: '',
  estado_dieta: 'Pendiente'
})

const viajesDisponibles = ref([])

onMounted(() => {
  const viajes = JSON.parse(localStorage.getItem('viajes') || '[]')
  viajesDisponibles.value = viajes

  const todas = JSON.parse(localStorage.getItem('dietas') || '[]')

    if (esNueva.value) {
      const codigos = todas.map(d => parseInt(d.cddieta.replace('D', ''))).filter(n => !isNaN(n))
      const nuevo = codigos.length ? Math.max(...codigos) + 1 : 1
      dieta.cddieta = 'D' + String(nuevo).padStart(3, '0')

      // Prellenar trabajador por defecto
      dieta.cdtrabajador = trabajadorActual.value

      // Prellenar viaje si viene en la URL
      if (route.query.cdviaje) {
        dieta.cdviaje = route.query.cdviaje
      }
    
  } else {
    const encontrada = todas.find(d => d.cddieta === route.params.cddieta)
    if (encontrada) {
      Object.assign(dieta, encontrada)
    } else {
      alert('Dieta no encontrada')
      router.push('/dietas')
    }
  }
})


function guardarDieta() {
  const todas = JSON.parse(localStorage.getItem('dietas') || '[]')

  if (esNueva.value) {
    todas.push({ ...dieta })
  } else {
    const index = todas.findIndex(d => d.cddieta === dieta.cddieta)
    if (index !== -1) {
      todas[index] = { ...dieta }
    }
  }

  localStorage.setItem('dietas', JSON.stringify(todas))
alert(esNueva.value ? 'Dieta creada' : 'Cambios guardados')

if (route.query.cdviaje) {
  router.push(`/viajes/${route.query.cdviaje}`)
} else {
  router.push('/dietas')
}
}
</script>
