import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/user'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        profile: null as Profile | null,
    }),

    actions: {
        async login(email: string, password: string) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            this.user = data.user

            if (this.user) {
                await this.fetchProfile()
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
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', this.user.id)
                .single()

            this.profile = {
                ...data,
                email: this.user.email || ''
            }

        },

        async logout() {
            await supabase.auth.signOut()
            this.user = null
            this.profile = null
        }
    }
})