<template>
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
        v-for="dieta in dietas"
        :key="dieta.cddieta"
        class="cursor-pointer hover:bg-gray-50"
        @click="abrir(dieta.cddieta)"
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
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  dietas: Array
})

const router = useRouter()

function abrir(cddieta) {
  router.push(`/dietas/${cddieta}`)
}
</script>
