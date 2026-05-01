<template>
  <div class="min-h-screen bg-base-200 flex">

    <!-- SIDEBAR -->
    <aside class="w-80 bg-base-100 p-6 shadow-lg">
      <div class="border-b border-base-300 mb-6">
        <p class="font-semibold mb-2 text-sm">
          Bem vindo, <span>{{ profile.name }}</span>
        </p>
      </div>

      <h2 class="font-bold mb-3 text-lg">MENU</h2>

      <ul class="menu bg-base-100 rounded-box flex flex-col gap-3">
        <li><a class="active text-sm text-zinc-700 hover:bg-indigo-200">Painel principal</a></li>
        <li><a class=" text-sm text-zinc-700 hover:bg-indigo-200">Agendamentos</a></li>
        <li><a class=" text-sm text-zinc-700 hover:bg-indigo-200">Detalhes da conta</a></li>
        <li><a class=" text-sm text-zinc-700 hover:bg-indigo-200" @click="logout">Sair</a></li>
      </ul>
    </aside>

    <!-- CONTEÚDO -->
    <main class="flex-1 p-8">

      <!-- Título + botão -->
      <div class="flex justify-between items-center mb-8 border-b border-zinc-400 pb-4">
        <h1 class="text-2xl font-bold">Painel principal</h1>

        <button class="btn bg-indigo-600 text-white border-none hover:bg-indigo-700  font-medium">
          Agendar atendimento
        </button>
      </div>

      <!-- Últimos agendamentos -->
      <div class="mb-8">
        <h2 class="font-semibold mb-4">Últimos agendamentos</h2>

        <div class="overflow-x-auto mb-4">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Especialidade</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Médico</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in appointments" :key="item.id">
                <td>{{ item.specialty }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.doctor }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button class="btn btn-sm bg-indigo-600 text-white border-none hover:bg-indigo-700  font-medium">
          Ver todos
        </button>
      </div>

      <!-- Dados do usuário -->
      <div class="mt-12">
        <h2 class="font-semibold mb-4">Seus dados</h2>

        <p class="mb-6 text-sm text-zinc-500">
          A partir do painel de controle da sua conta, você pode ver seus agendamentos recentes,
          gerenciar seus dados e editar sua senha.
        </p>

        <div class="grid grid-cols-2 gap-4">
          <input v-model="profile.name" placeholder="Nome" class="input input-bordered w-full rounded-lg" />
          <input v-model="profile.lastname" placeholder="Sobrenome" class="input input-bordered w-full rounded-lg" />

          <input v-model="profile.phone" placeholder="Telefone" class="input input-bordered w-full rounded-lg col-span-2" />
          <input v-model="profile.email" placeholder="E-mail" class="input input-bordered w-full rounded-lg col-span-2" />
        </div>

        <!-- @click="saveProfile" -->
        <button 
          class="btn bg-indigo-600 text-white border-none hover:bg-indigo-700  font-medium mt-5">
          Salvar alterações
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import type { Profile, Appointment } from '@/types/user'

const router = useRouter()

const appointments = ref<Appointment[]>([])

const profile = ref<Profile>({
  name: '',
  lastname: '',
  phone: '',
  email: ''
})

// 🔐 pegar usuário logado
const loadUser = async () => {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    router.push('/')
    return
  } else {
    const user = userData.user
    console.log(user);
    
    getProfile(user.id, user.email!)
  }
}

// 🔥 BUSCAR PROFILE
const getProfile = async (id: string, email: string) => {
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single() as { data: Profile | null }

  if (userProfile) {
    profile.value = {
      name: userProfile.name || '',
      lastname: userProfile.lastname || '',
      phone: userProfile.phone || '',
      email: email || ''
    }
  } else {
    console.log("Sem profile nesse id");
    logout()
    
  }
}


// 📅 mock de agendamentos (depois vem do banco)
const loadAppointments = async () => {
  appointments.value = [
    {
      id: 1,
      specialty: 'Ortopedia',
      date: '24/04/2026',
      time: '10:00',
      doctor: 'Dr. João Batista'
    },
    {
      id: 2,
      specialty: 'Ginecologia',
      date: '08/05/2026',
      time: '14:30',
      doctor: 'Dra. Aline Freitas'
    }
  ]
}

// 🚪 logout
const logout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(() => {
  loadUser()
  loadAppointments()
})
</script>