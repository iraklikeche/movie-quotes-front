import apiClient from '@/api/axios'
import type { AxiosResponse } from 'axios'
import type {
  UserRegistration,
  UserCredentials,
  ResetPasswordData,
  CheckTokenData,
  UserProfileUpdate
} from '@/types'

export async function getCsrfCookie(): Promise<AxiosResponse> {
  return await apiClient.get('/sanctum/csrf-cookie', { withCredentials: true })
}

export async function registerUser(values: UserRegistration): Promise<void> {
  const payload = {
    ...values,
    password_confirmation: values.password_confirmation
  }

  await apiClient.post('api/register', payload)
}

export async function loginUser(credentials: UserCredentials): Promise<AxiosResponse> {
  return await apiClient.post('api/login', credentials)
}

export async function logoutUser(): Promise<AxiosResponse> {
  return await apiClient.post('api/logout')
}

export async function verifyEmail(path: string): Promise<AxiosResponse> {
  return await apiClient.get(path)
}

export async function forgotPassword(email: string): Promise<AxiosResponse> {
  return await apiClient.post('api/forgot-password', { email })
}

export async function resetPassword(data: ResetPasswordData): Promise<AxiosResponse> {
  return await apiClient.post('/api/reset-password', data)
}

export async function resendPasswordResetLink(email: string): Promise<AxiosResponse> {
  return await apiClient.post('/api/reset-password/resend', { email })
}

export async function resendVerificationLink(userId: number): Promise<AxiosResponse> {
  return await apiClient.post('/api/email/resend', { id: userId })
}

export async function signUpWithGoogle(): Promise<AxiosResponse> {
  return await apiClient.get('/api/auth/redirect')
}

export async function callBack(code: string): Promise<AxiosResponse> {
  return await apiClient.get('/api/auth/callback', { params: { code } })
}

export async function checkTokenValidity(data: CheckTokenData): Promise<AxiosResponse> {
  return await apiClient.post('/api/check-token-validity', data)
}

export async function getUser() {
  const response = await apiClient.get('api/user')
  return response
}

export async function updateUserProfile(
  updateData: UserProfileUpdate,
  file?: File
): Promise<AxiosResponse> {
  const formData = new FormData()
  ;(Object.keys(updateData) as (keyof UserProfileUpdate)[]).forEach((key) => {
    const value = updateData[key]
    if (value !== undefined) {
      formData.append(key, value)
    }
  })

  if (file) {
    formData.append('profile_image', file)
  }

  try {
    const response = await apiClient.post('api/user/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}
