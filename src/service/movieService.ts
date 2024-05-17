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

export async function getQuotes(searchQuery = '') {
  const params = searchQuery ? { search: searchQuery } : {}
  return await apiClient.get('/api/quotes', { params })
}

export async function toggleLike(quoteId: number) {
  return await apiClient.post(`/api/quotes/${quoteId}/likes`)
}
