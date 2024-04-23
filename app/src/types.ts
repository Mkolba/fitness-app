export interface IUser {
  id: number
}

export type UserType = 'sudo' | 'admin' | 'trainer' | 'not_authorized';

export type WorkoutStatusType = 'done' | 'cancelled' | 'pending'

export interface ITrainer {
  id: number
  first_name: string
  last_name: string
  token: string
}

export interface ITrainerSalary {
  cash: number
}

export interface IClient {
  id: number
  first_name: string
  last_name: string
  surname: string
}

export interface IAdmin {
  id: number,
  first_name: string,
  last_name: string,
  login: string,
  password: string,
  super: boolean
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