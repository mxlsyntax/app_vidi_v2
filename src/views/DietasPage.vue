<template>
  <div class="min-h-screen bg-white p-4">
    <header class="bg-[#002C61] text-white px-4 py-3 flex items-center justify-between mb-4">
      <button @click="$router.back()" class="text-white text-2xl font-bold">&larr;</button>
      <h1 class="text-lg font-bold">DIETAS</h1>
      <span class="text-sm font-semibold">INFO</span>
    </header>

    <div class="flex justify-between mb-4">
      <input v-model="filtroViaje" placeholder="Filtrar por viaje..." class="border px-2 py-1 rounded w-full max-w-xs" />
      <button @click="nuevaDieta" class="bg-green-600 text-white px-4 py-2 rounded font-semibold ml-4">
        Alta +
      </button>
    </div>

    <table class="min-w-full border text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-2 py-1">Código</th>
          <th class="border px-2 py-1">Viaje</th>
          <th class="border px-2 py-1">Descripción</th>
          <th class="border px-2 py-1">Categoría</th>
          <th class="border px-2 py-1">Importe</th>
          <th class="border px-2 py-1">Fecha</th>
          <th class="border px-2 py-1">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="dieta in dietasFiltradas"
          :key="dieta.cddieta"
          class="cursor-pointer hover:bg-gray-50"
          @click="verDetalle(dieta.cddieta)"
        >
          <td class="border px-2 py-1">{{ dieta.cddieta }}</td>
          <td class="border px-2 py-1">{{ dieta.cdviaje }}</td>
          <td class="border px-2 py-1">{{ dieta.descripcion_gasto }}</td>
          <td class="border px-2 py-1">{{ dieta.cdcategoria }}</td>
          <td class="border px-2 py-1">{{ dieta.importe }} €</td>
          <td class="border px-2 py-1">{{ dieta.fecha }}</td>
          <td class="border px-2 py-1">{{ dieta.estado_dieta }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const filtroViaje = ref('')
const dietas = ref([])

const trabajadorActual = ref('0020') // ID del trabajador logado (por ahora fijo)
const trabajadores = [
  { cd: '0020', nombre: 'CARMEN MARIA BERNAL VARCALCEL' },
  { cd: '0010', nombre: 'ANTONIO PÉREZ GÓMEZ' }
]

const dietasFiltradas = computed(() => {
  if (!filtroViaje.value) return dietas.value
  return dietas.value.filter(d => d.cdviaje.includes(filtroViaje.value))
})

function nuevaDieta() {
  router.push('/dietas/nueva')
}

function verDetalle(cddieta) {
  router.push(`/dietas/${cddieta}`)
}

onMounted(() => {
  const guardadas = JSON.parse(localStorage.getItem('dietas') || '[]')

  if (!guardadas.length) {
    const mock = [
      {
        cddieta: 'D001',
        cdviaje: '00000004',
        descripcion_gasto: 'Hotel Madrid',
        cdcategoria: 'Alojamiento',
        importe: 95.5,
        fecha: '2025-06-20',
        estado_dieta: 'Pendiente'
      },
      {
        cddieta: 'D002',
        cdviaje: '00000001',
        descripcion_gasto: 'Transporte AVE',
        cdcategoria: 'Transporte',
        importe: 45.0,
        fecha: '2025-06-21',
        estado_dieta: 'Aceptada'
      }
    ]
    dietas.value = mock
    localStorage.setItem('dietas', JSON.stringify(mock))
  } else {
    dietas.value = guardadas
  }
})
</script>
