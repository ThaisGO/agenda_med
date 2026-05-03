import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/user'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        profile: null as Profile | null,
        loading: false
    }),

    actions: {
        async login(email: string, password: string) {
            this.loading = true
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error) throw error

                this.user = data.user

                if (this.user) {
                    await this.fetchProfile()
                }
            } finally {
                this.loading = false
            }
        },

        async fetchUser() {
            const { data } = await supabase.auth.getUser()
                this.user = data.user

            if (this.user) {
                await this.fetchProfile()
                
            }
        },

        async fetchProfile() {
            this.loading = true
            try {
                const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', this.user.id)
                .single()

            this.profile = {
                ...data,
                email: this.user.email || ''
            }
            } finally {
                this.loading = false
            }
        },

        async logout() {
            await supabase.auth.signOut()
            this.user = null
            this.profile = null
        }
    }
})