import axios from 'axios'
import router from '@/router'
import Cookies from 'js-cookie'
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
    if (error.response && error.response.status === 403) {
      router.push('/error')
    }
    return Promise.reject(error)
  }
)

apiClient.interceptors.request.use((config) => {
  const language = Cookies.get('locale') || 'en'
  config.headers['Accept-Language'] = language
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('isLoggedIn')
      router.push('/')
    }
    return Promise.reject(error)
  }
)

export default apiClient
