export interface IUser {
  id: number
}

export type WorkoutStatusType = 'done' | 'cancelled' | 'pending'

export interface ITrainer {
  id: number
  first_name: string
  last_name: string
  token: string
}

export interface IClient {
  id: number
  first_name: string
  last_name: string
  phone_number: string
}

export interface IWorkoutType {
  id: number
  title: string
  price: number
}

export interface IWorkout {
  id: number
  client: IClient
  trainer: ITrainer
  workout_type: IWorkoutType
  status: WorkoutStatusType
  date: string
}