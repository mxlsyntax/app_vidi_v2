// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const cdtrabajador = ref(localStorage.getItem('usuario') || '')
  const nombre = ref(localStorage.getItem('nombre_usuario') || '')
  const tipo = ref(localStorage.getItem('tipo_trabajador') || '')

  const isAdmin = computed(() => tipo.value === 'A')

  function login({ codigo, nombreUsuario, tipoTrabajador }) {
    cdtrabajador.value = codigo
    nombre.value = nombreUsuario
    tipo.value = tipoTrabajador

    localStorage.setItem('usuario', codigo)
    localStorage.setItem('nombre_usuario', nombreUsuario)
    localStorage.setItem('tipo_trabajador', tipoTrabajador)
  }

  function logout() {
    cdtrabajador.value = ''
    nombre.value = ''
    tipo.value = ''

    localStorage.removeItem('usuario')
    localStorage.removeItem('nombre_usuario')
    localStorage.removeItem('tipo_trabajador')
  }

  return {
    cdtrabajador,
    nombre,
    tipo,
    isAdmin,
    login,
    logout
  }
})
