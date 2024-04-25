import axios from 'axios'

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

export default apiClient
