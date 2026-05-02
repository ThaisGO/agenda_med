import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase.js'

import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    {
      path: '/app',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: 'appointments',
          component: () => import('@/views/AppointmentsView.vue')
        },
        {
          path: 'account',
          component: () => import('@/views/AccountDetailsView.vue')
        }
      ]
    }
  ],
})

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()

  const isAuthenticated = !!data.session
  const isAppRoute = to.path.startsWith('/app')

  if (isAppRoute && !isAuthenticated) {
    return '/'
  }

  if (to.path === '/' && isAuthenticated) {
    return '/app/dashboard'
  }

  return true
})

export default router