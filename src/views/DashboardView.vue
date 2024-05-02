<template>
  <div>
    <button @click="onLogout">Log out</button>
  </div>
</template>

<script setup lang="ts">
import { logoutUser, getCsrfCookie } from '@/service/authService.ts'
import { useRouter } from 'vue-router'
const router = useRouter()

const onLogout = async () => {
  await getCsrfCookie()
  try {
    await logoutUser()
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  } catch (error) {
    //
  }
}
</script>
