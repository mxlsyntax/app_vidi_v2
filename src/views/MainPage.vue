<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import logoGlobal from '@/assets/logo_global_grande.png' // ✅ Importación directa
import { useUserStore } from '@/stores/user'
import Header from '@/components/Header.vue'


const router = useRouter()
const user = useUserStore()

function irAVista(destino) {
  router.push('/' + destino)
}

function cerrarSesion() {
  user.logout()
  router.push('/')
}

const fechaActual = computed(() => {
  const hoy = new Date()
  return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-center">
    <!-- Cabecera -->
    <Header />

    <!-- Logo y contenido central -->
    <div class="flex flex-col items-center justify-center flex-1 px-4 py-6">
      <img :src="logoGlobal" alt="globalsystem" class="h-16 md:h-24 mb-4" />

      <div class="border-2 border-[#002C61] rounded-md px-6 py-4 w-fit">
        <h2 class="text-xl font-bold">CARMEN MARIA BERNAL VARCALCEL</h2>
        <p class="text-gray-600">Administrador</p>
        <p class="text-[#002C61] font-semibold mt-2">{{ fechaActual }}</p>
      </div>

      <!-- Botones -->
              <div class="flex flex-col md:flex-row gap-4 w-full mt-5 justify-center items-center">
                <button class="h-20 bg-[#002C61] text-white rounded-xl text-xl font-semibold px-14 min-w-[220px]" @click="irAVista('avisos')">Avisos</button>
                <button class="h-20 bg-[#002C61] text-white rounded-xl text-xl font-semibold px-14 min-w-[220px]" @click="irAVista('viajes')">Viajes</button>
                <button class="h-20 bg-[#002C61] text-white rounded-xl text-xl font-semibold px-14 min-w-[220px]" @click="irAVista('dietas')">Dietas</button>
                <button class="h-20 bg-[#002C61] text-white rounded-xl text-xl font-semibold px-14 min-w-[220px]" @click="irAVista('dietas/nueva')">Nueva Dieta</button>
              </div>
              </div>
    </div>
</template>
