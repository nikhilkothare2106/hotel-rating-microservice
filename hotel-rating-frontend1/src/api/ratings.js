import { api } from './client'

export const ratingsApi = {
  getAll: () => api.get('/ratings'),
  getById: (id) => api.get(`/ratings/${id}`),
  getByUserId: (userId) => api.get(`/ratings/users/${userId}`),
  getByHotelId: (hotelId) => api.get(`/ratings/hotels/${hotelId}`),
  create: (rating) => api.post('/ratings', rating),
}
