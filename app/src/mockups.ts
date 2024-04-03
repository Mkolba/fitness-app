import {ITrainer, IWorkout} from "./types";

export const trainersDataMockup: ITrainer[] = [
  {
    id: 1,
    first_name: 'Иван',
    last_name: 'Иванов',
    token: 'kek'
  },
  {
    id: 2,
    first_name: 'Сергей',
    last_name: 'Сергеев',
    token: 'kek'
  },
  {
    id: 3,
    first_name: 'Владимир',
    last_name: 'Владимиров',
    token: 'kek'
  },
]

export const workoutsDataMockup: IWorkout[] = [
  {
    id: 1,
    date: '2024-03-22T14:00:00.000Z',
    client: {
      first_name: 'Егор',
      last_name: 'Ошкин',
      phone_number: '',
      id: 1
    },
    workout_type: {
      title: '',
      price: 1,
      id: 1
    },
    trainer: trainersDataMockup[0],
    status: 'pending',
  }
]