import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/profile',
      name: 'profile',

      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/auth/callback',
      name: 'google',
      component: () => import('../views/GoogleVerification.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/MoviesView.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/errors/ServerError.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: () => import('../views/errors/NotFound404.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.path === '/auth/callback') {
    next()
  } else if (!isLoggedIn && to.path !== '/') {
    next({ name: 'home' })
  } else if (isLoggedIn && to.path === '/') {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
