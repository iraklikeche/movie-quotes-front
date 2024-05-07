import axios from 'axios'
import router from '@/router'

const baseURL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  xsrfCookieName: 'XSRF-TOKEN',
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 500) {
      router.push('/error')
    }
    return Promise.reject(error)
  }
)

export default apiClient
