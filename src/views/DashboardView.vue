<template>
  <div class="min-h-screen bg-base-200 flex">

    <!-- SIDEBAR -->
    <aside class="w-80 bg-base-100 p-6 shadow-lg">
      <div class="border-b border-base-300 mb-6">
        <p class="font-semibold mb-2 text-sm">
          Bem vindo: {{ userEmail }}
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
      <div>
        <h2 class="font-semibold mb-4">Seus dados</h2>

        <p class="mb-6 text-sm text-zinc-500">
          A partir do painel de controle da sua conta, você pode ver seus agendamentos recentes,
          gerenciar seus dados e editar sua senha.
        </p>

        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.name" placeholder="Nome" class="input input-bordered w-full rounded-lg" />
          <input v-model="form.lastname" placeholder="Sobrenome" class="input input-bordered w-full rounded-lg" />

          <input v-model="form.phone" placeholder="Telefone" class="input input-bordered w-full rounded-lg col-span-2" />
          <input v-model="form.email" placeholder="E-mail" class="input input-bordered w-full rounded-lg col-span-2" />
        </div>

        <button class="btn bg-indigo-600 text-white border-none hover:bg-indigo-700  font-medium mt-5">
          Salvar alterações
        </button>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const userEmail = ref('')
const appointments = ref([])

const form = ref({
  name: '',
  lastname: '',
  phone: '',
  email: ''
})

// 🔐 pegar usuário logado
const loadUser = async () => {
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    router.push('/')
    return
  }

  userEmail.value = data.user.email
  form.value.email = data.user.email
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