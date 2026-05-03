export interface Profile {
    id?: string
    name: string
    lastname: string
    phone: string
    email: string
}

export interface Appointment {
    id: string | number
    specialty: string
    date: string
    time: string
    doctor: string
}

export interface Doctor {
    id: string
    name: string
    specialty: string
    created_at?: string
}

export interface DoctorAvailability {
    id: string
    doctor_id: string
    day_of_week: number
    start_time: string
    end_time: string
}

export interface Appointment {
    id: string | number
    user_id: string
    doctor_id: string
    appointment_datetime: string
    created_at?: string
}

export interface TimeSlot {
    time: string
    available: boolean
}

export interface TimeSlot {
  time: string       // "08:00"
  available: boolean // true ou false
}