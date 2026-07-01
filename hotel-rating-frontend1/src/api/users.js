import { api } from './client'

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (userId) => api.get(`/users/${userId}`),
  create: (user) => api.post('/users', user),
}
