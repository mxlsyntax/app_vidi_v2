<template>
  <div class="min-h-screen flex flex-col justify-between bg-white">

    <!-- Cabecera -->
    <Header />
    <!-- CUERPO PRINCIPAL -->
    <div class="flex flex-col items-center mt-12">

      <!-- LOGO -->
      <img src="@/assets/logo_global_grande.png" alt="Logo GlobalSystem" class="w-72 mb-6" />

      <!-- TÍTULO -->
      <h2 class="text-2xl font-bold text-[#002C61] mb-10">Viajes y Dietas</h2>

      <!-- FORMULARIO -->
      <form @submit.prevent="login" class="w-full max-w-sm space-y-8">

        <!-- USUARIO  -->
        <div>
          <div class="flex items-center border-b border-gray-300">
            <input v-model="cdtrabajador" placeholder="Usuario" class="flex-1 outline-none py-2 px-1" />
          </div>
        </div>

        <!-- CONTRASEÑA -->
        <div>
          <div class="flex items-center border-b border-gray-300">
           <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              class="flex-1 outline-none py-2 px-1"
              v-model="password"
            />
            <button @click="togglePassword" class="bg-[#002C61] text-white p-2">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- BOTÓN CONECTAR -->
        <div class="text-center">
          <button type="submit" @click="login" class="w-full bg-[#002C61] text-white p-2 rounded">
            Conectar
          </button>
        </div>

      </form>
    </div>

    <!-- PIE DE PÁGINA -->
    <footer class="bg-[#1E3A4C] w-full py-4 px-6 flex items-center justify-between text-white mt-10 text-sm">
      <div class="text-2xl">📷</div> <!-- Ícono de cámara o escáner -->
      <div class="font-semibold">Versión 1.1.2</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginGSBase } from '../../api/LoginGSBase'
import { useUserStore } from '@/stores/user'
import Header from '@/components/Header.vue'

const router = useRouter()
const cdtrabajador = ref('')
const password = ref('')
const error = ref('')
const user = useUserStore()

const showPassword = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function login() {
  try {
    const res = await loginGSBase(cdtrabajador.value, password.value)

    if (res.resultado === 'ok') {
      user.login({
        codigo: cdtrabajador.value,
        nombreUsuario: res.datos[0],
        tipoTrabajador: res.datos[4]
      })

      router.push('/main')
    } else {
      error.value = res.datos || 'Error en el login'
    }
  } catch (e) {
    error.value = e
  }
}

</script>
