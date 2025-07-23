<template>
  <form @submit.prevent="guardar">
    <div class="grid gap-4">

      <!-- Denominación del viaje -->
      <div>
        <label class="font-semibold">Nombre del viaje:</label>
        <input v-model="viaje.denominacion" class="border p-2 w-full" />
      </div>

      <!-- Proyecto (desplegable) -->
      <div>
        <label class="font-semibold">Proyecto:</label>
        <select v-model="viaje.cdproy" class="border w-full p-2 rounded">
          <option disabled value="">Selecciona un proyecto</option>
          <option v-for="p in proyectos" :key="p.codigo" :value="p.codigo">
            {{ p.nombre }}
          </option>
        </select>

      </div>

      <!-- WP -->
      <div>
        <label class="font-semibold">Work Package (WP):</label>
        <input v-model="viaje.wp" class="border p-2 w-full" />
      </div>

      <!-- Origen y destino -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label>Origen:</label>
          <input v-model="viaje.origen" class="border p-2 w-full" />
        </div>
        <div>
          <label>Destino:</label>
          <input v-model="viaje.destino" class="border p-2 w-full" />
        </div>
      </div>

      <!-- Fechas -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label>Fecha inicio:</label>
          <input type="date" v-model="viaje.fecha_ini" class="border p-2 w-full" />
        </div>
        <div>
          <label>Fecha fin:</label>
          <input type="date" v-model="viaje.fecha_fin" class="border p-2 w-full" />
        </div>
      </div>

      <!-- Motivo y observaciones -->
      <div>
        <label>Motivo:</label>
        <textarea v-model="viaje.motivo" class="border p-2 w-full"></textarea>
      </div>
      <div>
        <label>Observaciones:</label>
        <textarea v-model="viaje.observaciones" class="border p-2 w-full"></textarea>
      </div>

      <!-- Tabla de trabajadores -->
      <div class="mt-6">
        <h2 class="text-lg font-semibold mb-2">Trabajadores del viaje</h2>

        <table class="w-full border text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-2 py-1">Código</th>
              <th class="border px-2 py-1">Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trab in trabajadoresViaje" :key="trab.codigo">
              <td class="border px-2 py-1">{{ trab.codigo }}</td>
              <td class="border px-2 py-1">{{ trab.nombre }}</td>
            </tr>
          </tbody>
        </table>

        <button type="button" v-if="esAdmin" @click="mostrarModal = true" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
          + Añadir trabajador
        </button>
      </div>
      <!-- Botón Guardar -->
      <button type="button" @click="añadirTrabajador(trab)">
        Añadir
      </button>

    </div>
  </form>
  <!-- Modal para añadir trabajadores -->
  <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded p-6 w-96 max-h-[80vh] overflow-y-auto">
      <h3 class="text-lg font-bold mb-4">Seleccionar trabajador</h3>

      <ul>
        <li v-for="trab in todosLosTrabajadores" :key="trab.codigo" class="cursor-pointer hover:bg-gray-100 px-2 py-1"
          @click="añadirTrabajador(trab)">
          {{ trab.codigo }} - {{ trab.nombre }}
        </li>
      </ul>

      <button type="button" @click="mostrarModal = false" class="mt-4 bg-gray-300 px-4 py-2 rounded">
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue'
import { obtenerProyectos, obtenerTrabajadores } from '../../api/apiGSBase'
import { useUserStore } from '@/stores/user'

const proyectos = ref([])
const userStore = useUserStore()
const esAdmin = computed(() => userStore.isAdmin)

const trabajadoresViaje = ref([])        // Lista de trabajadores añadidos al viaje
const todosLosTrabajadores = ref([])     // Para el modal de selección
const mostrarModal = ref(false)


const props = defineProps({
  viaje: Object,
  esNuevo: Boolean
})

const emit = defineEmits(['guardar'])

function añadirTrabajador(trab) {
  const yaExiste = trabajadoresViaje.value.some(t => t.codigo === trab.codigo)
  if (!yaExiste) {
    trabajadoresViaje.value.push({ ...trab })
  }
  mostrarModal.value = false
}

function guardar() {
  emit('guardar')
}
onMounted(async () => {
  try {
    proyectos.value = await obtenerProyectos()
  } catch (err) {
    alert(err)
  }
  // Si es admin, permite gestionar trabajadores
  if (esAdmin.value) {
    try {
      todosLosTrabajadores.value = await obtenerTrabajadores()
      console.log('Trabajadores cargados:', todosLosTrabajadores.value)
    } catch (err) {
      alert('Error al cargar trabajadores: ' + err)
    }
  }

  // Carga inicial del trabajador actual si no es admin
  if (!esAdmin.value && trabajadoresViaje.value.length === 0) {
    trabajadoresViaje.value.push({
      codigo: userStore.cdtrabajador,
      nombre: userStore.nombre
    })
  }

})

</script>
