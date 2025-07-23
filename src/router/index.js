import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import MainPage from '@/views/MainPage.vue'
import ViajesPage from '@/views/ViajesPage.vue'
import AvisosPage from '@/views/AvisosPage.vue'
import DietasPage from '@/views/DietasPage.vue'
import DietaDetalle from '@/views/DietaDetalle.vue'
import ViajeDetalle from '@/views/ViajeDetalle.vue'




const routes = [
    {
    path: '/',
    redirect: '/login',
    component: LoginPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'Iniciar sesión' }
  },
  { path: '/main', component: MainPage, meta: { title: 'Página principal' } },
  { path: '/avisos', component: AvisosPage, meta: { title: 'Avisos' } },
  { path: '/viajes', component: ViajesPage, meta: { title: 'Viajes' }  },
  { path: '/viaje/nuevo', component: ViajeDetalle, meta: { title: 'Nuevo Viaje' } },
  { path: '/viaje/:id?', component: ViajeDetalle, meta: { title: 'Detalle del Viaje' } },
  { path: '/dietas', component: DietasPage, meta: { title: 'Dietas' } },
  { path: '/dietas/nueva', component: DietaDetalle, meta: { title: 'Nueva Dieta' } },
  { path: '/dietas/:cddieta', component: DietaDetalle, meta: { title: 'Detalle de la Dieta' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Protección de rutas (excepto login)
router.beforeEach((to, from, next) => {
  const usuario = localStorage.getItem('usuario')
  if (!usuario && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
