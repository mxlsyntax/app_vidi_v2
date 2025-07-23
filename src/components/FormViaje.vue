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
      <div>
        <label class="font-semibold">Trabajadores participantes:</label>
        <table class="table-auto w-full border mt-2">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-2 py-1">Seleccionado</th>
              <th class="px-2 py-1">Código</th>
              <th class="px-2 py-1">Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trab in trabajadores" :key="trab.codigo" class="border-t">
              <td class="text-center">
                <input
                  type="checkbox"
                  :value="trab.codigo"
                  v-model="viaje.lineas_trab"
                />
              </td>
              <td class="px-2 py-1">{{ trab.codigo }}</td>
              <td class="px-2 py-1">{{ trab.nombre }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón Guardar -->
      <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded mt-4">
        Guardar
      </button>
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import { obtenerProyectos } from '../../api/apiGSBase'

const proyectos = ref([])

const props = defineProps({
  viaje: Object,
  esNuevo: Boolean
})

const emit = defineEmits(['guardar'])

function guardar() {
  emit('guardar')
}
onMounted(async () => {
  try {
    proyectos.value = await obtenerProyectos()
  } catch (err) {
    alert(err)
  }
})

</script>





<!-- <template>
        <form @submit.prevent="guardar" class="space-y-4 max-w-xl">
      <input v-model="viaje.codigo" placeholder="Código" class="border w-full p-2 rounded bg-gray-100 text-gray-600"
        readonly />
      <input v-model="viaje.denominacion" placeholder="Denominación" class="border w-full p-2 rounded" />
      <select v-model="viaje.cdproy" class="border w-full p-2 rounded bg-white">
        <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
          {{ proyecto.denominacion }} ({{ proyecto.id }})
        </option>
      </select>      <input v-model="viaje.wp" placeholder="WP" class="border w-full p-2 rounded" />
      <input v-model="viaje.motivo" placeholder="Motivo" class="border w-full p-2 rounded" />
      <input v-model="viaje.fecha_ini" type="date" class="border w-full p-2 rounded" />
      <input v-model="viaje.fecha_fin" type="date" class="border w-full p-2 rounded" />
      <label class="block text-sm font-medium">Trabajador</label>
      <select v-model="viaje.cdtb" :disabled="!user.isAdmin" class="border w-full p-2 rounded bg-white">
        <option v-for="trabajador in trabajadores" :key="trabajador.codigo" :value="trabajador.codigo">
          {{ trabajador.nombre }} ({{ trabajador.codigo }})
        </option>
      </select>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        {{ esNuevo ? 'Crear' : 'Guardar cambios' }}
      </button>
    </form>
</template>

<script setup>
import { obtenerTrabajadores, obtenerProyectos, crearOActualizarViaje } from '../../api/apiGSBase'
import { useUserStore } from '@/stores/user'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const user = useUserStore()

const esNuevo = computed(() => !route.params.codigo)

const router = useRouter()
const route = useRoute()

const trabajadores = ref([])
const proyectos = ref([])

const props = defineProps({
  viaje: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['guardar'])

const viajeBase = {
  codigo: '',
  deno_viaje: '',
  cdtrab_alta: '',
  cdProyecto: '',
  deno_wp: '',
  motivo: '',
  origen: '',
  destino: '',
  fecha_ini: '',
  fecha_fin: '',
  cbx_finalizar: false,
  observaciones: '',
  lineas_trab: [],
  tipo_alta: ''
}

// Inicializa con props.viaje si existe
const viaje = reactive({ ...viajeBase, ...(props.viaje || {}) })

// ✅ Si props.viaje cambia después, actualiza viajeLocal
watch(
  () => props.viaje,
  (nuevoviaje) => {
    Object.assign(viaje, { ...viaje, ...(nuevoviaje || {}) })
  }
)

function guardar() {
  emit('guardar', { ...viaje })
}



onMounted(async () => {
  try {
    trabajadores.value = await obtenerTrabajadores()
    console.log('Trabajadores obtenidos:', trabajadores.value)
    if (esNuevo.value && !viaje.cdtb) {
      viaje.cdtb = user.cdtrabajador
      viaje.deno_trab = user.nombre
    }
  } catch (error) {
    alert('Error al obtener trabajadores: ' + error)
  }


  if (!esNuevo.value) {
  const viajeData = await crearOActualizarViaje(route.params.codigo)

  if (viajeData && typeof viajeData === 'object') {
    Object.assign(viaje, viajeData)
  } else {
    console.error('Error: los datos del viaje son inválidos', viajeData)
  }
}

})
</script> -->