import apiClient from '@/api/axios.js'

export async function getCsrfCookie() {
  return await apiClient.get('/sanctum/csrf-cookie', { withCredentials: true })
}

export async function registerUser(values) {
  const payload = {
    ...values,
    agreed_to_terms: values.agreed_to_terms === 'true',
    password_confirmation: values.password_confirmation
  }

  await apiClient.post('api/register', payload)
}

export async function loginUser(credentials) {
  return await apiClient.post('api/login', credentials)
}

export async function logoutUser() {
  return await apiClient.post('api/logout')
}

export async function verifyEmail(path) {
  const response = await apiClient.get(path)
  return response
}

export async function forgotPassword(email) {
  return await apiClient.post('api/forgot-password', { email })
}

export async function resetPassword(data) {
  const response = await apiClient.post('/api/reset-password', data)
  return response
}

export async function resendPasswordResetLink(email) {
  const response = await apiClient.post('/api/reset-password/resend', { email })
  return response
}

export async function signUpWithGoogle() {
  const response = await apiClient.get('/api/auth/redirect')
  return response
}

export async function callBack(code) {
  const response = await apiClient.get('/api/auth/callback', { params: code })
  return response
}
