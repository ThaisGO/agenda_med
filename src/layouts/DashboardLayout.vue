<template>
    <div class="min-h-screen bg-base-200 flex flex-col md:flex-row">

    <!-- SIDEBAR -->
        <aside class="w-full md:w-80 bg-base-100 p-6 shadow-lg">
            <div class="border-b border-base-300 mb-6">
                <p class="text-sm pb-3">
                    Bem-vindo, 
                    <span class="font-semibold">{{ profile?.name }}</span>
                </p>
            </div>

            <h2 class="font-bold mb-3 text-lg">MENU</h2>
            <ul class="menu flex md:flex-col gap-2">
                <li>
                    <router-link to="/app/dashboard" active-class="bg-indigo-600 text-white">
                        Painel
                    </router-link>
                </li>

                <li>
                    <router-link to="/app/appointments"  active-class="bg-indigo-600 text-white">
                        Agendamentos
                    </router-link>
                </li>

                <li>
                    <router-link to="/app/account" active-class="bg-indigo-600 text-white">
                        Conta
                    </router-link>
                </li>

                <li>
                    <a @click="logout">Sair</a>
                </li>
            </ul>
        </aside>

        <!-- CONTEÚDO -->
        <main class="flex-1 p-4 md:p-8">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth'
    import { storeToRefs } from 'pinia'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const auth = useAuthStore()
    const { profile } = storeToRefs(auth)
    

    const logout = async () => {
        await auth.logout()
        router.push('/')
    }
</script>