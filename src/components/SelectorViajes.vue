<template>
  <select v-model="modelo" class="border w-full p-2 rounded" required>
    <option disabled value="">Selecciona un viaje</option>
    <option
      v-for="v in viajes"
      :key="v.codigo"
      :value="v.codigo"
    >
      {{ v.codigo }} - {{ v.denominacion }}
    </option>
  </select>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const modelo = ref(props.modelValue)
const viajes = ref([])

watch(modelo, val => emit('update:modelValue', val))

onMounted(() => {
  viajes.value = JSON.parse(localStorage.getItem('viajes') || '[]')
})
</script>
