<template>
  <div>
    <div class="overflow-x-auto">
      <table class="w-full border text-sm text-left hidden md:table">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Código</th>
            <th class="p-2 border">Denominación</th>
            <th class="p-2 border">Proyecto</th>
            <th class="p-2 border">WP</th>
            <th class="p-2 border">Motivo</th>
            <th class="p-2 border">Inicio</th>
            <th class="p-2 border">Fin</th>
            <th class="p-2 border">Trabajador</th>
            <th class="p-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="viaje in viajes" :key="viaje.codigo" @click="$emit('seleccionarViaje', viaje.codigo)"
            class="cursor-pointer hover:bg-gray-100">
            <td class="p-2 border">{{ viaje.codigo }}</td>
            <td class="p-2 border">{{ viaje.denominacion }}</td>
            <td class="p-2 border">{{ viaje.deno_proy }}</td>
            <td class="p-2 border">{{ viaje.wp }}</td>
            <td class="p-2 border">{{ viaje.motivo }}</td>
            <td class="p-2 border">{{ viaje.fecha_ini }}</td>
            <td class="p-2 border">{{ viaje.fecha_fin }}</td>
            <td class="p-2 border">{{ viaje.deno_trab }}</td>
            <td class="p-2 border">{{ viaje.estado_viaje }}</td>
            <td class="p-2 border">
            </td>
          </tr>
          <tr v-if="viajes.length === 0">
            <td colspan="11" class="text-center p-4">No hay datos para mostrar</td>
          </tr>
        </tbody>
      </table>
      <!-- Vista móvil -->
      <div class="md:hidden">
        <div v-for="viaje in viajes" :key="viaje.codigo" class="border rounded mb-4 p-2 bg-white shadow">
          <div class="flex justify-between py-1"><span class="font-semibold">Código:</span> <span>{{ viaje.codigo
              }}</span></div>
          <div class="flex justify-between py-1"><span class="font-semibold">Denominación:</span> <span>{{
            viaje.denominacion }}</span></div>
          <div class="flex justify-between py-1"><span class="font-semibold">Proyecto:</span> <span>{{ viaje.deno_proy
              }}</span></div>
          <div class="flex justify-between py-1"><span class="font-semibold">WP:</span> <span>{{ viaje.wp }}</span>
          </div>
          <div class="flex justify-between py-1"><span class="font-semibold">Motivo:</span> <span>{{ viaje.motivo
              }}</span></div>
          <div class="flex justify-between py-1"><span class="font-semibold">Inicio:</span> <span>{{ viaje.fecha_ini
              }}</span></div>
          <div class="flex justify-between py-1"><span class="font-semibold">Fin:</span> <span>{{ viaje.fecha_fin
              }}</span></div>
          <div class="flex justify-between py-1"><span class="font-semibold">Trabajador:</span> <span>{{ viaje.deno_trab
              }}</span></div>
          <div class="flex justify-between py-1"><span class="font-semibold">Estado:</span> <span>{{ viaje.estado_viaje
              }}</span></div>
          <div class="flex justify-between py-1">
            <button @click="$router.push(`/viajes/${viaje.codigo}`)" class="text-blue-600 hover:underline">
              Ver
            </button>
          </div>
        </div>
        <div v-if="viajes.length === 0" class="text-center p-4">No hay datos para mostrar</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  viajes: {
    type: Object,
    required: true
  }
})

</script>
