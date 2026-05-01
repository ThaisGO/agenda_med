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