import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase.js'
// import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import  AccountDetailsView  from '@/views/AccountDetailsView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // { path: '/', component: HomeView },
    { path: '/dashboard', component: DashboardView },
    { path: '/details', component: AccountDetailsView },
    { path: '/', component: LoginView }
  ],
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()

  if (to.path === '/dashboard' && !data.session) {
    next('/')
  } else {
    next()
  }
})

export default router