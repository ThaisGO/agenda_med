<template>
    <main>
      <div class="flex justify-between items-center mb-8 border-b border-base-300 pb-4">
        <h1 class="text-2xl font-bold">Painel principal</h1>

        <button 
          onclick="agendarModal.showModal()"
          class="btn bg-indigo-600 text-white border-none hover:bg-indigo-700  font-medium">
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

        <div v-if="loading && !profile" class="grid grid-cols-2 gap-4">
          <div class="skeleton h-8 w-full mb-4"></div>
          <div class="skeleton h-8 w-full mb-4"></div>
          <div class="skeleton h-8 w-full mb-4"></div>
          <div class="skeleton h-8 w-full mb-4"></div>
        </div>
        <div v-else-if="profile" class="grid grid-cols-2 gap-4">
          <input v-model="profile.name" class="input input-bordered w-full rounded-lg border border-zinc-300 text-zinc-600" disabled />
          <input v-model="profile.lastname" class="input input-bordered w-full rounded-lg border border-zinc-300 text-zinc-600" disabled />

          <input v-model="profile.phone" class="input input-bordered w-full rounded-lg col-span-2 border border-zinc-300 text-zinc-600" disabled />
          <input v-model="profile.email" class="input input-bordered w-full rounded-lg col-span-2 border border-zinc-300 text-zinc-600" disabled/>
        </div>
      </div>
    </main>



    <!-- Modal de agendamento -->
    <dialog id="agendarModal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="text-lg font-bold">Hello!</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control w-full">

            <!-- Especialidade -->
            <label for="especialidade" class="label">
              <span class="label-text">Especialidade</span>
              <span class="label-text-alt text-sm text-error">Obrigatório</span>
            </label>

            <select 
              v-model="selectedSpecialty"
              id="especialidade" 
              class="select select-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-700">
              <option disabled value="">Escolha uma especialidade</option>
              <option v-for="s in specialties" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </div>

          <!-- Médico(a) -->
          <div class="form-control w-full">
            <label for="medico" class="label">
              <span class="label-text">Médico(a)</span>
              <span class="label-text-alt text-sm text-error">Obrigatório</span>
            </label>

            <select 
              v-model="selectedDoctor"
              id="medico" 
              :disabled="!selectedSpecialty"
              class="select select-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-700">
              <option disabled value="">Escolha um médico</option>
              <option 
                v-for="doc in filteredDoctors" :key="doc.id" :value="doc.id">
                  {{ doc.name }}
                </option>
            </select>
          </div>

          <!-- Data -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Data</span>
              <span class="label-text-alt text-sm text-error">Obrigatório</span>
            </label>

            <input
              type="date"
              v-model="date"
              class="input input-bordered w-full"
              :min="new Date().toISOString().split('T')[0]"
            />
          </div>

          <!-- Hora -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Horário</span>
              <span class="label-text-alt text-sm text-error">Obrigatório</span>
              <span class="label-text-alt text-sm text-error">Selecione horario entre 08:00 e 18:00</span>
            </label>

            <select 
              v-model="time"
              :disabled="!date || !selectedDoctor"
              class="select select-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-700">
              <option disabled value="">Escolha um horário</option>

              <option
                v-for="slot in timeSlots"
                :key="slot.time"
                :value="slot.time"
                :disabled="!slot.available"
              >
                {{ slot.time }} {{ slot.available ? '' : '(Indisponível)' }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button 
          @click="handleSubmit"
          class="btn bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Confirmar agendamento
        </button>
      </div>
    </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useDoctorStore } from '@/stores/doctor'
import { storeToRefs } from 'pinia'

import type { Appointment, TimeSlot } from '@/types/user'


const router = useRouter()
const auth = useAuthStore()
const { profile } = storeToRefs(auth)
const { loading } = storeToRefs(auth)

const doctorStore = useDoctorStore()
const { doctors, specialties } = storeToRefs(doctorStore)

const selectedDoctor = ref('')
const selectedSpecialty = ref('')
const timeSlots = ref<TimeSlot[]>([])

const date = ref('')
const time = ref('')

const errors = ref({
  specialty: '',
  doctor: '',
  date: '',
  time: ''
})

const validateForm = () => {
  errors.value = {
    specialty: '',
    doctor: '',
    date: '',
    time: ''
  }

  let isValid = true

  if (!selectedSpecialty.value) {
    errors.value.specialty = 'Selecione uma especialidade'
    isValid = false
  }

  if (!selectedDoctor.value) {
    errors.value.doctor = 'Selecione um médico'
    isValid = false
  }

  if (!date.value) {
    errors.value.date = 'Selecione uma data'
    isValid = false
  }

  if (!time.value) {
    errors.value.time = 'Selecione um horário'
    isValid = false
  }

  return isValid
}

const appointments = ref<Appointment[]>([])

const handleSubmit = () => {
  console.log("submit");
  
}

const generateTimeSlots = (availability: any[], appointments: any[]) => {
  const slots: TimeSlot[] = []

  availability.forEach((period) => {
    let current = period.start_time.slice(0, 5)
    const end = period.end_time.slice(0, 5)

    while (current < end) {
      const isTaken = appointments.some(a => {
        const time = a.appointment_datetime.slice(11, 16)
        return time === current
      })

      slots.push({
        time: current,
        available: !isTaken
      })

      const [h, m] = current.split(':').map(Number)
      const d = new Date()
      d.setHours(h)
      d.setMinutes(m + 60)

      current = d.toTimeString().slice(0, 5)
    }
  })

  return slots
}

watch([selectedDoctor, date], async () => {
  console.log('WATCH DISPAROU')
  console.log('doctor:', selectedDoctor.value)
  console.log('date:', date.value)

  if (!selectedDoctor.value || !date.value) return

  const day = new Date(date.value).getDay()
  console.log('day calculado:', day)

  const availability = await doctorStore.fetchAvailability(
    selectedDoctor.value,
    day
  )
  console.log('📅 availability:', availability)

  const appointments = await doctorStore.fetchAppointments(
    selectedDoctor.value,
    date.value
  )
  console.log('📌 appointments:', appointments)

  timeSlots.value = generateTimeSlots(availability || [], appointments || [])
   console.log('🟢 slots gerados:', timeSlots)

   console.log('doctor selecionado:', selectedDoctor.value)
})

watch(selectedSpecialty, () => {
  selectedDoctor.value = ''
})

const filteredDoctors = computed(() => {
  return doctors.value.filter(
    d => d.specialty === selectedSpecialty.value
  )
})

const getDayOfWeek = (date: string) => {
  return new Date(date).getDay() // 0 = domingo
}

const getDateTime = () => {
  if (!date.value || !time.value) return null

  return `${date.value}T${time.value}:00`
}

const goToAppointments = () => {
  router.push('/app/appointments')
}

onMounted(() => {
  doctorStore.fetchDoctors()
})
</script>