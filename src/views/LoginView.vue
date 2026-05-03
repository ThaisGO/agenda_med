<template>
  <div class="min-h-screen flex items-center justify-center bg-base-300">
    <div class="w-full max-w-md p-8 bg-base-100 rounded-2xl shadow-lg">
      
    <!-- Título -->
    
      <h1 class="text-3xl font-bold text-center mb-8 text-zinc-800">Login</h1>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <!-- Email -->
        <div>
          <label class="label">
            <span class="label-text text-zinc-700 font-medium mb-2">E-mail</span>
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="Digite seu e-mail"
            class="input w-full bg-zinc-200 rounded-lg border-none outline-0"
            required
          />
        </div>

        <!-- Senha -->
        <div class="mb-8">
          <label class="label">
            <span class="label-text text-zinc-700 font-medium mb-2">Senha</span>
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            class="input w-full bg-zinc-200 rounded-lg border-none outline-0"
            required
          />
        </div>

        <!-- Botão -->
        <button @click="handleLogin" class="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none">
          <span v-if="loading" class="loading loading-spinner bg-white"></span>
          <span v-else>Acessar</span>
        </button>

        <!-- Esqueci senha -->
        <p class="text-xs underline text-indigo-600 text-right">
          <a href="#" class="link link-hover">
            Perdeu sua senha?
          </a>
        </p>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const email = ref('demo@teste.com')
const password = ref('123456')

const router = useRouter()
const auth = useAuthStore()
const { loading } = storeToRefs(auth)

const handleLogin = async () => {
  try {
    await auth.login (email.value, password.value)
    router.push('/app/dashboard')
  } catch (error) {
    alert('Erro ao fazer login: ' + error.message)
  }
}
</script>