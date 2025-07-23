<template>
    <header class="bg-[#002C61] text-white px-8 py-5 flex items-center justify-between w-full">
        <div class="flex items-center flex-1">
            <button @click="$router.back()" class="text-white text-3xl font-bold">&larr;</button>
        </div>
        <div class="flex-1 flex justify-center">
            <span class="text-3xl font-bold">{{ tituloPagina }}</span>
        </div>
        <div class="flex items-center flex-1 justify-end space-x-4">
            <span class="text-sm font-semibold">INFO</span>
            <button @click="cerrarSesion" class="text-sm text-white-500">Cerrar sesión</button>
        </div>
    </header>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const user = useUserStore()
const route = useRoute()

const tituloPagina = computed(() => {
  return route.meta?.title || 'Mi Aplicación'
})

function cerrarSesion() {
  user.logout()
  router.push('/')
}
</script>