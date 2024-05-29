import apiClient from '@/api/axios'
import type { AxiosResponse } from 'axios'

export async function getGenres() {
  return await apiClient.get('/api/genres')
}

export async function getMovies() {
  return await apiClient.get('/api/movies')
}

export async function createMovie(formData: FormData): Promise<AxiosResponse<any>> {
  const response = await apiClient.post('/api/movies', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  console.log('Movie creation successful:', response)
  return response
}

export async function updateMovie(
  movieId: number,
  formData: FormData
): Promise<AxiosResponse<any>> {
  return await apiClient.post(`/api/movies/${movieId}`, formData, {
    params: {
      _method: 'patch'
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export async function getSingleMovie(id: number | string) {
  return await apiClient.get(`/api/movies/${id}`)
}

export async function deleteMovie(id: number | string) {
  return await apiClient.delete(`/api/movies/${id}`)
}

export async function createQuote(formData: FormData): Promise<AxiosResponse<any>> {
  const response = await apiClient.post('/api/quotes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  console.log('Quote creation successful:', response)
  return response
}

export const getQuotes = (searchQuery = '', page = 1, perPage = 2) => {
  return apiClient.get('/api/quotes', {
    params: {
      search: searchQuery,
      page: page,
      per_page: perPage
    }
  })
}

export const getSingleQuote = (id: number) => {
  return apiClient.get(`api/quotes/${id}`)
}

export async function toggleLike(quoteId: number) {
  return await apiClient.post(`/api/quotes/${quoteId}/likes`)
}

export async function getComments(quoteId: number) {
  return await apiClient.get(`/api/quotes/${quoteId}/comments`)
}

export async function addComment(quoteId: number, content: string) {
  return await apiClient.post(`/api/quotes/${quoteId}/comments`, { content })
}

export async function getQuotesByMovie(movieId: string) {
  return await apiClient.get(`/api/movies/${movieId}/quotes`)
}

export async function deleteQuote(id: number) {
  return await apiClient.delete(`/api/quotes/${id}`)
}

export async function updateQuote(
  quoteId: number,
  formData: FormData
): Promise<AxiosResponse<any>> {
  return await apiClient.post(`/api/quotes/${quoteId}`, formData, {
    params: {
      _method: 'patch'
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export async function getNotifications() {
  return await apiClient.get('/api/notifications')
}

export const markAllNotificationsAsRead = async () => {
  return await apiClient.post('/api/notifications/mark-all-read')
}

export const markNotificationAsRead = async (id: number) => {
  return await apiClient.post(`/api/notifications/${id}/mark-read`)
}
