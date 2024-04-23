
import {
  IAdmin,
  IClient,
  ITrainer,
  ITrainerSalary,
  IWorkout,
  IWorkoutType,
  WorkoutStatusType
} from "./types";
import {accessTokenAtom} from "./store";

const BASE_ENDPOINT = process.env.REACT_APP_ENDPOINT || 'https://fitness.graphbots.ru'
type RequestType = 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'GET'


function parseJwt (token: string) {
  if (token) {
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch(err) {
    }
  }
}

class API {
  getToken() {
    const token = localStorage.getItem('jwt-access-token')
    return {payload: token ? parseJwt(token) : '', token: token}
  }

  async call(path: string, type: RequestType, params: any = {}) {
    let token = ''
    if (!['/auth/admin/sign-in', '/auth/trainer/sign-in'].includes(path)) {
      token = this.getToken()['token'] as string;
    }

    let headers: any = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};

    let options = {
      method: type,
      body: params.formData ? params.formData : JSON.stringify(params),
      headers: headers
    }
    if (type === 'GET') {
      delete options.body
    }
    if (params.formData) {
      delete headers["Content-Type"]
    }
    return fetch(`${BASE_ENDPOINT}${path}`, {...options}).then(response => {
      const contentType = response.headers.get('Content-Type') || '';
      if (response.ok && contentType.includes('application/json')) {
        return response.json().catch(() => {
          return Promise.reject('500');
        });
      }
      if (response.status === 401) {
        return Promise.reject(401)
      }

      if (![200, 503].includes(response.status)) {
        return Promise.reject(response.json().then(data => {
          if (Array.isArray(data.detail)) {
            return {detail: data.detail[0].msg}
          } else {
            return data
          }
        }))
      }
    }).catch(error => {
      return Promise.reject(error)
    });
  }

  async authAdmin(login: string, password: string) {
    return this.call('/auth/admin/sign-in', 'POST', {login: login, password: password}).then(data => {
      localStorage.setItem('jwt-access-token', data.token)
      accessTokenAtom.set(data.token)
      return 'ok'
    })
  }

  async authTrainer(token: string) {
    return this.call('/auth/trainer/sign-in', 'POST', {token: token}).then(data => {
      localStorage.setItem('jwt-access-token', data.token)
      accessTokenAtom.set(data.token)
      return 'ok'
    })
  }

  async createTrainer(firstName: string, lastName: string) {
    return this.call('/fitness/trainer/create', 'POST', {
      first_name: firstName,
      last_name: lastName
    })
  }

  async editTrainer(id: number, firstName: string, lastName: string) {
    return this.call('/fitness/trainer/edit', 'POST', {
      id: id,
      first_name: firstName,
      last_name: lastName,
    })
  }

  async getTrainer(id: number): Promise<ITrainer> {
    return this.call(`/fitness/trainer?id=${id}`, 'GET')
  }

  async getTrainers(): Promise<ITrainer[]> {
    return this.call('/fitness/trainer/list', 'GET')
  }

  async getTodayTrainerSalary(): Promise<ITrainerSalary> {
    return this.call('/fitness/trainer/cash/day', 'GET')
  }

  async getMonthTrainerSalary(): Promise<ITrainerSalary> {
    return this.call('/fitness/trainer/cash/month', 'GET')
  }

  async createAdmin(firstName: string, lastName: string, login: string, password: string, sudo: boolean) {
    return this.call('/fitness/admin/create', 'POST', {
      first_name: firstName,
      last_name: lastName,
      login: login,
      password: password,
      super: sudo
    })
  }

  async editAdmin(id: number, firstName: string, lastName: string, login: string, password: string, sudo: boolean) {
    return this.call('/fitness/admin/edit', 'POST', {
      id: id,
      first_name: firstName,
      last_name: lastName,
      login: login,
      password: password,
      super: sudo
    })
  }

  async getAdmin(id: number): Promise<IAdmin> {
    return this.call(`/fitness/admin?id=${id}`, 'GET')
  }

  async getAdmins(): Promise<IAdmin[]> {
    return this.call('/fitness/admin/list', 'GET')
  }

  async deleteAdmin(id: number) {
    return this.call(`/fitness/admin/delete?id=${id}`, 'GET')
  }

  async createClient(firstName: string, lastName: string, surname: string) {
    return this.call('/fitness/client/create', 'POST', {
      first_name: firstName,
      last_name: lastName,
      surname: surname
    })
  }

  async editClient(id: number, firstName: string, lastName: string, surname: string) {
    return this.call('/fitness/client/edit', 'POST', {
      id: id,
      first_name: firstName,
      last_name: lastName,
      surname: surname
    })
  }

  async getClient(id: number): Promise<IClient> {
    return this.call(`/fitness/client?id=${id}`, 'GET')
  }

  async getClients(): Promise<IClient[]> {
    return this.call('/fitness/client/list', 'GET')
  }

  async createWorkoutType(title: string, price: number) {
    return this.call('/fitness/workout/type/create', 'POST', {
      title: title,
      price: price
    })
  }

  async editWorkoutType(id: number, title: string, price: number) {
    return this.call('/fitness/workout/type/edit', 'POST', {
      title: title,
      price: price
    })
  }

  async getWorkoutTypes(): Promise<IWorkoutType[]> {
    return this.call('/fitness/workout/type/list', 'GET')
  }

  async getWorkoutType(id: number): Promise<IWorkoutType> {
    return this.call(`/fitness/workout/type?id=${id}`, 'GET')
  }

  async createWorkout(clientId: number, trainerId: number, workoutTypeId: number, date: Date) {
    return this.call('/fitness/workout/create', 'POST', {
      client_id: clientId,
      trainer_id: trainerId,
      workout_type_id: workoutTypeId,
      date: date.toISOString()
    })
  }

  async editWorkout(id: number, clientId: number, trainerId: number, workoutTypeId: number, date: Date) {
    return this.call('/fitness/workout/edit', 'POST', {
      id: id,
      client_id: clientId,
      trainer_id: trainerId,
      workout_type_id: workoutTypeId,
      date: date.toISOString()
    })
  }

  async setWorkoutStatus(id: number, status: WorkoutStatusType) {
    return this.call(`/fitness/workout/change-status?id=${id}&status=${status}`, 'GET')
  }

  async deleteWorkout(id: number) {
    return this.call(`/fitness/workout/delete?id=${id}`, 'GET')
  }

  async getWorkoutsByDate(date: Date): Promise<IWorkout[]> {
    return this.call(`/fitness/workout/list-by-date?date=${date.toISOString()}`, 'GET')
  }

  async getWorkoutsByInterval(startDate: Date, endDate: Date): Promise<IWorkout[]> {
    return this.call(`/fitness/workout/list-by-interval?from=${startDate.toISOString()}&to=${endDate.toISOString()}`, 'GET')
  }

  async getWorkoutsByTrainer(trainerId: number): Promise<IWorkout[]> {
    return this.call(`/fitness/workout/list?trainer_id=${trainerId}`, 'GET')
  }

  async getWorkoutsByClient(clientId: number): Promise<IWorkout[]> {
    return this.call(`/fitness/workout/list?client_id=${clientId}`, 'GET')
  }

  async getWorkout(id: number) {
    return this.call(`/fitness/workout?id=${id}`, 'GET')
  }
}

export const api = new API();