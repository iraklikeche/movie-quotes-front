import apiClient from '@/api/axios'
import type { AxiosResponse } from 'axios'

export async function getGenres() {
  return await apiClient.get('/api/genres')
}

export async function getMovies() {
  return await apiClient.get('/api/movies')
}

export async function createMovie(formData: FormData): Promise<AxiosResponse<any>> {
  try {
    const response = await apiClient.post('/api/movies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('Movie creation successful:', response)
    return response
  } catch (error) {
    console.error('Failed to create movie:', error)
    throw error
  }
}

export async function getSingleMovie(id) {
  return await apiClient.get(`/api/movies/${id}`)
}
