<template>
    <main>
      <div class="flex justify-between items-center mb-8 border-b border-base-300 pb-4">
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

        <button 
          @click="goToAppointments"
          class="btn btn-sm bg-indigo-600 text-white border-none hover:bg-indigo-700  font-medium">
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

        <div v-if="profile" class="grid grid-cols-2 gap-4">
          <input v-model="profile.name" class="input input-bordered w-full rounded-lg border border-zinc-300 text-zinc-600" disabled />
          <input v-model="profile.lastname" class="input input-bordered w-full rounded-lg border border-zinc-300 text-zinc-600" disabled />

          <input v-model="profile.phone" class="input input-bordered w-full rounded-lg col-span-2 border border-zinc-300 text-zinc-600" disabled />
          <input v-model="profile.email" class="input input-bordered w-full rounded-lg col-span-2 border border-zinc-300 text-zinc-600" disabled/>
        </div>
      </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

import type { Appointment } from '@/types/user'

const router = useRouter()
const auth = useAuthStore()
const { profile } = storeToRefs(auth)

const appointments = ref<Appointment[]>([])


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

const goToAppointments = () => {
  router.push('/app/appointments')
}

onMounted(() => {
  loadAppointments()
})
</script>