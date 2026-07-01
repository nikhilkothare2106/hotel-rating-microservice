import { api } from './client'

export const hotelsApi = {
  getAll: () => api.get('/hotels'),
  getById: (id) => api.get(`/hotels/${id}`),
  create: (hotel) => api.post('/hotels', hotel),
}
