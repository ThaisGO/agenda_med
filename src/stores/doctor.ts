import { defineStore } from "pinia";        
import { supabase } from '@/lib/supabase'
import type { Doctor } from '@/types/doctor'

export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    doctors: [] as Doctor[],
    loading: false,
  }),

  getters: {
    specialties(state): string[] {
      return [...new Set(state.doctors.map((d: Doctor) => d.specialty))]
    },

    getDoctorsBySpecialty: (state) => {
      return (specialty: string): Doctor[] =>
        state.doctors.filter((d: Doctor) => d.specialty === specialty)
    }
  },

  actions: {
    async fetchDoctors(): Promise<Doctor[] | null> {
      this.loading = true

      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')

        if (error) throw error

        this.doctors = data as Doctor[]
        return this.doctors

      } catch (error) {
        console.error('Error fetching doctors:', error)
        return null

      } finally {
        this.loading = false
      }
    },

    async fetchAvailability(doctorId: string, day: number) {
      const { data } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('day_of_week', day)

      return data
    },

    async fetchAppointments(doctorId: string, date: string) {
      const start = `${date}T00:00:00`
      const end = `${date}T23:59:59`

      const { data } = await supabase
        .from('appointments')
        .select('appointment_datetime')
        .eq('doctor_id', doctorId)
        .gte('appointment_datetime', start)
        .lte('appointment_datetime', end)

      return data
    }
  }
})